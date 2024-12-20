import { useCanvasState } from "@/hooks/useCanvasState";
import { useShapeState } from "@/hooks/useShapeState";
import { socket } from "@/utils/socket";
import { Button, Divider, IconButton, Sheet } from "@mui/joy";
import * as fabric from "fabric";
import { BiSolidWebcam } from "react-icons/bi";
import { GrRedo, GrUndo } from "react-icons/gr";
import { MdGrid3X3 } from "react-icons/md";
import { PiMinus, PiPlus, PiVinylRecord } from "react-icons/pi";
import { useSearchParams } from "react-router-dom";

export default function BottomToolbar({ fabricRef }: { fabricRef: React.RefObject<fabric.Canvas | null> }) {
    const [searchParams] = useSearchParams();

    const { undo, redo } = useShapeState();
    const { setRefresh } = useCanvasState();
    const { zoom, setZoom } = useCanvasState();

    const room = searchParams.get("room");

    return (
        <>
            <Sheet
                sx={{ display: "flex", gap: 0.5, p: 0.75, zIndex: 10 }}
                style={{ borderWidth: "1px 1px 0 0", position: "absolute", bottom: 0, borderRadius: "0 24px 0 0" }}
            >
                <IconButton onClick={() => {}}>
                    <MdGrid3X3 />
                </IconButton>
                <IconButton onClick={() => {}}>
                    <BiSolidWebcam />
                </IconButton>
                <IconButton onClick={() => {}}>
                    <PiVinylRecord />
                </IconButton>
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

                <Divider orientation="vertical" />
                <Button
                    color="neutral"
                    variant="plain"
                    sx={{ width: { xs: 64, sm: 96 } }}
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
