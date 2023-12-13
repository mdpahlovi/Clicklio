import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useField, useFormikContext } from "formik";
import { FormGenerateCodeProps } from "@/types/form";

const FormGenerateCode = ({ name, label, placeholder, disabled }: FormGenerateCodeProps) => {
    const [field, meta] = useField(name);
    const { setFieldValue } = useFormikContext();
    const config = { id: name, ...field, placeholder, disabled };

    return (
        <div className="relative">
            <Label htmlFor={name} className="block mb-2">
                {label}
            </Label>
            <Input type="text" {...config} />
            <Button variant="destructive" size="sm" className="absolute top-6 right-0.5">
                Generate
            </Button>
            {meta && meta.touched && meta.error ? <p className="mt-0.5 ml-1.5 text-sm text-destructive">{meta.error}</p> : ""}
        </div>
    );
};

export default FormGenerateCode;
