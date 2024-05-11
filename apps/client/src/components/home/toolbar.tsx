import { navElements } from "@/constants";
import { useEffect, useRef } from "react";
import { handleImageUpload } from "@/utils/shapes";
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
                                <Dropdown>
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
                                    <Menu style={{ flexDirection: "row", gap: 4, padding: 6 }}>
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
                            return icon;
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
