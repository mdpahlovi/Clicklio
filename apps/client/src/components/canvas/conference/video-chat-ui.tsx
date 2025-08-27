import { socket, socketResponse } from "@/utils/socket";
import { Box, Divider, Stack, TabPanel, Typography } from "@mui/joy";
import { Device, type types } from "mediasoup-client";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import StartVideoChat from "./start-video-chat";
import VideoController from "./video-controller";

type CreateTransportResponse = {
    id: string;
    iceParameters: types.IceParameters;
    iceCandidates: types.IceCandidate[];
    dtlsParameters: types.DtlsParameters;
    sctpParameters: types.SctpParameters;
    producers: { id: string; kind: types.MediaKind }[];
};

type ConnectTransportResponse = {
    producers: { id: string; kind: types.MediaKind }[];
};

type CreateProducerResponse = {
    id: string;
};

type CreateConsumerResponse = {
    id: string;
    producerId: string;
    kind: types.MediaKind;
    rtpParameters: types.RtpParameters;
};

type RemoteStream = {
    id: string;
    stream: MediaStream;
    kind: types.MediaKind;
    consumer: types.Consumer;
};

type DeleteProducerPayload = {
    transports: string[];
    producers: string[];
    consumers: string[];
};

export default function VideoChatUI({ room, device }: { room: string; device: Device }) {
    const sendTransportRef = useRef<types.Transport | null>(null);
    const recvTransportRef = useRef<types.Transport | null>(null);
    const pendingConsumersRef = useRef<Set<string>>(new Set());

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<Map<string, RemoteStream>>(new Map());
    const [isStarted, setIsStarted] = useState(false);

    const cleanUp = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => {
                track.stop();
            });
        }

        remoteStreams.forEach(({ stream, consumer }) => {
            stream.getTracks().forEach((track) => track.stop());
            consumer.close();
        });

        if (sendTransportRef.current) {
            sendTransportRef.current.close();
            sendTransportRef.current = null;
        }

        if (recvTransportRef.current) {
            recvTransportRef.current.close();
            recvTransportRef.current = null;
        }

        pendingConsumersRef.current.clear();
    };

    useEffect(() => {
        const handleCreateProducer = ({ id, kind }: { id: string; kind: types.MediaKind }) => {
            createConsumer(device, id, kind);
        };

        const handleDeleteProducer = ({ producers }: DeleteProducerPayload) => {
            setRemoteStreams((prev) => {
                const newMap = new Map(prev);

                producers.forEach((producerId) => {
                    const remoteStream = newMap.get(producerId);
                    if (remoteStream) {
                        remoteStream.stream.getTracks().forEach((track) => track.stop());
                        remoteStream.consumer.close();
                        newMap.delete(producerId);
                    }
                });

                return newMap;
            });

            producers.forEach((producerId) => {
                const audioElement = document.getElementById(`audio-${producerId}`);
                if (audioElement) {
                    audioElement.remove();
                }
            });
        };

        socket.on("create:producer", handleCreateProducer);
        socket.on("delete:producer", handleDeleteProducer);

        return () => {
            socket.off("create:producer", handleCreateProducer);
            socket.off("delete:producer", handleDeleteProducer);
            cleanUp();
        };
    }, [device]);

    const createReceiveTransport = async (device: Device): Promise<types.Transport> => {
        if (recvTransportRef.current) return recvTransportRef.current;

        try {
            const response = await socketResponse<CreateTransportResponse>("create:receive:transport", { room });

            const recvTransport = device.createRecvTransport({
                id: response.data.id,
                iceParameters: response.data.iceParameters,
                iceCandidates: response.data.iceCandidates,
                dtlsParameters: response.data.dtlsParameters,
                sctpParameters: response.data.sctpParameters,
            });

            recvTransport.on("connect", async ({ dtlsParameters }, callback, errBack) => {
                try {
                    await socketResponse("connect:receive:transport", {
                        room,
                        transportId: recvTransport.id,
                        dtlsParameters,
                    });
                    callback();
                } catch (error) {
                    errBack(error as Error);
                }
            });

            recvTransportRef.current = recvTransport;
            return recvTransport;
        } catch (error) {
            throw new Error("Failed to create receive transport");
        }
    };

    const createConsumer = async (device: Device, producerId: string, kind: types.MediaKind) => {
        if (pendingConsumersRef.current.has(producerId)) return;

        pendingConsumersRef.current.add(producerId);

        try {
            const recvTransport = await createReceiveTransport(device);
            if (!recvTransport) return;

            const response = await socketResponse<CreateConsumerResponse>("create:consumer", {
                room,
                transportId: recvTransport.id,
                producerId,
                rtpCapabilities: device.rtpCapabilities,
            });

            const consumer = await recvTransport.consume({
                id: response.data.id,
                producerId: response.data.producerId,
                kind: response.data.kind,
                rtpParameters: response.data.rtpParameters,
            });

            const stream = new MediaStream([consumer.track]);

            setRemoteStreams((prev) => {
                const newMap = new Map(prev);

                const existing = newMap.get(producerId);
                if (existing) {
                    existing.stream.getTracks().forEach((track) => track.stop());
                    existing.consumer.close();
                }

                newMap.set(producerId, {
                    id: producerId,
                    stream,
                    kind,
                    consumer,
                });

                return newMap;
            });
        } catch (error) {
            toast.error((error as Error)?.message || "Failed to create consumer");
        } finally {
            pendingConsumersRef.current.delete(producerId);
        }
    };

    const handleStartVideoChat = async () => {
        let stream: MediaStream | null = null;

        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            setLocalStream(stream);

            const transportResponse = await socketResponse<CreateTransportResponse>("create:send:transport", { room });

            const sendTransport = device.createSendTransport({
                id: transportResponse.data.id,
                iceParameters: transportResponse.data.iceParameters,
                iceCandidates: transportResponse.data.iceCandidates,
                dtlsParameters: transportResponse.data.dtlsParameters,
                sctpParameters: transportResponse.data.sctpParameters,
            });

            sendTransport.on("connect", async ({ dtlsParameters }, callback, errBack) => {
                try {
                    const connectResponse = await socketResponse<ConnectTransportResponse>("connect:send:transport", {
                        room,
                        transportId: sendTransport.id,
                        dtlsParameters,
                    });

                    callback();

                    connectResponse.data.producers.forEach((producer) => {
                        createConsumer(device, producer.id, producer.kind);
                    });
                } catch (error) {
                    errBack(error as Error);
                }
            });

            sendTransport.on("produce", async (parameters, callback, errBack) => {
                try {
                    const producerResponse = await socketResponse<CreateProducerResponse>("create:producer", {
                        room,
                        transportId: sendTransport.id,
                        kind: parameters.kind,
                        rtpParameters: parameters.rtpParameters,
                    });

                    callback({ id: producerResponse.data.id });
                } catch (error) {
                    errBack(error as Error);
                }
            });

            await sendTransport.produce({ track: stream.getVideoTracks()[0], encodings: [{ maxBitrate: 500000 }] });
            await sendTransport.produce({ track: stream.getAudioTracks()[0] });

            sendTransportRef.current = sendTransport;
            setIsStarted(true);
        } catch (error) {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            toast.error((error as Error)?.message || "Failed to join conference");
        }
    };

    const handleStopVideoChat = () => {
        cleanUp();
        socket.emit("delete:producer", { room });
        setIsStarted(false);
    };

    const remoteVideoComponents = useMemo(() => {
        const videoStreams = Array.from(remoteStreams.values()).filter((remote) => remote.kind === "video");

        return videoStreams.map(({ id, stream }) => (
            <video
                key={id}
                ref={(ref) => {
                    if (ref && stream) {
                        ref.srcObject = stream;
                    }
                }}
                autoPlay
                playsInline
                muted={false}
                style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: "16px",
                    border: "2px solid var(--joy-palette-neutral-outlinedBorder)",
                }}
            />
        ));
    }, [remoteStreams]);

    useEffect(() => {
        const audioStreams = Array.from(remoteStreams.values()).filter((remote) => remote.kind === "audio");
        const audioElements: HTMLAudioElement[] = [];

        audioStreams.forEach(({ id, stream }) => {
            const audioElement = document.createElement("audio");
            audioElement.id = `audio-${id}`;
            audioElement.srcObject = stream;
            audioElement.autoplay = true;
            audioElement.style.display = "none";

            document.body.appendChild(audioElement);
            audioElements.push(audioElement);
        });

        return () => {
            audioElements.forEach((element) => {
                element.remove();
            });
        };
    }, [remoteStreams]);

    return (
        <>
            <TabPanel value={0} sx={{ p: 1, overflowY: "auto", display: "flex" }}>
                {isStarted ? (
                    <Stack width="100%" spacing={1.25}>
                        <Stack position="sticky" top={0} bgcolor="background.surface" gap={2}>
                            <video
                                ref={(ref) => {
                                    if (ref && localStream) {
                                        ref.srcObject = localStream;
                                    }
                                }}
                                autoPlay
                                playsInline
                                muted
                                style={{
                                    width: "100%",
                                    aspectRatio: 16 / 9,
                                    borderRadius: 16,
                                    border: "2px solid var(--joy-palette-primary-outlinedBorder)",
                                }}
                            />
                            <Divider />
                        </Stack>
                        {/* Remote Videos */}
                        <Stack flex={1} gap={2}>
                            {remoteVideoComponents.length === 0 ? (
                                <Typography my="auto" level="body-sm" textAlign="center">
                                    Waiting for other participants to join...
                                </Typography>
                            ) : (
                                remoteVideoComponents
                            )}
                        </Stack>
                    </Stack>
                ) : (
                    <Stack width="100%" alignItems="center" justifyContent="center" gap={2}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none">
                            <path d="M2.00189 1.99988L21.9772 21.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path
                                d="M16.8516 16.8677C16.7224 17.8061 16.4665 18.4668 15.9595 18.9744C14.9356 19.9996 13.2877 19.9996 9.992 19.9996H8.99323C5.69749 19.9996 4.04961 19.9996 3.02575 18.9744C2.00189 17.9493 2.00189 16.2994 2.00189 12.9996V10.9996C2.00189 7.69971 2.00189 6.04979 3.02575 5.02466C3.36827 4.68172 3.78062 4.45351 4.30114 4.30164"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M8.23627 4.0004C8.47815 3.99988 8.72995 3.99988 8.99217 3.99988H9.99093C13.2867 3.99988 14.9346 3.99988 15.9584 5.02501C16.9822 6.05013 16.9822 7.70005 16.9822 10.9999V12.7573M16.9822 9.2313L19.3018 7.52901C20.7729 6.54061 21.4489 7.17184 21.6674 7.64835C22.1191 8.92801 21.9768 11.3935 21.9768 14.5416C21.8703 16.5549 21.5952 16.7718 21.3137 16.9938L21.3107 16.9961"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <Typography level="body-sm">No video available!...</Typography>
                    </Stack>
                )}
            </TabPanel>
            <Divider />
            <Box sx={{ p: 1 }}>
                {isStarted ? (
                    <VideoController handleStopVideoChat={handleStopVideoChat} />
                ) : (
                    <StartVideoChat handleStartVideoChat={handleStartVideoChat} />
                )}
            </Box>
        </>
    );
}
