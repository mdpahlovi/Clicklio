import type { FloatingMenuSubItemProps } from "@/types";
import { Slider } from "@mui/joy";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function StrokeWidth({ currentObject, handleInputChange }: FloatingMenuSubItemProps) {
    const [value, setValue] = useState<number>(currentObject?.strokeWidth || 0);

    const debouncedUpdate = useDebouncedCallback((value: number) => {
        handleInputChange("strokeWidth", String(value));
    }, 150);

    return (
        <Slider
            min={0}
            max={20}
            step={1}
            valueLabelDisplay="on"
            style={{ marginTop: 18, marginBottom: 28 }}
            value={value}
            onChange={(_, value) => {
                if (typeof value === "number") {
                    setValue(value);
                    debouncedUpdate(value);
                }
            }}
            marks={[
                { value: 0, label: "0px" },
                { value: 20, label: "20px" },
            ]}
        />
    );
}
