import { useCanvasState } from "@/hooks/useCanvasState";
import type { Attributes } from "@/types";

type Props = {
    placeholder: string;
    attributeType: "fill" | "stroke";
    inputRef: React.RefObject<HTMLInputElement>;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export default function Color({ inputRef, placeholder, attributeType, handleInputChange }: Props) {
    const { attributes } = useCanvasState();

    return (
        <div className="flex flex-col gap-2.5 border-b p-4">
            <p className="text-sm">{placeholder}</p>
            <div
                className="bg-background flex h-8 items-center gap-2 border"
                onClick={() => (inputRef?.current ? inputRef.current.click() : undefined)}
            >
                <input
                    type="color"
                    ref={inputRef}
                    className="h-8"
                    value={attributes ? attributes[attributeType] : ""}
                    onChange={(e) => handleInputChange(attributeType, e.target.value)}
                />
                <div className="flex-1 text-sm">{attributes ? attributes[attributeType] : "No Color"}</div>
                <div className="flex items-center justify-center px-2 text-sm">100%</div>
            </div>
        </div>
    );
}
