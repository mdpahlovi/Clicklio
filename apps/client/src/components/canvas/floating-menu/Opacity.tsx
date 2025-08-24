import { OpacityIcon } from "@/components/icons";
import type { FloatingMenuItemProps } from "@/types";
import { Dropdown, IconButton, Menu, MenuButton, Slider, Tooltip } from "@mui/joy";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Opacity({ open, onOpenChange, currentObject, handleInputChange }: FloatingMenuItemProps) {
    const [value, setValue] = useState<number>(currentObject?.opacity || 0);

    const debouncedUpdate = useDebouncedCallback((value: number) => {
        handleInputChange("opacity", String(value));
    }, 150);

    return (
        <Dropdown open={open} onOpenChange={onOpenChange}>
            <Tooltip title="Opacity">
                <MenuButton slots={{ root: IconButton }}>
                    <OpacityIcon />
                </MenuButton>
            </Tooltip>
            <Menu placement="bottom" sx={{ p: 2, m: "4px 0 !important" }} style={{ width: 205 }}>
                <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={value}
                    valueLabelDisplay="on"
                    style={{ marginTop: 18, marginBottom: 28 }}
                    onChange={(_, value) => {
                        if (typeof value === "number") {
                            setValue(value);
                            debouncedUpdate(value);
                        }
                    }}
                    marks={[
                        { value: 0, label: "0%" },
                        { value: 1, label: "100%" },
                    ]}
                />
            </Menu>
        </Dropdown>
    );
}
