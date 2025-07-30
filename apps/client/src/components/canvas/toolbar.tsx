import { circle, navElements } from "@/constants";
import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { ToolbarProps } from "@/types";
import { handleImageUpload } from "@/utils/shapes";
import { Dropdown, IconButton, Menu, MenuButton, MenuItem, Sheet, styled, Tooltip, useColorScheme } from "@mui/joy";
import * as fabric from "fabric";
import { Fragment, useEffect, useRef } from "react";

export default function Toolbar({ fabricRef, selectedToolRef }: ToolbarProps) {
    const { mode } = useColorScheme();
    const { createEvent } = useEventStore();
    const { tool, setTool } = useCanvasState();
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const documentInputRef = useRef<HTMLInputElement | null>(null);

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

                case "path":
                    canvas.isDrawingMode = true;
                    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                    canvas.freeDrawingBrush.width = 3;
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
        <ToolbarSheet>
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
                                <ToolbarMenu>
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
                                </ToolbarMenu>
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
                        handleImageUpload({ file: files[0], fabricRef, createEvent });
                        if (imageInputRef.current) imageInputRef.current.value = "";
                    }
                }}
            />
        </ToolbarSheet>
    );
}

const ToolbarSheet = styled(Sheet)(() => ({
    position: "absolute",
    top: "50%",
    left: 16,
    zIndex: 10,
    padding: 4,
    borderRadius: 99,
    display: "grid",
    gap: 4,
    transform: "translateY(-50%)",
}));

const ToolbarMenu = styled(Menu)(() => ({
    padding: 6,
    margin: "0 0 0 16px !important",
    borderRadius: 99,
    flexDirection: "row",
    gap: 4,
}));
