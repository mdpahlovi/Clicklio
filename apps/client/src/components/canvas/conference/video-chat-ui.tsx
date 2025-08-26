import { socket, socketResponse } from "@/utils/socket";
import { handleMediaError } from "@/utils/utils";
import { Box, Divider, Stack, TabPanel, Typography } from "@mui/joy";
import { Device, type types } from "mediasoup-client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import StartVideoChat from "./start-video-chat";

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

export default function VideoChatUI({ room, device }: { room: string; device: Device }) {
    const sendTransportRef = useRef<types.Transport | null>(null);
    const recvTransportRef = useRef<types.Transport | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const remoteVideosRef = useRef<HTMLDivElement>(null);

    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        socket.on("create:producer", ({ id, kind }) => {
            createConsumer(device, id, kind);
        });

        return () => {
            socket.off("create:producer");
        };
    }, []);

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

            if (kind === "video") {
                const videoElement = document.createElement("video");
                videoElement.id = producerId;
                videoElement.srcObject = stream;
                videoElement.autoplay = true;
                videoElement.playsInline = true;
                videoElement.muted = false;
                videoElement.style.width = "100%";
                videoElement.style.aspectRatio = "16 / 9";
                videoElement.style.borderRadius = "16px";
                videoElement.style.border = "2px solid var(--joy-palette-neutral-outlinedBorder)";

                if (remoteVideosRef.current) {
                    remoteVideosRef.current.appendChild(videoElement);
                }
            } else if (kind === "audio") {
                const audioElement = document.createElement("audio");
                audioElement.srcObject = stream;
                audioElement.autoplay = true;
                document.body.appendChild(audioElement);
            }
        } catch (error) {
            toast.error((error as Error)?.message || "Failed to create consumer");
        }
    };

    const handleStartVideoChat = async () => {
        let audioTrack: MediaStreamTrack | null = null;
        let videoTrack: MediaStreamTrack | null = null;

        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true,
            })
            .then((stream) => {
                audioTrack = stream.getAudioTracks()[0];
                videoTrack = stream.getVideoTracks()[0];
                setLocalStream(stream);
            })
            .catch((error) => handleMediaError(error));

        if (!audioTrack || !videoTrack) return;

        try {
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

            await sendTransport.produce({ track: audioTrack, encodings: [{ maxBitrate: 500000 }] });
            await sendTransport.produce({ track: videoTrack });

            sendTransportRef.current = sendTransport;
            setIsStarted(true);
        } catch (error) {
            toast.error((error as Error)?.message || "Failed to join conference");
        }
    };

    return (
        <>
            <TabPanel value={0} sx={{ p: 1, overflowY: "auto", display: "flex" }}>
                {isStarted ? (
                    <Stack width="100%" spacing={1.25}>
                        <Stack position="sticky" top={0} bgcolor="background.surface" gap={2}>
                            <video
                                ref={(ref) => {
                                    if (ref) {
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
                        <Stack ref={remoteVideosRef} gap={2}></Stack>
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
            <Box sx={{ p: 1 }}>{isStarted ? null : <StartVideoChat handleStartVideoChat={handleStartVideoChat} />}</Box>
        </>
    );
}
