import type { FloatingMenuSubItemProps } from "@/types";
import { Slider } from "@mui/joy";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function StrokeWidth({ currentObject, handleInputChange }: FloatingMenuSubItemProps) {
    const [value, setValue] = useState<number>(currentObject?.strokeWidth() || 0);

    const debouncedUpdate = useDebouncedCallback((value: number) => {
        handleInputChange("strokeWidth", String(value));
    }, 150);

    return (
        <Slider
            min={0}
            max={20}
            step={1}
            valueLabelDisplay="on"
            valueLabelFormat={(value) => `${value}px`}
            style={{ marginTop: 18, marginBottom: 4 }}
            value={value}
            onChange={(_, value) => {
                if (typeof value === "number") {
                    setValue(value);
                    debouncedUpdate(value);
                }
            }}
        />
    );
}
