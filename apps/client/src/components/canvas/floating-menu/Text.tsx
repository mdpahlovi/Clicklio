import { ParagraphIcon } from "@/components/icons";
import { fontFamilyOptions } from "@/constants";
import type { FloatingMenuItemProps } from "@/types";
import { Dropdown, IconButton, Input, Menu, MenuButton, styled, Tooltip } from "@mui/joy";
import { useDebouncedCallback } from "use-debounce";

export default function Text({ open, onOpenChange, currentObject, handleInputChange }: FloatingMenuItemProps) {
    const debouncedUpdate = useDebouncedCallback((property: "fontSize", value: string) => {
        handleInputChange(property, value);
    }, 300);

    return (
        <Dropdown open={open} onOpenChange={onOpenChange}>
            <Tooltip title="Text">
                <MenuButton slots={{ root: IconButton }}>
                    <ParagraphIcon />
                </MenuButton>
            </Tooltip>
            <Menu placement="bottom" sx={{ p: 2, m: "4px 0 !important", width: 256, gap: 1.5 }}>
                <Select
                    defaultValue={currentObject?.fontFamily ? currentObject?.fontFamily : ""}
                    onChange={(e) => handleInputChange("fontFamily", e.target.value)}
                >
                    {fontFamilyOptions.map((option) => (
                        <Option key={option.value} value={option.value} style={{ fontFamily: "Poppins" }}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
                <Input
                    defaultValue={currentObject?.fontSize ? Number(currentObject?.fontSize) : 0}
                    onChange={(e) => debouncedUpdate("fontSize", e.target.value)}
                />
            </Menu>
        </Dropdown>
    );
}

const Select = styled("select")(({ theme: { palette, fontFamily, fontSize, lineHeight, shadow } }) => ({
    width: "100%",
    height: 36,
    border: "1px solid",
    paddingInline: 8,
    borderRadius: 8,
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
