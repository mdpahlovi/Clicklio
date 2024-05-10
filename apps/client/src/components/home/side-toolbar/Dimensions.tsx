import { Input } from "@mui/joy";
import { DoubleColumn, Section } from "@/components/home/side-toolbar/components";

import { useCanvasState } from "@/hooks/useCanvasState";
import type { Attributes } from "@/types";

type Property = "top" | "left" | "width" | "height";
const dimensionsOptions: { label: string; property: Property; placeholder: string }[] = [
    { label: "X", property: "top", placeholder: "Top" },
    { label: "Y", property: "left", placeholder: "Left" },
    { label: "W", property: "width", placeholder: "Width" },
    { label: "H", property: "height", placeholder: "Height" },
];

type DimensionsProps = {
    isEditingRef: React.MutableRefObject<boolean>;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export default function Dimensions({ isEditingRef, handleInputChange }: DimensionsProps) {
    const { attributes } = useCanvasState();

    return (
        <Section title="Dimensions">
            <DoubleColumn>
                {dimensionsOptions.map(({ label, property, placeholder }) => (
                    <Input
                        key={property}
                        startDecorator={label}
                        placeholder={placeholder}
                        onBlur={() => (isEditingRef.current = false)}
                        defaultValue={attributes ? attributes[property] : ""}
                        onChange={(e) => handleInputChange(property, e.target.value)}
                    />
                ))}
            </DoubleColumn>
        </Section>
    );
}
