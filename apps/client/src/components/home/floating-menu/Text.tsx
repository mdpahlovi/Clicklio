import { fontFamilyOptions, fontSizeOptions, fontWeightOptions } from "@/constants";
import { Select, Option, Dropdown, Tooltip, MenuButton, Menu, IconButton } from "@mui/joy";

import type { Attributes } from "@/types";
import { MdFormatTextdirectionLToR } from "react-icons/md";

type Property = "fontFamily" | "fontSize" | "fontWeight";
type SelectConfig = { property: Property; placeholder: string; options: { label: string; value: string }[] };
type RenderSelectProps = {
    config: SelectConfig;
    handleInputChange: (property: keyof Attributes, value: string) => void;
    currentObject: fabric.Object | null;
};
type TextProps = {
    currentObject: fabric.Object | null;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

const selectConfigs: SelectConfig[] = [
    { property: "fontFamily", placeholder: "Choose A Font", options: fontFamilyOptions },
    { property: "fontSize", placeholder: "Size", options: fontSizeOptions },
    { property: "fontWeight", placeholder: "Weight", options: fontWeightOptions },
];

export default function Text({ currentObject, handleInputChange }: TextProps) {
    return (
        <Dropdown>
            <Tooltip title="Text">
                <MenuButton slots={{ root: IconButton }}>
                    <MdFormatTextdirectionLToR />
                </MenuButton>
            </Tooltip>
            <Menu
                placement="bottom"
                sx={{ p: 2, m: "4px 0 !important" }}
                style={{ borderRadius: 24, width: 205, display: "grid", gap: 10 }}
            >
                {RenderSelect({ config: selectConfigs[0], handleInputChange, currentObject })}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {selectConfigs.slice(1).map((config) => RenderSelect({ config, handleInputChange, currentObject }))}
                </div>
            </Menu>
        </Dropdown>
    );
}

function RenderSelect({ currentObject, config: { property, placeholder, options }, handleInputChange }: RenderSelectProps) {
    const defaultValue = currentObject ? (currentObject as fabric.IText)[property] : "";

    return (
        <Select
            key={property}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={(_, value) => value && handleInputChange(property, String(value))}
        >
            {options.map((option) => (
                <Option key={option.value} value={option.value}>
                    {option.label}
                </Option>
            ))}
        </Select>
    );
}
