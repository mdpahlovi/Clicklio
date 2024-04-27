import { GrUndo, GrRedo } from "react-icons/gr";
import { PiMinus, PiPlus } from "react-icons/pi";
import IconButton from "@/components/ui/icon-button";

export default function BottomToolbar({ canvas }: { canvas: React.RefObject<fabric.Canvas | null> }) {
    return (
        <div className="flex gap-6">
            <div className="flex">
                <IconButton
                    onClick={() => {
                        if (canvas.current) {
                            const zoom = canvas.current.getZoom();
                            canvas.current.setZoom(zoom - 0.1);
                        }
                    }}
                    className="rounded-r-none"
                >
                    <PiMinus />
                </IconButton>
                <button className="flex w-16 items-center justify-center bg-foreground px-2.5">
                    {canvas.current ? canvas.current.getZoom() * 100 : 1}%
                </button>
                <IconButton
                    onClick={() => {
                        if (canvas.current) {
                            const zoom = canvas.current.getZoom();
                            canvas.current.setZoom(zoom + 0.1);
                        }
                    }}
                    className="rounded-l-none"
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
