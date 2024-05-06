import { useCanvasState } from "@/hooks/useCanvasState";
import type { Attributes } from "@/types";

type Property = "top" | "left" | "width" | "height";
const dimensionsOptions: { label: string; property: Property; placeholder: string }[] = [
    { label: "X", property: "top", placeholder: "Top" },
    { label: "Y", property: "left", placeholder: "Left" },
    { label: "W", property: "width", placeholder: "Width" },
    { label: "H", property: "height", placeholder: "Height" },
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
            {dimensionsOptions.map(({ label, property, placeholder }) => (
                <label key={label} htmlFor={property} className="bg-background flex items-center">
                    <span className="flex size-8 items-center justify-center text-sm">{label}</span>
                    <input
                        type="number"
                        id={property}
                        placeholder={placeholder}
                        onBlur={() => (isEditingRef.current = false)}
                        value={attributes ? attributes[property] : ""}
                        onChange={(e) => handleInputChange(property, e.target.value)}
                        className="bg-background placeholder:text-content-lighter h-8 w-full text-sm focus:outline-none"
                    />
                </label>
            ))}
        </div>
    );
}
