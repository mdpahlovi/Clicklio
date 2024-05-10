import { navElements } from "@/constants";
import { handleImageUpload } from "@/utils/shapes";
import { useEffect, useRef, useState } from "react";
import { useShapeState } from "@/hooks/useShapeState";

import { PiCirclesThreePlus } from "react-icons/pi";
import { Sheet, IconButton, Divider } from "@mui/joy";
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
        <Sheet variant="soft" sx={{ display: "flex", gap: 0.5, mx: "auto", p: 0.5, borderRadius: 6 }}>
            <IconButton onChange={() => setLock(!lock)}>{!lock ? <CiUnlock /> : <CiLock />}</IconButton>
            <Divider orientation="vertical" />
            {navElements.map(({ value, icon }) => {
                return (
                    <IconButton key={value} variant={value === tool ? "solid" : "plain"} onClick={() => setTool(value)}>
                        {icon}
                    </IconButton>
                );
            })}
            <IconButton>
                <CiEraser />
            </IconButton>
            <Divider orientation="vertical" />
            <IconButton>
                <PiCirclesThreePlus />
            </IconButton>

            <input
                hidden
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={(e) => e?.target?.files?.length && handleImageUpload({ file: e.target.files[0], fabricRef, setShape })}
            />
        </Sheet>
    );
}
