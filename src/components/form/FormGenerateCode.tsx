import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useField, useFormikContext } from "formik";
import { FormGenerateCodeProps } from "@/types/form";

const FormGenerateCode = ({ name, label, placeholder, disabled }: FormGenerateCodeProps) => {
    const [field, meta] = useField(name);
    const { setFieldValue } = useFormikContext();
    const config = { id: name, ...field, placeholder, disabled };

    const generateObjectId = () => {
        const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
        const objectId =
            timestamp +
            "xxxxxxxxxxxxxxxx"
                .replace(/[x]/g, function () {
                    return ((Math.random() * 16) | 0).toString(16);
                })
                .toLowerCase();
        setFieldValue(name, objectId);
    };

    return (
        <div className="relative">
            <Label htmlFor={name} className="block mb-2">
                {label}
            </Label>
            <Input type="text" {...config} />
            <Button type="button" size="sm" variant="destructive" className="absolute top-6 right-0.5" onClick={generateObjectId}>
                Generate
            </Button>
            {meta && meta.touched && meta.error ? <p className="mt-0.5 ml-1.5 text-sm text-destructive">{meta.error}</p> : ""}
        </div>
    );
};

export default FormGenerateCode;
