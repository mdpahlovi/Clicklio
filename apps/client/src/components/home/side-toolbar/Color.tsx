import { Label } from "@/components/ui/label";

type Props = {
    attribute: string;
    placeholder: string;
    attributeType: string;
    inputRef: React.RefObject<HTMLInputElement>;
    handleInputChange: (property: string, value: string) => void;
};

const Color = ({ inputRef, attribute, placeholder, attributeType, handleInputChange }: Props) => (
    <div className="border-primary-grey-200 flex flex-col gap-3 border-b p-5">
        <h3 className="text-[10px] uppercase">{placeholder}</h3>
        <div
            className="border-primary-grey-200 flex items-center gap-2 border"
            onClick={() => (inputRef?.current ? inputRef.current.click() : undefined)}
        >
            <input type="color" value={attribute} ref={inputRef} onChange={(e) => handleInputChange(attributeType, e.target.value)} />
            <Label className="flex-1">{attribute}</Label>
            <Label className="bg-primary-grey-100 flex h-6 w-8 items-center justify-center text-[10px] leading-3">90%</Label>
        </div>
    </div>
);

export default Color;
