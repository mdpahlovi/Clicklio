import { Section } from "@/components/home/side-toolbar/components";
import { useCanvasState } from "@/hooks/useCanvasState";
import type { Attributes } from "@/types";
import { Typography } from "@mui/joy";

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
        <Section title={placeholder}>
            <div
                style={{
                    backgroundColor: "#F3F4F6", // bg-background
                    display: "flex",
                    height: "2rem", // h-8
                    alignItems: "center", // items-center
                    gap: "0.5rem", // gap-2
                }}
                onClick={() => (inputRef?.current ? inputRef.current.click() : undefined)}
            >
                <input
                    type="color"
                    ref={inputRef}
                    style={{ height: "2rem" }}
                    value={value || ""}
                    onChange={(e) => handleInputChange(attribute, e.target.value)}
                />
                <Typography sx={!value ? { color: "hsl(251, 17%, 55%)" } : undefined}>{value || "No Color"}</Typography>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.875rem",
                    }}
                >
                    100%
                </div>
            </div>
        </Section>
    );
}
