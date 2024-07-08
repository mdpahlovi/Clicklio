import { useCanvasState } from "@/hooks/useCanvasState";
import { Section } from "@/components/home/side-toolbar/components";
import { Box, BoxProps, Divider, Input, useColorScheme } from "@mui/joy";

import type { Attributes } from "@/types";

type ColorProps = {
    placeholder: string;
    attribute: "fill" | "stroke";
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

function ColorBox({ active, ...props }: { active: boolean } & BoxProps) {
    const { mode } = useColorScheme();
    const baseColor = mode === "light" ? "#000000" : "#FFFFFF";

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

export default function Color({ placeholder, attribute, handleInputChange }: ColorProps) {
    const { mode } = useColorScheme();
    const { attributes } = useCanvasState();
    const value = attributes && attributes[attribute];
    const baseColor = mode === "light" ? "#000000" : "#FFFFFF";

    return (
        <Section title={placeholder}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <ColorBox
                    active={value === null}
                    onClick={() => handleInputChange(attribute, "")}
                    style={{
                        backgroundColor: "white",
                        backgroundImage:
                            "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')",
                    }}
                />
                <Divider orientation="vertical" />
                {[baseColor, "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FFA500", "#800080", "#00FFFF"].map((color) => (
                    <ColorBox
                        key={color}
                        active={color === value}
                        style={{ backgroundColor: color }}
                        onClick={() => handleInputChange(attribute, color)}
                    />
                ))}
                <Divider orientation="vertical" />
                <Input
                    value={value ? value.slice(1, 7) : ""}
                    startDecorator="#"
                    style={{ width: 98, minHeight: 28, paddingInline: 6 }}
                    readOnly
                />
            </div>
        </Section>
    );
}
