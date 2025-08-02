import { circle, navElements } from "@/constants";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { ToolbarProps } from "@/types";
import { handleImageUpload } from "@/utils/shapes";
import { Dropdown, IconButton, Menu, MenuButton, MenuItem, Sheet, styled, Tooltip } from "@mui/joy";
import { Fragment, useEffect, useRef } from "react";

export default function Toolbar({ stage, selectedToolRef }: ToolbarProps) {
    const { createEvent } = useEventStore();
    const { tool, setTool } = useCanvasState();
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        switch (tool) {
            case "panning":
                stage.container().style.cursor = "grabbing";
                break;
            case "select":
                stage.container().style.cursor = "default";
                break;
            case "rect":
                stage.container().style.cursor = "crosshair";
                selectedToolRef.current = tool;
                break;
            case "triangle":
                stage.container().style.cursor = "crosshair";
                selectedToolRef.current = tool;
                break;
            case "circle":
                stage.container().style.cursor = "crosshair";
                selectedToolRef.current = tool;
                break;
            case "line":
                stage.container().style.cursor = "crosshair";
                selectedToolRef.current = tool;
                break;
            case "arrow":
                stage.container().style.cursor = "crosshair";
                selectedToolRef.current = tool;
                break;
            case "path":
                stage.container().style.cursor = "crosshair";
                selectedToolRef.current = tool;
                break;
            case "i-text":
                stage.container().style.cursor = "crosshair";
                selectedToolRef.current = tool;
                break;
            case "image":
                imageInputRef.current?.click();
                setTimeout(() => setTool("select"), 500);
                break;
            case "eraser":
                stage.container().style.cursor = circle("dark");
                selectedToolRef.current = tool;
                break;
        }
    }, [tool]);

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
                        handleImageUpload({ file: files[0], stage, createEvent });
                        if (imageInputRef.current) imageInputRef.current.value = "";
                    }
                }}
            />
        </ToolbarSheet>
    );
}

const ToolbarSheet = styled(Sheet)(() => ({
    position: "fixed",
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
