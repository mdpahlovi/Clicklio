import StrokeWidth from "@/components/canvas/floating-menu/StrokeWidth";
import { ColorIcon, SquareIcon } from "@/components/icons";
import ColorPicker from "@/components/ui/color-picker";
import { presetColors } from "@/constants";
import type { FloatingMenuItemProps } from "@/types";
import { Dropdown, IconButton, Menu, MenuButton, Stack, Tooltip, Typography } from "@mui/joy";

type ColorProps = { name: "fill" | "stroke" } & FloatingMenuItemProps;

export default function Colors({ name, open, onOpenChange, currentObject, handleInputChange }: ColorProps) {
    return (
        <Dropdown open={open} onOpenChange={onOpenChange}>
            <Tooltip title={name.charAt(0).toUpperCase() + name.slice(1)}>
                <MenuButton slots={{ root: IconButton }}>
                    {name === "fill" ? (
                        <ColorIcon color={currentObject?.fill || "#FFFFFF"} />
                    ) : (
                        <SquareIcon color={currentObject?.stroke || "#FFFFFF"} />
                    )}
                </MenuButton>
            </Tooltip>
            <Menu placement="bottom" sx={{ p: 2, m: "4px 0 !important", gap: 1.5 }}>
                {name === "stroke" ? <StrokeWidth {...{ currentObject, handleInputChange }} /> : null}
                <Stack gap={0.5}>
                    <Typography level="title-sm" textTransform="uppercase">
                        {name} Color
                    </Typography>
                    <ColorPicker
                        value={name === "fill" ? currentObject?.fill || "#FFFFFF" : currentObject?.stroke || "#FFFFFF"}
                        onChange={(color) => handleInputChange(name, color)}
                        presetColors={presetColors[name]}
                    />
                </Stack>
            </Menu>
        </Dropdown>
    );
}
