import { useCanvasState } from "@/hooks/useCanvasState";
import type { Attributes } from "@/types";

type Property = "top" | "left" | "width" | "height";
const dimensionsOptions: { label: string; property: Property }[] = [
    { label: "X", property: "top" },
    { label: "Y", property: "left" },
    { label: "W", property: "width" },
    { label: "H", property: "height" },
];

type DimensionsProps = {
    isEditingRef: React.MutableRefObject<boolean>;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export default function Dimensions({ isEditingRef, handleInputChange }: DimensionsProps) {
    const { attributes } = useCanvasState();

    return (
        <div className="grid grid-cols-2 gap-2.5 p-4">
            <div className="col-span-full">
                <p className="text-sm">Dimensions</p>
            </div>
            {dimensionsOptions.map(({ label, property }) => (
                <label key={label} htmlFor={property} className="bg-background flex items-center">
                    <span className="flex size-8 items-center justify-center text-sm">{label}</span>
                    <input
                        type="number"
                        id={property}
                        placeholder="100"
                        onBlur={() => (isEditingRef.current = false)}
                        value={attributes ? Number(attributes[property]).toFixed(2) : ""}
                        onChange={(e) => handleInputChange(property, e.target.value)}
                        className="bg-background h-8 w-full text-sm focus:outline-none"
                    />
                </label>
            ))}
        </div>
    );
}
