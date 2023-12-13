import { useState } from "react";
import { useField } from "formik";
import { FromInputProps } from "@/types/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "../ui/label";

const FormInput = ({ type = "text", name, label, placeholder, textarea, disabled }: FromInputProps) => {
    const [field, meta] = useField(name);
    const [show, setShow] = useState(false);
    const config = { id: name, ...field, placeholder, disabled };

    return (
        <div className="relative">
            <Label htmlFor={name} className="block mb-2">
                {label}
            </Label>
            {textarea ? (
                <Textarea {...config} />
            ) : type === "password" ? (
                <>
                    <Input type={show ? "text" : "password"} {...config} />
                    <button className="absolute top-8 right-2.5 text-input" onClick={() => setShow(!show)}>
                        {show ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </>
            ) : (
                <Input type={type} {...config} />
            )}
            {meta && meta.touched && meta.error ? <p className="mt-0.5 ml-1.5 text-sm text-destructive">{meta.error}</p> : ""}
        </div>
    );
};

export default FormInput;
