import { useEffect, useRef, useState } from "react";
import { navElements } from "@/constants";
import { handleImageUpload } from "@/utils/shapes";
import { useShapeState } from "@/hooks/useShapeState";
import Separator from "@/components/ui/separator";
import IconButton from "@/components/ui/icon-button";

import { PiCirclesThreePlus } from "react-icons/pi";
import { CiLock, CiUnlock, CiEraser } from "react-icons/ci";
import { useCanvasState } from "@/hooks/useCanvasState";
import type { Tool } from "@/types";

type ToolbarProps = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    selectedToolRef: React.MutableRefObject<Tool | null>;
};

export default function Toolbar({ fabricRef, selectedToolRef }: ToolbarProps) {
    const [lock, setLock] = useState(false);

    const { setShape } = useShapeState();
    const { tool, setTool } = useCanvasState();
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (fabricRef.current) {
            fabricRef.current.isDrawingMode = false;
            fabricRef.current.defaultCursor = "default";
            fabricRef.current.forEachObject((object) => {
                object.evented = true;
                object.selectable = true;
            });
        }

        switch (tool) {
            case "panning":
                selectedToolRef.current = "panning";
                if (fabricRef.current) {
                    fabricRef.current.defaultCursor = "grab";
                    fabricRef.current.forEachObject((object) => {
                        object.evented = false;
                        object.selectable = false;
                    });
                }
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
                selectedToolRef.current = tool;
                break;
        }
    }, [tool]);

    return (
        <div className="bg-foreground mx-auto flex w-max gap-1 rounded p-1">
            <IconButton onChange={() => setLock(!lock)}>{!lock ? <CiUnlock /> : <CiLock />}</IconButton>
            <Separator className="h-7" vertical />
            {navElements.map(({ value, icon }) => {
                return (
                    <IconButton key={value} onClick={() => setTool(value)} active={value === tool}>
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
