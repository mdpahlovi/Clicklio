import {
    MinusIcon,
    PlusIcon,
    PreviewIcon,
    RedoIcon,
    ScreenRecordStartIcon,
    ScreenRecordStopIcon,
    UndoIcon,
    WebcamIcon,
} from "@/components/icons";
import Modal from "@/components/ui/modal";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import { downloadMedia } from "@/utils/download";
import { handleCreateEvent } from "@/utils/event";
import { handleMediaError } from "@/utils/utils";
import { Button, Divider, IconButton, Sheet, styled, Tooltip } from "@mui/joy";
import Konva from "konva";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReactMediaRecorder } from "react-media-recorder";

export default function BottomToolbar({ stage }: { stage: Konva.Stage }) {
    const { zoom, setZoom, setUserMedia } = useCanvasState();
    const { createEvent, canUndo, canRedo } = useEventStore();

    return (
        <>
            <BottomToolbarSheet position="left">
                <Tooltip title="Webcam" placement="top">
                    <IconButton
                        onClick={() => {
                            navigator.mediaDevices
                                .getUserMedia({ video: { width: 320, height: 320 } })
                                .then((stream) => {
                                    setUserMedia(stream);

                                    const webcam = document.getElementById("webcam") as HTMLVideoElement;
                                    webcam.srcObject = stream;

                                    webcam.onloadedmetadata = () => {
                                        const image = new Konva.Image({
                                            id: "webcam",
                                            image: webcam,
                                            width: 160,
                                            height: 160,
                                        });

                                        const layer = stage.getLayers()[0];
                                        layer.add(image);
                                    };
                                })
                                .catch((error) => handleMediaError(error));
                        }}
                    >
                        <WebcamIcon />
                    </IconButton>
                </Tooltip>
                <ErrorBoundary
                    fallback={
                        <Tooltip title="Not supported" placement="top">
                            <IconButton disabled>
                                <ScreenRecordStartIcon />
                            </IconButton>
                        </Tooltip>
                    }
                >
                    <ScreenRecorder />
                </ErrorBoundary>
                <Divider orientation="vertical" />
                <IconButton
                    onClick={() =>
                        handleCreateEvent({
                            action: "UNDO",
                            object: null,
                            createEvent,
                        })
                    }
                    disabled={!canUndo()}
                >
                    <UndoIcon />
                </IconButton>
                <IconButton
                    onClick={() =>
                        handleCreateEvent({
                            action: "REDO",
                            object: null,
                            createEvent,
                        })
                    }
                    disabled={!canRedo()}
                >
                    <RedoIcon />
                </IconButton>
            </BottomToolbarSheet>
            <BottomToolbarSheet position="right">
                <IconButton
                    onClick={() => {
                        if (Number(zoom.toFixed(1)) <= 10) {
                            setZoom(zoom + 0.1);
                            stage.scale({ x: zoom + 0.1, y: zoom + 0.1 });
                        }
                    }}
                    disabled={Number(zoom.toFixed(1)) >= 10}
                >
                    <PlusIcon />
                </IconButton>

                <Divider orientation="vertical" sx={{ display: { xs: "none", sm: "block" } }} />
                <Button
                    color="neutral"
                    variant="plain"
                    sx={{ display: { xs: "none", sm: "block" }, width: 96 }}
                    onClick={() => {
                        setZoom(2);
                        stage.scale({ x: 2, y: 2 });
                    }}
                >
                    {Math.round(zoom * 100)}%
                </Button>
                <Divider orientation="vertical" />
                <IconButton
                    onClick={() => {
                        if (Number(zoom.toFixed(1)) >= 1) {
                            setZoom(zoom - 0.1);
                            stage.scale({ x: zoom - 0.1, y: zoom - 0.1 });
                        }
                    }}
                    disabled={Number(zoom.toFixed(1)) <= 1}
                >
                    <MinusIcon />
                </IconButton>
            </BottomToolbarSheet>
        </>
    );
}

const ScreenRecorder = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <ReactMediaRecorder
                audio
                screen
                render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                    <>
                        {status !== "recording" ? (
                            <Tooltip title="Record" placement="top">
                                <IconButton onClick={() => startRecording()}>
                                    <ScreenRecordStartIcon />
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
                                    <ScreenRecordStopIcon />
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

                        {/* Preview Modal */}
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
                                        if (mediaBlobUrl) {
                                            downloadMedia(mediaBlobUrl);
                                        }
                                    }}
                                    disabled={!mediaBlobUrl}
                                >
                                    Download
                                </Button>
                            </div>
                        </Modal>
                    </>
                )}
            />
        </div>
    );
};

const BottomToolbarSheet = styled(Sheet)<{ position: "left" | "right" }>(({ position }) => ({
    position: "fixed",
    [position]: 16,
    bottom: 16,
    zIndex: 10,
    padding: 4,
    borderRadius: 99,
    display: "flex",
    gap: 4,
}));
