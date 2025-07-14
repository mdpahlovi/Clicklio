import { circle, navElements } from "@/constants";
import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { useShapeStore } from "@/stores/room/useShapeStore";
import type { ToolbarProps } from "@/types";
import { handleImageUpload } from "@/utils/shapes";
import { Dropdown, IconButton, Menu, MenuButton, MenuItem, Sheet, Tooltip, useColorScheme } from "@mui/joy";
import * as fabric from "fabric";
import { Fragment, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export default function Toolbar({ fabricRef, selectedToolRef }: ToolbarProps) {
    const { mode } = useColorScheme();
    const { createShape } = useShapeStore();
    const [searchParams] = useSearchParams();
    const { tool, setTool } = useCanvasState();
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const documentInputRef = useRef<HTMLInputElement | null>(null);

    const room = searchParams.get("room");

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
                    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                    canvas.freeDrawingBrush.width = 1;
                    canvas.freeDrawingBrush.color = mode === "light" ? "#000000" : "#FFFFFF";
                    break;

                case "path-5":
                    canvas.isDrawingMode = true;
                    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                    canvas.freeDrawingBrush.width = 5;
                    canvas.freeDrawingBrush.color = mode === "light" ? "#000000" : "#FFFFFF";
                    break;

                case "path-10":
                    canvas.isDrawingMode = true;
                    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                    canvas.freeDrawingBrush.width = 10;
                    canvas.freeDrawingBrush.color = mode === "light" ? "#000000" : "#FFFFFF";
                    break;

                case "image":
                    imageInputRef.current?.click();
                    setTimeout(() => setTool("select"), 500);
                    break;

                case "video":
                    videoInputRef.current?.click();
                    setTimeout(() => setTool("select"), 500);
                    break;

                case "document":
                    documentInputRef.current?.click();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tool, mode]);

    return (
        <Sheet
            sx={{ position: "absolute", zIndex: 10, inset: 0, top: 24, bottom: 73, my: "auto", p: 0.75, width: 36 }}
            style={{ borderLeft: 0, borderRadius: "0 24px 24px 0", display: "grid", gap: 4, overflowY: "auto", maxHeight: 286 }}
        >
            {navElements.map(({ name, value, values, icon, type, children }, idx) => {
                switch (type) {
                    case "tool":
                        return (
                            <Tooltip key={idx} title={name} placement="right">
                                <IconButton
                                    onClick={() => value && setTool(value)}
                                    variant={value === tool ? "solid" : "plain"}
                                    color={value === tool ? "primary" : "neutral"}
                                >
                                    {icon}
                                </IconButton>
                            </Tooltip>
                        );
                    case "dropdown":
                        return (
                            <Dropdown key={idx}>
                                <Tooltip title={name} placement="right">
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
                                </Tooltip>
                                <Menu
                                    sx={{ p: 0.75, m: "0 0 0 16px !important" }}
                                    style={{ borderRadius: 9999, flexDirection: "row", gap: 4 }}
                                >
                                    {children?.length &&
                                        children.map(({ icon, name, value }, idx) => (
                                            <Tooltip key={idx} title={name}>
                                                <MenuItem
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
                                            </Tooltip>
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
                onChange={(e) => {
                    const files = e?.target?.files;

                    if (files && e?.target?.files?.length) {
                        handleImageUpload({ file: files[0], room, fabricRef, createShape });
                        if (imageInputRef.current) imageInputRef.current.value = "";
                    }
                }}
            />

            <input
                hidden
                type="file"
                accept="video/*"
                ref={videoInputRef}
                onChange={(e) => {
                    const files = e?.target?.files;

                    if (files && e?.target?.files?.length) {
                        toast.error("Video upload is not supported yet.");

                        if (videoInputRef.current) videoInputRef.current.value = "";
                    }
                }}
            />

            <input
                hidden
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                ref={documentInputRef}
                onChange={(e) => {
                    const files = e?.target?.files;

                    if (files && e?.target?.files?.length) {
                        toast.error("Document upload is not supported yet.");

                        if (documentInputRef.current) documentInputRef.current.value = "";
                    }
                }}
            />
        </Sheet>
    );
}
