import { OpacityIcon } from "@/components/icons";
import type { FloatingMenuItemProps } from "@/types";
import { Dropdown, IconButton, Menu, MenuButton, Slider, Stack, Tooltip, Typography } from "@mui/joy";
import type Konva from "konva";
import { useState } from "react";

export default function Opacity({ open, onOpenChange, currentObject, handleInputChange }: FloatingMenuItemProps) {
    const [cornerRadius, setCornerRadius] = useState((currentObject as Konva.Rect)?.cornerRadius() || 0);
    const [opacity, setOpacity] = useState(currentObject?.opacity() || 0);

    return (
        <Dropdown open={open} onOpenChange={onOpenChange}>
            <Tooltip title="Properties">
                <MenuButton slots={{ root: IconButton }}>
                    <OpacityIcon />
                </MenuButton>
            </Tooltip>
            <Menu placement="bottom" sx={{ p: 2, m: "4px 0 !important", width: 256, gap: 1.5 }}>
                <Stack gap={0.5}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography level="title-sm" textTransform="uppercase">
                            Corner Radius
                        </Typography>
                        <Typography level="title-sm" textTransform="uppercase">
                            {`${cornerRadius}px`}
                        </Typography>
                    </div>
                    <Slider
                        min={0}
                        max={Math.round(Math.min(currentObject?.width() || 0, currentObject?.height() || 0) / 2)}
                        step={1}
                        defaultValue={cornerRadius}
                        onChange={(_, value) => {
                            if (typeof value === "number") {
                                setCornerRadius(value);
                                handleInputChange("cornerRadius", String(value));
                            }
                        }}
                    />
                </Stack>
                <Stack gap={0.5}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography level="title-sm" textTransform="uppercase">
                            Opacity
                        </Typography>
                        <Typography level="title-sm" textTransform="uppercase">
                            {`${opacity * 100}%`}
                        </Typography>
                    </div>
                    <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        defaultValue={opacity}
                        onChange={(_, value) => {
                            if (typeof value === "number") {
                                setOpacity(value);
                                handleInputChange("opacity", String(value));
                            }
                        }}
                    />
                </Stack>
            </Menu>
        </Dropdown>
    );
}
