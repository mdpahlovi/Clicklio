import { circle, navElements } from "@/constants";
import { handleImageUpload } from "@/utils/shapes";
import { useSearchParams } from "react-router-dom";
import { Fragment, useEffect, useRef } from "react";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { handleCopy, handleDelete, handlePaste } from "@/utils/key-events";
import { Sheet, IconButton, Dropdown, MenuButton, Menu, MenuItem, useColorScheme } from "@mui/joy";
import type { ToolbarProps } from "@/types";

export default function Toolbar({ fabricRef, selectedToolRef, pasteTimeRef, copiedObjectRef }: ToolbarProps) {
    const { mode } = useColorScheme();
    const [searchParams] = useSearchParams();
    const { tool, setTool } = useCanvasState();
    const { setShape, deleteShape } = useShapeState();
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const canvas = fabricRef.current;
        if (canvas) {
            selectedToolRef.current = tool;

            canvas.selection = false;
            canvas.isDrawingMode = false;
            canvas.defaultCursor = "default";
            canvas.hoverCursor = "all-scroll";
            canvas.forEachObject((object) => {
                object.evented = true;
                object.selectable = true;
            });

            switch (tool) {
                case "panning":
                    canvas.defaultCursor = "grab";
                    canvas.forEachObject((object) => {
                        object.evented = false;
                        object.selectable = false;
                    });
                    break;

                case "select":
                    canvas.selection = true;
                    break;

                case "path-1":
                    canvas.isDrawingMode = true;
                    canvas.freeDrawingBrush.width = 1;
                    canvas.freeDrawingBrush.color = mode === "light" ? "#000000" : "#FFFFFF";
                    break;

                case "path-5":
                    canvas.isDrawingMode = true;
                    canvas.freeDrawingBrush.width = 5;
                    canvas.freeDrawingBrush.color = mode === "light" ? "#000000" : "#FFFFFF";
                    break;

                case "path-10":
                    canvas.isDrawingMode = true;
                    canvas.freeDrawingBrush.width = 10;
                    canvas.freeDrawingBrush.color = mode === "light" ? "#000000" : "#FFFFFF";
                    break;

                case "image":
                    imageInputRef.current?.click();
                    setTimeout(() => setTool("select"), 500);
                    break;

                case "eraser":
                    canvas.defaultCursor = circle(mode);
                    canvas.hoverCursor = circle(mode);
                    break;

                default:
                    canvas.defaultCursor = "crosshair";
                    break;
            }
        }
    }, [tool, mode]);

    return (
        <Sheet
            sx={{ position: "absolute", zIndex: 1, inset: 0, top: 24, bottom: 73, my: "auto", p: 0.75, width: 36 }}
            style={{ borderLeft: 0, borderRadius: "0 16px 16px 0", display: "grid", gap: 4, overflowY: "auto", maxHeight: 366 }}
        >
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

                    case "duplicate":
                        return (
                            <IconButton
                                key={idx}
                                onClick={() => {
                                    if (fabricRef.current) {
                                        handleCopy(fabricRef.current, copiedObjectRef);
                                        handlePaste(fabricRef.current, searchParams.get("room"), pasteTimeRef, copiedObjectRef, setShape);
                                    }
                                }}
                                disabled={!fabricRef.current || !fabricRef.current.getActiveObject()}
                            >
                                {icon}
                            </IconButton>
                        );

                    case "delete":
                        return (
                            <IconButton
                                key={idx}
                                onClick={() =>
                                    fabricRef.current ? handleDelete(fabricRef.current, searchParams.get("room"), deleteShape) : null
                                }
                                disabled={!fabricRef.current || !fabricRef.current.getActiveObject()}
                            >
                                {icon}
                            </IconButton>
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
                onChange={(e) =>
                    e?.target?.files?.length &&
                    handleImageUpload({ file: e.target.files[0], room: searchParams.get("room"), fabricRef, setShape })
                }
            />
        </Sheet>
    );
}
