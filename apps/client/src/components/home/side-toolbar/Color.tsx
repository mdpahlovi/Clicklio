import { useCanvasState } from "@/hooks/useCanvasState";

import { Input, Typography } from "@mui/joy";
import { Section } from "@/components/home/side-toolbar/components";

import type { Attributes } from "@/types";

type ColorProps = {
    placeholder: string;
    attribute: "fill" | "stroke";
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export default function Color({ placeholder, attribute, handleInputChange }: ColorProps) {
    const { attributes } = useCanvasState();
    const value = attributes && attributes[attribute];

    return (
        <Section title={placeholder}>
            <Input
                type="color"
                value={value ? value : ""}
                slots={{ endDecorator: Typography }}
                endDecorator={value ? value : "No Color"}
                onChange={(e) => handleInputChange(attribute, e.target.value)}
                slotProps={{ input: { sx: { height: "36px" } }, endDecorator: { sx: { pl: 1.25, pr: 4 } } }}
            />
        </Section>
    );
}
