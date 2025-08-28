import { VideoOffIcon } from "@/components/icons";
import { socket, socketResponse } from "@/utils/socket";
import { Divider, Stack, TabPanel, Typography } from "@mui/joy";
import { Device, type types } from "mediasoup-client";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import VideoControllers from "./video-controllers";

type LocalStreams = {
    audio: MediaStreamTrack | null;
    camera: MediaStreamTrack | null;
    screen: MediaStreamTrack | null;
};

type CreateTransportResponse = {
    id: string;
    iceParameters: types.IceParameters;
    iceCandidates: types.IceCandidate[];
    dtlsParameters: types.DtlsParameters;
    sctpParameters: types.SctpParameters;
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

type ProducerData = { id: string };

export default function VideoChatUI({ room, device }: { room: string; device: Device }) {
    const [isStarted, setIsStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const sendTransportRef = useRef<types.Transport | null>(null);
    const recvTransportRef = useRef<types.Transport | null>(null);
    const producersRef = useRef<Map<keyof LocalStreams, ProducerData>>(new Map());

    const [localStreams, setLocalStreams] = useState<LocalStreams>({
        audio: null,
        camera: null,
        screen: null,
    });
    const [remoteStreams, setRemoteStreams] = useState<Map<string, RemoteStream>>(new Map());

    const cleanUp = () => {
        Object.values(localStreams).forEach((track) => {
            if (track) track.stop();
        });

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
    };

    useEffect(() => {
        if (!isStarted) return;

        const handleCreateProducer = async ({ id, kind }: { id: string; kind: types.MediaKind }) => {
            await createConsumer(device, id, kind);
        };

        const handleDeleteProducer = ({ producers }: { producers: string[] }) => {
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
    }, [device, isStarted]);

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
        }
    };

    const createProducer = async (sendTransport: types.Transport, track: MediaStreamTrack, mediaType: keyof LocalStreams) => {
        let producer: types.Producer;
        switch (mediaType) {
            case "audio":
                producer = await sendTransport.produce({ track });
                break;
            case "camera":
                producer = await sendTransport.produce({ track, encodings: [{ maxBitrate: 500000 }] });
                break;
            case "screen":
                producer = await sendTransport.produce({ track, encodings: [{ maxBitrate: 500000 }] });
                break;
        }

        producersRef.current.set(mediaType, { id: producer.id });
        setLocalStreams((prev) => ({ ...prev, [mediaType]: track }));
    };

    const deleteProducer = (mediaType: keyof LocalStreams) => {
        const producer = producersRef.current.get(mediaType);

        if (producer) {
            producersRef.current.delete(mediaType);
            setLocalStreams((prev) => {
                const track = prev[mediaType];

                track?.stop();
                return { ...prev, [mediaType]: null };
            });
            socket.emit("delete:producer", { room, producers: [producer.id] });
        }
    };

    const handleStartVideoChat = async () => {
        setIsLoading(true);
        let stream: MediaStream | null = null;

        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            const transportResponse = await socketResponse<CreateTransportResponse>("create:send:transport", { room });

            // consume existing producers tracks
            if (transportResponse.data.producers.length > 0) {
                for (const producer of transportResponse.data.producers) {
                    await createConsumer(device, producer.id, producer.kind);
                }
            }

            const sendTransport = device.createSendTransport({
                id: transportResponse.data.id,
                iceParameters: transportResponse.data.iceParameters,
                iceCandidates: transportResponse.data.iceCandidates,
                dtlsParameters: transportResponse.data.dtlsParameters,
                sctpParameters: transportResponse.data.sctpParameters,
            });

            sendTransport.on("connect", async ({ dtlsParameters }, callback, errBack) => {
                try {
                    await socketResponse("connect:send:transport", {
                        room,
                        transportId: sendTransport.id,
                        dtlsParameters,
                    });
                    callback();
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

            await createProducer(sendTransport, stream.getVideoTracks()[0], "camera");
            await createProducer(sendTransport, stream.getAudioTracks()[0], "audio");

            sendTransportRef.current = sendTransport;
            setIsStarted(true);
        } catch (error) {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            toast.error((error as Error)?.message || "Failed to join conference");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStopVideoChat = () => {
        cleanUp();
        socket.emit("remove:client", { room });
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
                    <Stack width="100%" spacing={1}>
                        <Stack position="sticky" top={0} bgcolor="background.surface" gap={1}>
                            <video
                                ref={(ref) => {
                                    const streams = Object.values(localStreams).filter((track) => track !== null);
                                    if (ref && streams.length > 0) {
                                        ref.srcObject = new MediaStream(streams);
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
                        <VideoOffIcon size={48} />
                        <Typography level="body-sm">No video available!...</Typography>
                    </Stack>
                )}
            </TabPanel>
            <VideoControllers
                isStarted={isStarted}
                isLoading={isLoading}
                localStreams={localStreams}
                sendTransportRef={sendTransportRef}
                createProducer={createProducer}
                deleteProducer={deleteProducer}
                handleStopVideoChat={handleStopVideoChat}
                handleStartVideoChat={handleStartVideoChat}
            />
        </>
    );
}
