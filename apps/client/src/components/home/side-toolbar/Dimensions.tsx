import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const dimensionsOptions = [
    { label: "W", property: "width" },
    { label: "H", property: "height" },
];

type Props = {
    width: number;
    height: number;
    isEditingRef: React.MutableRefObject<boolean>;
    handleInputChange: (property: string, value: string) => void;
};

const Dimensions = ({ width, height, isEditingRef, handleInputChange }: Props) => (
    <section className="border-primary-grey-200 flex flex-col border-b">
        <div className="flex flex-col gap-4 px-6 py-3">
            {dimensionsOptions.map((item) => (
                <div key={item.label} className="flex flex-1 items-center gap-3 rounded-sm">
                    <Label htmlFor={item.property} className="text-[10px] font-bold">
                        {item.label}
                    </Label>
                    <Input
                        type="number"
                        id={item.property}
                        placeholder="100"
                        value={item.property === "width" ? width : height}
                        className="input-ring"
                        min={10}
                        onBlur={() => (isEditingRef.current = false)}
                        onChange={(e) => handleInputChange(item.property, e.target.value)}
                    />
                </div>
            ))}
        </div>
    </section>
);

export default Dimensions;
