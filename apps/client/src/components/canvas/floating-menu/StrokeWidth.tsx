import type { FloatingMenuSubItemProps } from "@/types";
import { Button, Slider, Stack, ToggleButtonGroup, Typography } from "@mui/joy";
import { useState } from "react";

export default function StrokeWidth({ currentObject, handleInputChange }: FloatingMenuSubItemProps) {
    const [value, setValue] = useState(currentObject?.strokeWidth ? Number(currentObject?.strokeWidth) : 0);

    return (
        <>
            <Stack gap={0.5}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography level="title-sm" textTransform="uppercase">
                        Stroke Width
                    </Typography>
                    <Typography level="title-sm" textTransform="uppercase">
                        {`${value}px`}
                    </Typography>
                </div>
                <Slider
                    min={0}
                    max={20}
                    step={1}
                    value={value}
                    onChange={(_, value) => {
                        if (typeof value === "number") {
                            setValue(value);
                            handleInputChange("strokeWidth", String(value));
                        }
                    }}
                />
            </Stack>
            <Stack gap={0.5}>
                <Typography level="title-sm" textTransform="uppercase">
                    Stroke Style
                </Typography>
                <ToggleButtonGroup
                    variant="outlined"
                    size="sm"
                    value={currentObject?.strokeStyle}
                    onChange={(_, value) => handleInputChange("strokeStyle", value as string)}
                >
                    <Button sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} value="solid" fullWidth>
                        Solid
                    </Button>
                    <Button sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} value="dashed" fullWidth>
                        Dashed
                    </Button>
                </ToggleButtonGroup>
            </Stack>
        </>
    );
}
