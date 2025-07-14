import StrokeWidth from "@/components/canvas/floating-menu/StrokeWidth";
import type { FloatingMenuItemProps } from "@/types";
import { Box, type BoxProps, Divider, Dropdown, IconButton, Menu, MenuButton, Tooltip, useTheme } from "@mui/joy";

type ColorProps = { name: "fill" | "stroke" } & FloatingMenuItemProps;

const backgroundImage =
    "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')";

export default function Colors({ name, open, onOpenChange, currentObject, handleInputChange }: ColorProps) {
    const { palette } = useTheme();
    const iconProps: React.CSSProperties = { width: 14, height: 14, borderRadius: 9999, border: "2px solid" };
    const baseColor = palette.mode === "light" ? "#000000" : "#FFFFFF";

    return (
        <Dropdown open={open} onOpenChange={onOpenChange}>
            <Tooltip title={name.charAt(0).toUpperCase() + name.slice(1)}>
                <MenuButton slots={{ root: IconButton }}>
                    {name === "fill" ? (
                        <div
                            style={{
                                ...iconProps,
                                borderColor: currentObject ? (currentObject?.fill as string) : undefined,
                                backgroundColor: currentObject ? (currentObject?.fill as string) : undefined,
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                ...iconProps,
                                backgroundColor: palette.background.body,
                                borderColor: currentObject ? (currentObject?.stroke as string) : undefined,
                            }}
                        />
                    )}
                </MenuButton>
            </Tooltip>
            <Menu placement="bottom" sx={{ p: 2, m: "4px 0 !important" }} style={{ maxWidth: 205 }}>
                {name === "stroke" ? <StrokeWidth {...{ currentObject, handleInputChange }} /> : null}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <ColorBox
                        active={currentObject?.fill === null}
                        onClick={() => handleInputChange(name, "")}
                        style={{ backgroundColor: "white", backgroundImage }}
                    />
                    <Divider orientation="vertical" />
                    {[baseColor, "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FFA500", "#800080", "#00FFFF"].map((color) => (
                        <ColorBox
                            key={color}
                            style={{ backgroundColor: color }}
                            onClick={() => handleInputChange(name, color)}
                            active={name === "fill" ? color === currentObject?.fill : color === currentObject?.stroke}
                        />
                    ))}
                </div>
            </Menu>
        </Dropdown>
    );
}

function ColorBox({ active, ...props }: { active: boolean } & BoxProps) {
    const { palette } = useTheme();
    const baseColor = palette.mode === "light" ? "#000000" : "#FFFFFF";

    return (
        <Box
            sx={({ palette }) => ({
                width: 28,
                height: 28,
                cursor: "pointer",
                borderRadius: 6,
                outlineOffset: 2.5,
                outline: 1,
                outlineColor: active ? baseColor : "transparent",
                ":hover": { outlineColor: active ? baseColor : palette.divider },
            })}
            {...props}
        />
    );
}
