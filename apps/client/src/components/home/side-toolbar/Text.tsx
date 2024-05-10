import { Select, Option } from "@mui/joy";
import { Section, DoubleColumn } from "@/components/home/side-toolbar/components";
import { fontFamilyOptions, fontSizeOptions, fontWeightOptions } from "@/constants";

import { useCanvasState } from "@/hooks/useCanvasState";
import type { Attributes } from "@/types";

type Property = "fontFamily" | "fontSize" | "fontWeight";
type SelectConfig = { property: Property; placeholder: string; options: { label: string; value: string }[] };
type RenderSelectProps = { config: SelectConfig; handleInputChange: (property: keyof Attributes, value: string) => void };

const selectConfigs: SelectConfig[] = [
    { property: "fontFamily", placeholder: "Choose A Font", options: fontFamilyOptions },
    { property: "fontSize", placeholder: "Size", options: fontSizeOptions },
    { property: "fontWeight", placeholder: "Weight", options: fontWeightOptions },
];

export default function Text({ handleInputChange }: { handleInputChange: (property: keyof Attributes, value: string) => void }) {
    return (
        <Section title="Text">
            {RenderSelect({ config: selectConfigs[0], handleInputChange })}
            <DoubleColumn>{selectConfigs.slice(1).map((config) => RenderSelect({ config, handleInputChange }))}</DoubleColumn>
        </Section>
    );
}

function RenderSelect({ config: { property, placeholder, options }, handleInputChange }: RenderSelectProps) {
    const { attributes } = useCanvasState();

    return (
        <Select
            key={property}
            placeholder={placeholder}
            defaultValue={attributes ? attributes[property] : ""}
            onChange={(_, value) => value && handleInputChange(property, value)}
        >
            {options.map((option) => (
                <Option key={option.value} value={option.value}>
                    {option.label}
                </Option>
            ))}
        </Select>
    );
}
