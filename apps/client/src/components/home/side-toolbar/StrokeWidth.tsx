import { Slider } from "@mui/joy";
import { Attributes } from "@/types";
import { useCanvasState } from "@/hooks/useCanvasState";
import { Section } from "@/components/home/side-toolbar/components";

type StrokeWidthProps = {
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export default function StrokeWidth({ handleInputChange }: StrokeWidthProps) {
    const { attributes } = useCanvasState();
    const value = attributes?.strokeWidth ? Number(attributes.strokeWidth) : 0;

    const thumbStyle = (): React.CSSProperties => {
        switch (value) {
            case 0:
                return { left: 9 };
            case 10:
                return { left: `calc(100% - 9px)` };
            default:
                return { left: `${value * 10}%` };
        }
    };

    return (
        <Section title="Stroke Width">
            <Slider
                marks
                min={0}
                max={10}
                step={1}
                value={value}
                sx={{ "--Slider-trackSize": "20px" }}
                style={{ marginTop: 0, marginBottom: -10 }}
                onChange={(_, value) => handleInputChange("strokeWidth", value.toString())}
                slotProps={{ track: { style: value === 10 ? { borderRadius: 10 } : undefined }, thumb: { style: thumbStyle() } }}
            />
        </Section>
    );
}
