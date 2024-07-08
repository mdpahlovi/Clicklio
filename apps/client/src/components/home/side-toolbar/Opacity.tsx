import { Slider } from "@mui/joy";
import type { Attributes } from "@/types";
import { useCanvasState } from "@/hooks/useCanvasState";
import { Section } from "@/components/home/side-toolbar/components";

type OpacityProps = { handleInputChange: (property: keyof Attributes, value: string) => void };

export default function Opacity({ handleInputChange }: OpacityProps) {
    const { attributes } = useCanvasState();
    const value = attributes?.opacity ? Number(attributes.opacity) : 0;

    const thumbStyle = (): React.CSSProperties => {
        switch (value) {
            case 0:
                return { left: 9 };
            case 1:
                return { left: `calc(100% - 9px)` };
            default:
                return { left: `${value * 100}%` };
        }
    };

    return (
        <Section title="Opacity">
            <Slider
                min={0}
                max={1}
                step={0.1}
                value={value}
                onChange={(_, value) => handleInputChange("opacity", value.toString())}
                slotProps={{ track: { style: value === 1 ? { borderRadius: 10 } : undefined }, thumb: { style: thumbStyle() } }}
                marks={[
                    { value: 0, label: "0%" },
                    { value: 1, label: "100%" },
                ]}
            />
        </Section>
    );
}
