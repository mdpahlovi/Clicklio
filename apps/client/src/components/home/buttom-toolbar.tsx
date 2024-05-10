import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { GrUndo, GrRedo } from "react-icons/gr";
import { PiMinus, PiPlus } from "react-icons/pi";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { Stack, ButtonGroup, Button, IconButton } from "@mui/joy";

export default function BottomToolbar({ fabricRef }: { fabricRef: React.RefObject<fabric.Canvas | null> }) {
    const { zoom, setZoom } = useCanvasState();
    const { undo, redo } = useShapeState.temporal.getState();

    useEffect(() => {
        if (fabricRef?.current) setZoom(fabricRef.current.getZoom());
    }, []);

    return (
        <Stack direction="row" spacing={3} position="fixed" bottom={24} left={24} zIndex={1}>
            <ButtonGroup variant="soft">
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
                <Button
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
            </ButtonGroup>
            <ButtonGroup variant="soft">
                <IconButton
                    onClick={() => {
                        undo();
                        socket.emit("undo:shape", { status: true });
                    }}
                >
                    <GrUndo />
                </IconButton>
                <IconButton
                    onClick={() => {
                        redo();
                        socket.emit("redo:shape", { status: true });
                    }}
                >
                    <GrRedo />
                </IconButton>
            </ButtonGroup>
        </Stack>
    );
}
