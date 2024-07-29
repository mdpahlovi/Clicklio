import { MdOpacity } from "react-icons/md";
import { Dropdown, IconButton, Menu, MenuButton, Slider, Tooltip } from "@mui/joy";
import type { FloatingMenuItemProps } from "@/types";

export default function Opacity({ open, onOpenChange, currentObject, handleInputChange }: FloatingMenuItemProps) {
    const value = currentObject?.opacity;

    const thumbStyle = (): React.CSSProperties => {
        switch (value) {
            case 0:
                return { left: 9 };
            case 1:
                return { left: `calc(100% - 9px)` };
            default:
                return { left: `${(value ? value : 0) * 100}%` };
        }
    };

    return (
        <Dropdown open={open} onOpenChange={onOpenChange}>
            <Tooltip title="Opacity">
                <MenuButton slots={{ root: IconButton }}>
                    <MdOpacity />
                </MenuButton>
            </Tooltip>
            <Menu placement="bottom" sx={{ p: 2, m: "4px 0 !important" }} style={{ width: 205 }}>
                <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={value}
                    onChange={(_, value) => handleInputChange("opacity", String(value))}
                    slotProps={{ track: { style: value === 1 ? { borderRadius: 10 } : undefined }, thumb: { style: thumbStyle() } }}
                    marks={[
                        { value: 0, label: "0%" },
                        { value: 1, label: "100%" },
                    ]}
                />
            </Menu>
        </Dropdown>
    );
}
