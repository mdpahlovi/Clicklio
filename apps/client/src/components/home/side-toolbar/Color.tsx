type Props = {
    attribute: string;
    placeholder: string;
    attributeType: string;
    inputRef: React.RefObject<HTMLInputElement>;
    handleInputChange: (property: string, value: string) => void;
};

const Color = ({ inputRef, attribute, placeholder, attributeType, handleInputChange }: Props) => (
    <div className="flex flex-col gap-2.5 border-b p-4">
        <p className="text-sm">{placeholder}</p>
        <div
            className="bg-background flex h-8 items-center gap-2 border"
            onClick={() => (inputRef?.current ? inputRef.current.click() : undefined)}
        >
            <input
                type="color"
                className="h-8"
                value={attribute}
                ref={inputRef}
                onChange={(e) => handleInputChange(attributeType, e.target.value)}
            />
            <div className="flex-1 text-sm">{attribute}</div>
            <div className="flex items-center justify-center px-2 text-sm">100%</div>
        </div>
    </div>
);

export default Color;
