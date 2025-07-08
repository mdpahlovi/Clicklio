import type { FloatingMenuSubItemProps } from "@/types";
import { Slider } from "@mui/joy";

export default function StrokeWidth({ currentObject, handleInputChange }: FloatingMenuSubItemProps) {
    const value = currentObject?.strokeWidth;

    const thumbStyle = (): React.CSSProperties => {
        switch (value) {
            case 0:
                return { left: 9 };
            case 20:
                return { left: `calc(100% - 9px)` };
            default:
                return { left: `${(value ? value : 0) * 5}%` };
        }
    };

    return (
        <Slider
            min={0}
            max={20}
            step={1}
            value={value}
            style={{ padding: 10, marginBottom: 36 }}
            onChange={(_, value) => handleInputChange("strokeWidth", String(value))}
            slotProps={{ track: { style: value === 20 ? { borderRadius: 10 } : undefined }, thumb: { style: thumbStyle() } }}
            marks={[
                { value: 0, label: "0px" },
                { value: 20, label: "20px" },
            ]}
        />
    );
}
