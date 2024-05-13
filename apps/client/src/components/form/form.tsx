import { ReactNode } from "react";
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form";

type FormConfig = { defaultValues?: Record<string, any>; resolver?: any };
type FormProps = { onSubmit: SubmitHandler<FieldValues>; children: ReactNode } & FormConfig;

export default function Form({ onSubmit, children, defaultValues, resolver }: FormProps) {
    const formConfig: FormConfig = {};

    if (resolver) formConfig["resolver"] = resolver;
    if (defaultValues) formConfig["defaultValues"] = defaultValues;

    const methods = useForm(formConfig);

    const submit: SubmitHandler<FieldValues> = (data) => {
        onSubmit(data);
        methods.reset();
    };

    return (
        <FormProvider {...methods}>
            <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={methods.handleSubmit(submit)}>
                {children}
            </form>
        </FormProvider>
    );
}
