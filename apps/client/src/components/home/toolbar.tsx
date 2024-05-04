import { useRef, useState } from "react";
import { navElements } from "@/constants";
import Separator from "@/components/ui/separator";
import IconButton from "@/components/ui/icon-button";

import { PiCirclesThreePlus } from "react-icons/pi";
import { CiLock, CiUnlock, CiEraser } from "react-icons/ci";
import { useCanvasState } from "@/hooks/useCanvasState";
import type { Shape } from "@/types";
import { handleImageUpload } from "@/utils/shapes";
import { useShapeState } from "@/hooks/useShapeState";

type ToolbarProps = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    selectedShapeRef: React.MutableRefObject<Shape | null>;
};

export default function Toolbar({ fabricRef, selectedShapeRef }: ToolbarProps) {
    const [lock, setLock] = useState(false);

    const { setShape } = useShapeState();
    const { tool, setTool } = useCanvasState();
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleActiveElement = (value: Shape) => {
        setTool(value);

        if (fabricRef.current) {
            fabricRef.current.isDrawingMode = false;
            fabricRef.current.defaultCursor = "default";
        }

        switch (value) {
            case "panning":
                selectedShapeRef.current = "panning";
                if (fabricRef.current) fabricRef.current.defaultCursor = "grab";
                break;

            case "path":
                if (fabricRef.current) {
                    fabricRef.current.isDrawingMode = true;
                    fabricRef.current.freeDrawingBrush.width = 5;
                }
                break;

            case "image":
                imageInputRef.current?.click();
                break;

            default:
                selectedShapeRef.current = value;
                break;
        }
    };

    return (
        <div className="bg-foreground mx-auto flex w-max gap-1 rounded p-1">
            <IconButton onChange={() => setLock(!lock)}>{!lock ? <CiUnlock /> : <CiLock />}</IconButton>
            <Separator className="h-7" vertical />
            {navElements.map(({ value, icon }) => {
                return (
                    <IconButton key={value} onClick={() => handleActiveElement(value)} active={value === tool}>
                        {icon}
                    </IconButton>
                );
            })}
            <IconButton>
                <CiEraser />
            </IconButton>
            <Separator className="h-7" vertical />
            <IconButton>
                <PiCirclesThreePlus />
            </IconButton>

            <input
                hidden
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={(e) => {
                    if (e?.target?.files?.length) handleImageUpload({ file: e.target.files[0], fabricRef, setShape });
                }}
            />
        </div>
    );
}
