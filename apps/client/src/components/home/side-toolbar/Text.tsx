import { fontFamilyOptions, fontSizeOptions, fontWeightOptions } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        <div className="flex flex-col gap-2.5 p-4">
            <p className="text-sm">Text</p>

            {RenderSelect({
                config: selectConfigs[0],
                handleInputChange,
            })}

            <div className="flex gap-2.5">
                {selectConfigs.slice(1).map((config) =>
                    RenderSelect({
                        config,
                        handleInputChange,
                    }),
                )}
            </div>
        </div>
    );
}

function RenderSelect({ config, handleInputChange }: RenderSelectProps) {
    const { attributes } = useCanvasState();

    return (
        <Select
            key={config.property}
            onValueChange={(value) => handleInputChange(config.property, value)}
            value={attributes ? attributes[config.property] : ""}
        >
            <SelectTrigger>
                <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent>
                {config.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
