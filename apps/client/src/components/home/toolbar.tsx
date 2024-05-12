import { circle, navElements } from "@/constants";
import { handleImageUpload } from "@/utils/shapes";
import { Fragment, useEffect, useRef } from "react";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";

import { Sheet, IconButton, Stack, Dropdown, MenuButton, Menu, MenuItem } from "@mui/joy";
import type { Tool } from "@/types";

type ToolbarProps = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    selectedToolRef: React.MutableRefObject<Tool | null>;
};

export default function Toolbar({ fabricRef, selectedToolRef }: ToolbarProps) {
    const { setShape } = useShapeState();
    const { tool, setTool } = useCanvasState();
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (fabricRef.current) {
            fabricRef.current.selection = false;
            fabricRef.current.isDrawingMode = false;
            fabricRef.current.defaultCursor = "default";

            switch (tool) {
                case "panning":
                    selectedToolRef.current = "panning";
                    fabricRef.current.defaultCursor = "grab";
                    break;

                case "select":
                    selectedToolRef.current = "select";
                    fabricRef.current.selection = true;
                    break;

                case "path-1":
                    fabricRef.current.isDrawingMode = true;
                    fabricRef.current.freeDrawingBrush.width = 1;
                    break;

                case "path-5":
                    fabricRef.current.isDrawingMode = true;
                    fabricRef.current.freeDrawingBrush.width = 5;
                    break;

                case "path-10":
                    fabricRef.current.isDrawingMode = true;
                    fabricRef.current.freeDrawingBrush.width = 10;
                    break;

                case "image":
                    imageInputRef.current?.click();
                    setTimeout(() => setTool("select"), 500);
                    break;

                case "eraser":
                    selectedToolRef.current = "eraser";
                    fabricRef.current.defaultCursor = circle;
                    break;

                default:
                    selectedToolRef.current = tool;
                    fabricRef.current.defaultCursor = "crosshair";
                    break;
            }
        }
    }, [tool]);

    return (
        <Stack justifyContent="center" sx={{ width: 48, position: "absolute", zIndex: 1, inset: 0 }}>
            <Sheet style={{ borderLeft: 0, display: "grid", gap: 4, padding: 6, borderRadius: "0 16px 16px 0" }}>
                {navElements.map(({ value, values, icon, type, children }, idx) => {
                    switch (type) {
                        case "tool":
                            return (
                                <IconButton
                                    key={idx}
                                    onClick={() => value && setTool(value)}
                                    variant={value === tool ? "solid" : "plain"}
                                    color={value === tool ? "primary" : "neutral"}
                                >
                                    {icon}
                                </IconButton>
                            );
                        case "dropdown":
                            return (
                                <Dropdown key={idx}>
                                    <MenuButton
                                        slots={{ root: IconButton }}
                                        slotProps={{
                                            root: {
                                                variant: values?.includes(tool) ? "solid" : "plain",
                                                color: values?.includes(tool) ? "primary" : "neutral",
                                            },
                                        }}
                                    >
                                        {icon}
                                    </MenuButton>
                                    <Menu sx={{ flexDirection: "row", gap: 0.5, padding: 0.75, margin: "0 0 0 16px !important" }}>
                                        {children?.length &&
                                            children.map(({ icon, value }, idx) => (
                                                <MenuItem
                                                    key={idx}
                                                    slots={{ root: IconButton }}
                                                    slotProps={{
                                                        root: {
                                                            onClick: () => setTool(value),
                                                            variant: value === tool ? "solid" : "plain",
                                                            color: value === tool ? "primary" : "neutral",
                                                        },
                                                    }}
                                                >
                                                    {icon}
                                                </MenuItem>
                                            ))}
                                    </Menu>
                                </Dropdown>
                            );
                        case "divider":
                            return <Fragment key={idx}>{icon}</Fragment>;
                    }
                })}

                <input
                    hidden
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={(e) => e?.target?.files?.length && handleImageUpload({ file: e.target.files[0], fabricRef, setShape })}
                />
            </Sheet>
        </Stack>
    );
}
