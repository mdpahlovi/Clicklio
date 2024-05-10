import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { GrUndo, GrRedo } from "react-icons/gr";
import { PiMinus, PiPlus } from "react-icons/pi";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { Stack, Sheet, Button, IconButton, Divider } from "@mui/joy";

export default function BottomToolbar({ fabricRef }: { fabricRef: React.RefObject<fabric.Canvas | null> }) {
    const { zoom, setZoom } = useCanvasState();
    const { undo, redo } = useShapeState.temporal.getState();

    useEffect(() => {
        if (fabricRef?.current) setZoom(fabricRef.current.getZoom());
    }, []);

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: "100%", height: 48, position: "absolute", zIndex: 1, left: 0, bottom: 0 }}
        >
            <Sheet style={{ borderLeft: 0, display: "flex", gap: 4, padding: 4, borderRadius: "0 16px 0 0" }}>
                <IconButton
                    onClick={() => {
                        undo();
                        socket.emit("undo:shape", { status: true });
                    }}
                >
                    <GrUndo />
                </IconButton>
                <Divider orientation="vertical" />
                <IconButton
                    onClick={() => {
                        redo();
                        socket.emit("redo:shape", { status: true });
                    }}
                >
                    <GrRedo />
                </IconButton>
            </Sheet>
            <Sheet style={{ borderRight: 0, display: "flex", gap: 4, padding: 4, borderRadius: "16px 0 0 0" }}>
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
                    sx={{ width: 96 }}
                    onClick={() => {
                        if (fabricRef.current) {
                            setZoom(1);
                            fabricRef.current.setZoom(1);
                        }
                    }}
                >
                    {Math.round(zoom * 100)}%
                </Button>
                <Divider orientation="vertical" />
                <IconButton
                    onClick={() => {
                        if (fabricRef.current && Number(zoom.toFixed(1)) >= 0.1) {
                            setZoom(zoom - 0.1);
                            fabricRef.current.setZoom(zoom - 0.1);
                        }
                    }}
                    disabled={Number(zoom.toFixed(1)) <= 0.1}
                >
                    <PiMinus />
                </IconButton>
            </Sheet>
        </Stack>
    );
}
