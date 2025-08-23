import { yupResolver } from "@hookform/resolvers/yup";
import { type FieldValues, FormProvider, type SubmitHandler, useForm } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormProps = { defaultValues: Record<string, string> | null; validationSchema?: any; onSubmit: SubmitHandler<FieldValues> };

export default function Form({ onSubmit, children, defaultValues, validationSchema }: FormProps & React.PropsWithChildren) {
    const resolver = validationSchema ? yupResolver(validationSchema) : undefined;
    const methods = useForm({ defaultValues: defaultValues || {}, resolver });

    const submit: SubmitHandler<FieldValues> = (data) => onSubmit(data);

    return (
        <FormProvider {...methods}>
            <form style={{ display: "flex", flexDirection: "column", gap: 12 }} onSubmit={methods.handleSubmit(submit)}>
                {children}
            </form>
        </FormProvider>
    );
}
