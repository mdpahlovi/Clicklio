import { Slider } from "@mui/joy";
import { Attributes } from "@/types";
import { useCanvasState } from "@/hooks/useCanvasState";
import { Section } from "@/components/home/side-toolbar/components";

type OpacityProps = {
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export default function Opacity({ handleInputChange }: OpacityProps) {
    const { attributes } = useCanvasState();
    const value = (attributes?.opacity ? Number(attributes.opacity) : 0) * 100;

    const thumbStyle = (): React.CSSProperties => {
        switch (value) {
            case 0:
                return { left: 9 };
            case 100:
                return { left: `calc(100% - 9px)` };
            default:
                return { left: `${value}%` };
        }
    };

    return (
        <Section title="Opacity">
            <Slider
                marks
                min={0}
                max={100}
                step={10}
                value={value}
                sx={{ "--Slider-trackSize": "20px" }}
                style={{ marginTop: 0, marginBottom: -10 }}
                onChange={(_, v) => handleInputChange("opacity", ((v as number) / 100).toString())}
                slotProps={{ track: { style: value === 100 ? { borderRadius: 10 } : undefined }, thumb: { style: thumbStyle() } }}
            />
        </Section>
    );
}
