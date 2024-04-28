import { useEffect, useState } from "react";
import { GrUndo, GrRedo } from "react-icons/gr";
import { PiMinus, PiPlus } from "react-icons/pi";
import IconButton from "@/components/ui/icon-button";

export default function BottomToolbar({ canvas }: { canvas: React.RefObject<fabric.Canvas | null> }) {
    const [zoom, setZoom] = useState(1);

    useEffect(() => setZoom(canvas.current ? canvas.current.getZoom() : 1), [canvas]);

    return (
        <div className="flex gap-6">
            <div className="flex">
                <IconButton
                    onClick={() => {
                        if (canvas.current && zoom > 0.3) {
                            setZoom(zoom - 0.1);
                            canvas.current.setZoom(zoom - 0.1);
                        }
                    }}
                    className="rounded-r-none"
                    disabled={Number(zoom.toFixed(1)) <= 0.2}
                >
                    <PiMinus />
                </IconButton>
                <button
                    onClick={() => {
                        if (canvas.current) {
                            setZoom(1);
                            canvas.current.setZoom(1);
                        }
                    }}
                    className="flex w-16 select-none items-center justify-center bg-foreground px-2.5"
                >
                    {Math.round(zoom * 100)}%
                </button>
                <IconButton
                    onClick={() => {
                        if (canvas.current && zoom < 1) {
                            setZoom(zoom + 0.1);
                            canvas.current.setZoom(zoom + 0.1);
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
