import { useCanvasState } from "@/hooks/useCanvasState";
import type { Attributes } from "@/types";

type ColorProps = {
    placeholder: string;
    attribute: "fill" | "stroke";
    inputRef: React.RefObject<HTMLInputElement>;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export default function Color({ inputRef, placeholder, attribute, handleInputChange }: ColorProps) {
    const { attributes } = useCanvasState();
    const value = attributes && attributes[attribute];

    return (
        <div className="flex flex-col gap-2.5 p-4">
            <p className="text-sm">{placeholder}</p>
            <div
                className="bg-background flex h-8 items-center gap-2"
                onClick={() => (inputRef?.current ? inputRef.current.click() : undefined)}
            >
                <input
                    type="color"
                    ref={inputRef}
                    className="h-8"
                    value={value || ""}
                    onChange={(e) => handleInputChange(attribute, e.target.value)}
                />
                <div style={!value ? { color: "hsl(251, 17%, 55%)" } : undefined} className="flex-1 text-sm">
                    {value || "No Color"}
                </div>
                <div className="flex items-center justify-center px-2 text-sm">100%</div>
            </div>
        </div>
    );
}
