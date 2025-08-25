import { socket } from "@/utils/socket";
import { Button, Divider, Sheet, Stack, styled } from "@mui/joy";
import { Device, types } from "mediasoup-client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type JoinConferenceResponse = {
    id: string;
    iceParameters: types.IceParameters;
    iceCandidates: types.IceCandidate[];
    dtlsParameters: types.DtlsParameters;
    sctpParameters: types.SctpParameters;
    routerRtpCapabilities: types.RtpCapabilities;
};

type ConsumerInfo = {
    id: string;
    producerId: string;
    kind: types.MediaKind;
    rtpParameters: types.RtpParameters;
    type: string;
    producerPaused: boolean;
};

export default function Conference() {
    const room = useSearchParams()[0].get("room");

    const deviceRef = useRef<Device | null>(null);
    const sendTransportRef = useRef<types.Transport | null>(null);
    const recvTransportRef = useRef<types.Transport | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideosRef = useRef<HTMLDivElement>(null);

    const [isStarted, setIsStarted] = useState(false);
    const [consumers, setConsumers] = useState(new Map<string, types.Consumer>());

    useEffect(() => {
        if (!room) return;

        // Handle new producer from other clients
        socket.on("new:producer", ({ producerId, clientId, kind }) => {
            console.log("New producer:", producerId, kind);
            createConsumer(producerId, kind);
        });

        // Handle existing producers when joining
        socket.on("existing:producers", (producers) => {
            console.log("Existing producers:", producers);
            producers.forEach(({ producerId, kind }: { producerId: string; kind: types.MediaKind }) => {
                createConsumer(producerId, kind);
            });
        });

        // Handle producer closed
        socket.on("producer:closed", ({ producerId }) => {
            console.log("Producer closed:", producerId);
            // Remove the corresponding consumer and video element
            for (const [consumerId, consumer] of consumers.entries()) {
                if (consumer.producerId === producerId) {
                    consumer.close();
                    setConsumers((prev) => {
                        const newConsumers = new Map(prev);
                        newConsumers.delete(consumerId);
                        return newConsumers;
                    });

                    // Remove video element
                    const videoElement = document.getElementById(producerId);
                    if (videoElement) {
                        videoElement.remove();
                    }
                    break;
                }
            }
        });

        return () => {
            socket.off("new:producer");
            socket.off("existing:producers");
            socket.off("producer:closed");
        };
    }, [room]);

    const createReceiveTransport = async () => {
        const device = deviceRef.current;
        if (!device || recvTransportRef.current) return recvTransportRef.current;

        return new Promise<types.Transport>((resolve, reject) => {
            socket.emit("create:receive:transport", { room }, (response) => {
                if (response.error) {
                    reject(new Error(response.error));
                    return;
                }

                const recvTransport = device.createRecvTransport({
                    id: response.id,
                    iceParameters: response.iceParameters,
                    iceCandidates: response.iceCandidates,
                    dtlsParameters: response.dtlsParameters,
                });

                recvTransport.on("connect", ({ dtlsParameters }, callback) => {
                    socket.emit("connect:transport", {
                        room,
                        transportId: recvTransport.id,
                        dtlsParameters,
                    });
                    callback();
                });

                recvTransportRef.current = recvTransport;
                resolve(recvTransport);
            });
        });
    };

    const createConsumer = async (producerId: string, kind: types.MediaKind) => {
        try {
            const device = deviceRef.current;
            const recvTransport = await createReceiveTransport();
            if (!device || !recvTransport) return;

            return new Promise<void>((resolve, reject) => {
                socket.emit(
                    "consume",
                    {
                        room,
                        transportId: recvTransport.id,
                        producerId,
                        rtpCapabilities: device.rtpCapabilities,
                    },
                    async (response: ConsumerInfo) => {
                        if (response.error) {
                            reject(new Error(response.error));
                            return;
                        }

                        const consumer = await recvTransport.consume({
                            id: response.id,
                            producerId: response.producerId,
                            kind: response.kind,
                            rtpParameters: response.rtpParameters,
                        });

                        setConsumers((prev) => {
                            const newConsumers = new Map(prev);
                            newConsumers.set(consumer.id, consumer);
                            return newConsumers;
                        });

                        // Resume consumer
                        socket.emit("resume:consumer", {
                            room,
                            consumerId: consumer.id,
                        });

                        // Create media element and add to DOM
                        const stream = new MediaStream([consumer.track]);

                        if (kind === "video") {
                            const videoElement = document.createElement("video");
                            videoElement.id = producerId;
                            videoElement.srcObject = stream;
                            videoElement.autoplay = true;
                            videoElement.playsInline = true;
                            videoElement.muted = false;
                            videoElement.style.width = "300px";
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

                        resolve();
                    },
                );
            });
        } catch (error) {
            console.error("Error creating consumer:", error);
        }
    };

    const handleJoinConference = async () => {
        socket.emit("join:conference", { room }, async (response: JoinConferenceResponse) => {
            try {
                if (response.id) {
                    const device = new Device();
                    await device.load({ routerRtpCapabilities: response.routerRtpCapabilities });

                    const sendTransport = device.createSendTransport({
                        id: response.id,
                        iceParameters: response.iceParameters,
                        iceCandidates: response.iceCandidates,
                        dtlsParameters: response.dtlsParameters,
                        sctpParameters: response.sctpParameters,
                    });

                    sendTransport.on("connect", async ({ dtlsParameters }, callback) => {
                        try {
                            socket.emit("connect:transport", {
                                room,
                                transportId: sendTransport.id,
                                dtlsParameters,
                            });
                            callback();
                        } catch (error) {
                            callback(error);
                        }
                    });

                    deviceRef.current = device;
                    sendTransportRef.current = sendTransport;

                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            width: { ideal: 1280 },
                            height: { ideal: 720 },
                        },
                        audio: true,
                    });

                    // Display local video
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }

                    const audioTrack = stream.getAudioTracks()[0];
                    const videoTrack = stream.getVideoTracks()[0];

                    sendTransport.on("produce", async (parameters, callback) => {
                        try {
                            socket.emit(
                                "produce",
                                {
                                    room,
                                    transportId: sendTransport.id,
                                    kind: parameters.kind,
                                    rtpParameters: parameters.rtpParameters,
                                    appData: parameters.appData,
                                },
                                (response) => {
                                    callback({ id: response.producerId });
                                },
                            );
                        } catch (error) {
                            callback(error);
                        }
                    });

                    // Safe video production with progressive fallback
                    await sendTransport.produce({ track: videoTrack, encodings: [{ maxBitrate: 500000 }] });

                    // Produce audio
                    await sendTransport.produce({ track: audioTrack });

                    setIsStarted(true);
                }
            } catch (error) {
                console.error("Error joining conference:", error);
            }
        });
    };

    return (
        <ConferenceSheet sx={room ? {} : { display: "none" }}>
            {room ? (
                <Stack gap={2}>
                    {!isStarted ? (
                        <Button onClick={handleJoinConference} size="lg">
                            Start Conference
                        </Button>
                    ) : null}

                    {/* Local Video */}
                    <Stack position="sticky" top={0} bgcolor="background.surface" gap={2}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{
                                width: 300,
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
            ) : null}
        </ConferenceSheet>
    );
}

const ConferenceSheet = styled(Sheet)(() => ({
    position: "absolute",
    overflow: "auto",
    top: 78,
    bottom: 78,
    right: 16,
    zIndex: 10,
    padding: 16,
    borderRadius: 16,
    display: "grid",
    gap: 4,
}));
