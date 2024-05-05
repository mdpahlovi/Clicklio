const dimensionsOptions = [
    { label: "X", property: "width" },
    { label: "Y", property: "height" },
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
    <div className="grid grid-cols-2 gap-2.5 p-4">
        <div className="col-span-full">
            <p className="text-sm">Dimensions</p>
        </div>
        {dimensionsOptions.map((item) => (
            <label key={item.label} htmlFor={item.property} className="bg-background flex items-center">
                <span className="flex size-8 items-center justify-center text-sm">{item.label}</span>
                <input
                    type="number"
                    id={item.property}
                    placeholder="100"
                    className="bg-background h-8 w-full text-sm focus:outline-none"
                    onBlur={() => (isEditingRef.current = false)}
                    value={item.property === "width" ? width : height}
                    onChange={(e) => handleInputChange(item.property, e.target.value)}
                />
            </label>
        ))}
    </div>
);

export default Dimensions;
