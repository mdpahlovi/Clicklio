import StrokeWidth from "@/components/canvas/floating-menu/StrokeWidth";
import { ColorIcon } from "@/components/icons";
import ColorPicker from "@/components/ui/color-picker";
import { presetColors } from "@/constants";
import type { FloatingMenuItemProps } from "@/types";
import { Box, Dropdown, IconButton, Menu, MenuButton, Tooltip } from "@mui/joy";

type ColorProps = { name: "fill" | "stroke" } & FloatingMenuItemProps;

export default function Colors({ name, open, onOpenChange, currentObject, handleInputChange }: ColorProps) {
    return (
        <Dropdown open={open} onOpenChange={onOpenChange}>
            <Tooltip title={name.charAt(0).toUpperCase() + name.slice(1)}>
                <MenuButton slots={{ root: IconButton }}>
                    {name === "fill" ? (
                        <ColorIcon color={currentObject?.attrs.fill as string} />
                    ) : (
                        <Box
                            style={{
                                width: 14,
                                height: 14,
                                borderRadius: 9999,
                                border: `2px solid ${currentObject?.attrs.stroke || "white"}`,
                            }}
                        />
                    )}
                </MenuButton>
            </Tooltip>
            <Menu placement="bottom" sx={{ p: 2, m: "4px 0 !important" }}>
                {name === "stroke" ? <StrokeWidth {...{ currentObject, handleInputChange }} /> : null}
                <ColorPicker
                    value={name === "fill" ? (currentObject?.fill() as string) : (currentObject?.stroke() as string)}
                    onChange={(color) => handleInputChange(name, color)}
                    presetColors={presetColors[name]}
                />
            </Menu>
        </Dropdown>
    );
}
