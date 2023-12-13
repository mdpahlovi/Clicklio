/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikHelpers } from "formik";
import { HTMLInputTypeAttribute } from "react";

export interface FormProps extends React.PropsWithChildren {
    initialValues: any;
    validationSchema?: any;
    onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void | Promise<any>;
}

export interface FormInputProps {
    type?: HTMLInputTypeAttribute;
    name: string;
    label: string;
    placeholder?: string;
    textarea?: boolean;
    disabled?: boolean;
}

export interface FormGenerateCodeProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
}
