import { Slider } from "@mui/joy";
import { Attributes } from "@/types";
import { useCanvasState } from "@/hooks/useCanvasState";
import { Section } from "@/components/home/side-toolbar/components";

type StrokeWidthProps = { handleInputChange: (property: keyof Attributes, value: string) => void };

export default function StrokeWidth({ handleInputChange }: StrokeWidthProps) {
    const { attributes } = useCanvasState();
    const value = attributes?.strokeWidth ? Number(attributes.strokeWidth) : 0;

    const thumbStyle = (): React.CSSProperties => {
        switch (value) {
            case 0:
                return { left: 9 };
            case 20:
                return { left: `calc(100% - 9px)` };
            default:
                return { left: `${value * 5}%` };
        }
    };

    return (
        <Section title="Stroke Width">
            <Slider
                min={0}
                max={20}
                step={1}
                value={value}
                onChange={(_, value) => handleInputChange("strokeWidth", value.toString())}
                slotProps={{ track: { style: value === 20 ? { borderRadius: 10 } : undefined }, thumb: { style: thumbStyle() } }}
                marks={[
                    { value: 0, label: "0px" },
                    { value: 20, label: "20px" },
                ]}
            />
        </Section>
    );
}
