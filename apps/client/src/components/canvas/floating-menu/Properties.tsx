import type { FloatingMenuItemProps } from "@/types";
import { Dropdown, IconButton, Menu, MenuButton, Slider, Stack, Tooltip, Typography } from "@mui/joy";
import { useState } from "react";

export default function Properties({ open, onOpenChange, currentObject, handleInputChange }: FloatingMenuItemProps) {
    const [cornerRadius, setCornerRadius] = useState(currentObject?.cornerRadius ? Number(currentObject?.cornerRadius) : 0);
    const [opacity, setOpacity] = useState(currentObject?.opacity ? Number(currentObject?.opacity) : 0);

    return (
        <Dropdown open={open} onOpenChange={onOpenChange}>
            <Tooltip title="Properties">
                <MenuButton slots={{ root: IconButton }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                        <path
                            d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5C10 9.32843 9.32843 10 8.5 10Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M15.5 17C16.3284 17 17 16.3284 17 15.5C17 14.6716 16.3284 14 15.5 14C14.6716 14 14 14.6716 14 15.5C14 16.3284 14.6716 17 15.5 17Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path d="M10 8.5L17 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M14 15.5L7 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </MenuButton>
            </Tooltip>
            <Menu placement="bottom" sx={{ p: 2, m: "4px 0 !important", width: 256, gap: 1.5 }}>
                {!["Line", "Arrow", "Text"].includes(currentObject.type) ? (
                    <Stack gap={0.5}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography level="title-sm" textTransform="uppercase">
                                Corner Radius
                            </Typography>
                            <Typography level="title-sm" textTransform="uppercase">
                                {`${cornerRadius}px`}
                            </Typography>
                        </div>
                        <Slider
                            min={0}
                            max={currentObject?.maxCornerRadius ? Number(currentObject?.maxCornerRadius) : 0}
                            step={1}
                            value={cornerRadius}
                            onChange={(_, value) => {
                                if (typeof value === "number") {
                                    setCornerRadius(value);
                                    handleInputChange("cornerRadius", String(value));
                                }
                            }}
                        />
                    </Stack>
                ) : null}
                <Stack gap={0.5}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography level="title-sm" textTransform="uppercase">
                            Opacity
                        </Typography>
                        <Typography level="title-sm" textTransform="uppercase">
                            {`${opacity * 100}%`}
                        </Typography>
                    </div>
                    <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={opacity}
                        onChange={(_, value) => {
                            if (typeof value === "number") {
                                setOpacity(value);
                                handleInputChange("opacity", String(value));
                            }
                        }}
                    />
                </Stack>
            </Menu>
        </Dropdown>
    );
}
