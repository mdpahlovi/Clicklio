import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form";

type FormProps = { defaultValues?: Record<string, string>; validationSchema?: any; onSubmit: SubmitHandler<FieldValues> };

export default function Form({ onSubmit, children, defaultValues, validationSchema }: FormProps & React.PropsWithChildren) {
    const resolver = validationSchema ? yupResolver(validationSchema) : undefined;
    const methods = useForm({ defaultValues, resolver });

    const submit: SubmitHandler<FieldValues> = (data) => onSubmit(data);

    return (
        <FormProvider {...methods}>
            <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={methods.handleSubmit(submit)}>
                {children}
            </form>
        </FormProvider>
    );
}
