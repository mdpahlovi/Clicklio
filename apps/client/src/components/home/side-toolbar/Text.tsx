import { fontFamilyOptions, fontSizeOptions, fontWeightOptions } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const selectConfigs = [
    { property: "fontFamily", placeholder: "Choose a font", options: fontFamilyOptions },
    { property: "fontSize", placeholder: "30", options: fontSizeOptions },
    { property: "fontWeight", placeholder: "Semibold", options: fontWeightOptions },
];

type TextProps = {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    handleInputChange: (property: string, value: string) => void;
};

const Text = ({ fontFamily, fontSize, fontWeight, handleInputChange }: TextProps) => (
    <div className="flex flex-col gap-2.5 p-4">
        <p className="text-sm">Text</p>

        {RenderSelect({
            config: selectConfigs[0],
            fontSize,
            fontWeight,
            fontFamily,
            handleInputChange,
        })}

        <div className="flex gap-2.5">
            {selectConfigs.slice(1).map((config) =>
                RenderSelect({
                    config,
                    fontSize,
                    fontWeight,
                    fontFamily,
                    handleInputChange,
                }),
            )}
        </div>
    </div>
);

type Props = {
    config: { property: string; placeholder: string; options: { label: string; value: string }[] };
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    handleInputChange: (property: string, value: string) => void;
};

const RenderSelect = ({ config, fontSize, fontWeight, fontFamily, handleInputChange }: Props) => (
    <Select
        key={config.property}
        onValueChange={(value) => handleInputChange(config.property, value)}
        value={config.property === "fontFamily" ? fontFamily : config.property === "fontSize" ? fontSize : fontWeight}
    >
        <SelectTrigger>
            <SelectValue
                placeholder={config.property === "fontFamily" ? "Choose a font" : config.property === "fontSize" ? "30" : "Semibold"}
            />
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

export default Text;
