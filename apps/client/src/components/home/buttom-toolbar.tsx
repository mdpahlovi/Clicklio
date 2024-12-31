import { objectCorner } from "@/constants";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useShapeState } from "@/hooks/useShapeState";
import { socket } from "@/utils/socket";
import { Button, Divider, IconButton, Sheet, Tooltip } from "@mui/joy";
import * as fabric from "fabric";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiSolidWebcam } from "react-icons/bi";
import { FaRegCircleStop } from "react-icons/fa6";
import { GrRedo, GrUndo } from "react-icons/gr";
import { MdGrid3X3 } from "react-icons/md";
import { PiMinus, PiPlus, PiVinylRecord } from "react-icons/pi";
import { useSearchParams } from "react-router-dom";

export default function BottomToolbar({ fabricRef }: { fabricRef: React.RefObject<fabric.Canvas | null> }) {
    const [searchParams] = useSearchParams();

    const { undo, redo } = useShapeState();
    const { zoom, setZoom } = useCanvasState();
    const { setRefresh, setUserMedia } = useCanvasState();

    const [isRecording, setIsRecording] = useState(false);

    const room = searchParams.get("room");

    return (
        <>
            <Sheet
                sx={{ display: "flex", gap: 0.5, p: 0.75, zIndex: 10 }}
                style={{ borderWidth: "1px 1px 0 0", position: "absolute", bottom: 0, borderRadius: "0 24px 0 0" }}
            >
                <Tooltip title="Grid" placement="top">
                    <IconButton>
                        <MdGrid3X3 />
                    </IconButton>
                </Tooltip>
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
                                                objectId: "webcam",
                                                objectCaching: false,
                                                ...objectCorner,
                                            });

                                            object.scaleToWidth(100);
                                            canvas.add(object);

                                            fabric.util.requestAnimFrame(function render() {
                                                canvas.requestRenderAll();
                                                fabric.util.requestAnimFrame(render);
                                            });
                                        };
                                    })
                                    .catch((error) => {
                                        switch (error.name) {
                                            case "NotAllowedError":
                                                toast.error("Permission denied: User or browser blocked access.");
                                                break;
                                            case "NotFoundError":
                                                toast.error("No media devices found: Check camera/microphone connection.");
                                                break;
                                            case "NotReadableError":
                                                toast.error("Device inaccessible: Already in use or hardware error.");
                                                break;
                                            case "OverconstrainedError":
                                                toast.error(`Constraint '${error.constraint}' cannot be met.`);
                                                break;
                                            case "SecurityError":
                                                toast.error("Access blocked due to security restrictions.");
                                                break;
                                            case "TypeError":
                                                toast.error("Invalid constraints provided.");
                                                break;
                                            case "AbortError":
                                                toast.error("Operation aborted by the user or browser.");
                                                break;
                                            default:
                                                toast.error(`Something went wrong! ${error.message}`);
                                        }
                                    });
                            }
                        }}
                    >
                        <BiSolidWebcam />
                    </IconButton>
                </Tooltip>
                {!isRecording ? (
                    <Tooltip title="Record" placement="top">
                        <IconButton onClick={() => setIsRecording(true)}>
                            <PiVinylRecord />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Stop Recording" placement="top">
                        <IconButton onClick={() => setIsRecording(false)}>
                            <FaRegCircleStop />
                        </IconButton>
                    </Tooltip>
                )}
                <Divider orientation="vertical" />
                <IconButton
                    onClick={() => {
                        undo();
                        setRefresh();
                        if (room) socket.emit("undo:shape", { room, status: true });
                    }}
                >
                    <GrUndo />
                </IconButton>
                <IconButton
                    onClick={() => {
                        redo();
                        setRefresh();
                        if (room) socket.emit("redo:shape", { room, status: true });
                    }}
                >
                    <GrRedo />
                </IconButton>
            </Sheet>
            <Sheet
                sx={{ display: "flex", gap: 0.5, p: 0.75, zIndex: 10 }}
                style={{ borderWidth: "1px 0 0 1px", position: "absolute", bottom: 0, right: 0, borderRadius: "24px 0 0 0" }}
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
