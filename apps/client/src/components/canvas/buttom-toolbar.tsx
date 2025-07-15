import { PreviewIcon } from "@/components/icons";
import Modal from "@/components/ui/modal";
import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import { downloadMedia } from "@/utils/download";
import { handleNavigatorError } from "@/utils/error-handle";
import { handleCreateEvent } from "@/utils/event";
import { Button, Divider, IconButton, Sheet, Tooltip } from "@mui/joy";
import * as fabric from "fabric";
import { useState } from "react";
import { BiSolidWebcam } from "react-icons/bi";
import { FaRegCircleStop } from "react-icons/fa6";
import { GrRedo, GrUndo } from "react-icons/gr";
import { PiMinus, PiPlus, PiVinylRecord } from "react-icons/pi";
import { useReactMediaRecorder } from "react-media-recorder";

export default function BottomToolbar({ fabricRef }: { fabricRef: React.RefObject<fabric.Canvas | null> }) {
    const { createEvent, canUndo, canRedo } = useEventStore();
    const { zoom, setZoom, setUserMedia } = useCanvasState();
    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true, screen: true });

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Recorded Media" sx={{ maxWidth: 768 }}>
                <video style={{ aspectRatio: "16 / 9", width: "100%", borderRadius: 12 }} controls src={mediaBlobUrl} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
                    <Button
                        color="warning"
                        onClick={() => {
                            startRecording();
                            setIsOpen(false);
                        }}
                    >
                        Rerecord
                    </Button>
                    <Button
                        onClick={() => {
                            if (mediaBlobUrl) downloadMedia(mediaBlobUrl);
                        }}
                        disabled={!mediaBlobUrl}
                    >
                        Download
                    </Button>
                </div>
            </Modal>
            <Sheet
                sx={{ display: "flex", gap: 0.5, p: 0.75, zIndex: 10 }}
                style={{ borderWidth: "1px 1px 0 0", position: "absolute", bottom: 0, borderRadius: "0 24px 0 0" }}
            >
                <Tooltip title="Webcam" placement="top">
                    <IconButton
                        onClick={() => {
                            const canvas = fabricRef.current;

                            if (canvas) {
                                navigator.mediaDevices
                                    .getUserMedia({ video: { width: 320, height: 320 } })
                                    .then((stream) => {
                                        setUserMedia(stream);

                                        const webcam = document.getElementById("webcam") as HTMLVideoElement;
                                        webcam.srcObject = stream;

                                        webcam.onloadedmetadata = () => {
                                            const object = new fabric.FabricImage(webcam, {
                                                uid: "webcam",
                                                objectCaching: false,
                                            });

                                            object.scaleToWidth(100);
                                            canvas.add(object);

                                            fabric.util.requestAnimFrame(function render() {
                                                canvas.requestRenderAll();
                                                fabric.util.requestAnimFrame(render);
                                            });
                                        };
                                    })
                                    .catch((error) => handleNavigatorError(error));
                            }
                        }}
                    >
                        <BiSolidWebcam />
                    </IconButton>
                </Tooltip>
                {status !== "recording" ? (
                    <Tooltip title="Record" placement="top">
                        <IconButton onClick={() => startRecording()}>
                            <PiVinylRecord />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Stop Recording" placement="top">
                        <IconButton
                            onClick={() => {
                                stopRecording();
                                setIsOpen(true);
                            }}
                        >
                            <FaRegCircleStop />
                        </IconButton>
                    </Tooltip>
                )}
                {mediaBlobUrl ? (
                    <Tooltip title="Preview" placement="top">
                        <IconButton onClick={() => setIsOpen(true)}>
                            <PreviewIcon />
                        </IconButton>
                    </Tooltip>
                ) : null}
                <Divider orientation="vertical" />
                <IconButton
                    onClick={() => {
                        handleCreateEvent({ action: "UNDO", object: null, createEvent });
                    }}
                    disabled={!canUndo()}
                >
                    <GrUndo />
                </IconButton>
                <IconButton
                    onClick={() => {
                        handleCreateEvent({ action: "REDO", object: null, createEvent });
                    }}
                    disabled={!canRedo()}
                >
                    <GrRedo />
                </IconButton>
            </Sheet>
            <Sheet
                sx={{ display: "flex", gap: 0.5, p: 0.75, zIndex: 10 }}
                style={{
                    borderWidth: "1px 0 0 1px",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    borderRadius: "24px 0 0 0",
                }}
            >
                <IconButton
                    onClick={() => {
                        if (fabricRef.current && Number(zoom.toFixed(1)) <= 10) {
                            setZoom(zoom + 0.1);
                            fabricRef.current.setZoom(zoom + 0.1);
                        }
                    }}
                    disabled={Number(zoom.toFixed(1)) >= 10}
                >
                    <PiPlus />
                </IconButton>

                <Divider orientation="vertical" sx={{ display: { xs: "none", sm: "block" } }} />
                <Button
                    color="neutral"
                    variant="plain"
                    sx={{ display: { xs: "none", sm: "block" }, width: 96 }}
                    onClick={() => {
                        if (fabricRef.current) {
                            setZoom(2);
                            fabricRef.current.setZoom(2);
                        }
                    }}
                >
                    {Math.round(zoom * 100)}%
                </Button>
                <Divider orientation="vertical" />
                <IconButton
                    onClick={() => {
                        if (fabricRef.current && Number(zoom.toFixed(1)) >= 1) {
                            setZoom(zoom - 0.1);
                            fabricRef.current.setZoom(zoom - 0.1);
                        }
                    }}
                    disabled={Number(zoom.toFixed(1)) <= 1}
                >
                    <PiMinus />
                </IconButton>
            </Sheet>
        </>
    );
}
