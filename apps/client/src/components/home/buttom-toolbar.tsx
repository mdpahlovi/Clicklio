import { useEffect } from "react";
import { GrUndo, GrRedo } from "react-icons/gr";
import { PiMinus, PiPlus } from "react-icons/pi";
import IconButton from "@/components/ui/icon-button";
import { useCanvasState } from "@/hooks/useCanvasState";

export default function BottomToolbar({ fabricRef }: { fabricRef: React.RefObject<fabric.Canvas | null> }) {
    const { zoom, setZoom } = useCanvasState();

    useEffect(() => {
        if (fabricRef?.current) setZoom(fabricRef.current.getZoom());
    }, []);

    return (
        <div className="flex gap-6">
            <div className="flex">
                <IconButton
                    onClick={() => {
                        if (fabricRef.current && zoom > 0.3) {
                            setZoom(zoom - 0.1);
                            fabricRef.current.setZoom(zoom - 0.1);
                        }
                    }}
                    className="rounded-r-none"
                    disabled={Number(zoom.toFixed(1)) <= 0.2}
                >
                    <PiMinus />
                </IconButton>
                <button
                    onClick={() => {
                        if (fabricRef.current) {
                            setZoom(1);
                            fabricRef.current.setZoom(1);
                        }
                    }}
                    className="bg-foreground flex w-16 select-none items-center justify-center px-2.5"
                >
                    {Math.round(zoom * 100)}%
                </button>
                <IconButton
                    onClick={() => {
                        if (fabricRef.current && zoom < 1) {
                            setZoom(zoom + 0.1);
                            fabricRef.current.setZoom(zoom + 0.1);
                        }
                    }}
                    className="rounded-l-none"
                    disabled={Number(zoom.toFixed(1)) >= 1}
                >
                    <PiPlus />
                </IconButton>
            </div>
            <div>
                <IconButton className="rounded-r-none">
                    <GrUndo />
                </IconButton>
                <IconButton className="rounded-l-none">
                    <GrRedo />
                </IconButton>
            </div>
        </div>
    );
}
