import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useCanvasStore, { Tool } from "@/hooks/useCanvasStore";
import { capitalizeFirstWord } from "@/lib/capitalizeFirstWord";

const stokeTypes = ["pencil", "line", "rectangle", "ellipse"];

export default function TopBar({ clearCanvas }: { clearCanvas: () => void }) {
    const { stroke, tool, setStroke, setTool } = useCanvasStore();

    return (
        <div className="border rounded-lg p-6 flex justify-between items-center">
            <input
                type="color"
                defaultValue={stroke}
                onChange={(e) => setStroke(e.target.value)}
                className="border rounded-lg p-0.5 py-[1px]"
            />
            <RadioGroup defaultValue={tool} onValueChange={(value: Tool) => setTool(value)} className="flex">
                {stokeTypes.map((type, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={idx.toString()} />
                        <Label htmlFor={idx.toString()}>{capitalizeFirstWord(type)}</Label>
                    </div>
                ))}
            </RadioGroup>
            <Button variant="destructive" size="sm" onClick={clearCanvas}>
                Clear Canvas
            </Button>
        </div>
    );
}
