import { fontFamilyOptions, fontSizeOptions, fontWeightOptions } from "@/constants";
import type { FloatingMenuItemProps, FloatingMenuSubItemProps } from "@/types";
import { Dropdown, IconButton, Menu, MenuButton, styled, Tooltip } from "@mui/joy";
import * as fabric from "fabric";
import { MdFormatTextdirectionLToR } from "react-icons/md";

type Property = "fontFamily" | "fontSize" | "fontWeight";
type SelectConfig = { property: Property; options: { label: string; value: string }[] };
type RenderSelectProps = { config: SelectConfig } & FloatingMenuSubItemProps;

const selectConfigs: SelectConfig[] = [
    { property: "fontFamily", options: fontFamilyOptions },
    { property: "fontSize", options: fontSizeOptions },
    { property: "fontWeight", options: fontWeightOptions },
];

export default function Text({ open, onOpenChange, currentObject, handleInputChange }: FloatingMenuItemProps) {
    return (
        <Dropdown open={open} onOpenChange={onOpenChange}>
            <Tooltip title="Text">
                <MenuButton slots={{ root: IconButton }}>
                    <MdFormatTextdirectionLToR />
                </MenuButton>
            </Tooltip>
            <Menu placement="bottom" sx={{ p: 2, m: "4px 0 !important" }} style={{ width: 205, display: "grid", gap: 10 }}>
                {RenderSelect({ config: selectConfigs[0], handleInputChange, currentObject })}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {selectConfigs.slice(1).map((config) => RenderSelect({ config, handleInputChange, currentObject }))}
                </div>
            </Menu>
        </Dropdown>
    );
}

function RenderSelect({ currentObject, config: { property, options }, handleInputChange }: RenderSelectProps) {
    const defaultValue = currentObject ? (currentObject as fabric.IText)[property] : "";

    return (
        <Select key={property} value={String(defaultValue)} onChange={(e) => handleInputChange(property, String(e.target.value))}>
            {options.map((option) => (
                <Option key={option.value} value={option.value} style={{ fontFamily: "Poppins" }}>
                    {option.label}
                </Option>
            ))}
        </Select>
    );
}

const Select = styled("select")(({ theme: { palette, fontFamily, fontSize, lineHeight, shadow } }) => ({
    width: "100%",
    height: 36,
    border: "1px solid",
    paddingInline: 8,
    borderRadius: 10,
    backgroundColor: palette.background.surface,
    borderColor: palette.neutral.outlinedBorder,
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: palette.neutral.outlinedColor,
    boxShadow: shadow.xs,
    ":focus": { borderColor: palette.focusVisible },
}));

const Option = styled("option")(({ theme: { fontFamily, fontSize, lineHeight } }) => ({
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
}));
