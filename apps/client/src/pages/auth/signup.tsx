import * as yup from "yup";
import AuthLayout from "@/layout/auth";
import { FieldValues } from "react-hook-form";
import { Link as RLink } from "react-router-dom";
import { Form, FormInput } from "@/components/form";
import { Button, Checkbox, Typography, Stack, Link } from "@mui/joy";

const signupSchema = yup.object().shape({
    name: yup.string().required("Please provide your name"),
    email: yup.string().required("Please provide your email").email("Email is invalid"),
    password: yup
        .string()
        .required("Please provide your password")
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must not exceed 40 characters"),
    c_password: yup
        .string()
        .required("Please retype your password.")
        .oneOf([yup.ref("password")], "Your passwords do not match."),
});

export default function SignupPage() {
    const onSubmit = (data: FieldValues) => {
        console.log(data);
    };

    return (
        <AuthLayout>
            <Stack sx={{ mb: 0.5, gap: 1 }}>
                <Typography component="h1" level="h3">
                    Sign up
                </Typography>
                <Typography level="body-sm">
                    Already have an account?{" "}
                    <Link component={RLink} to="/signin" level="title-sm">
                        Sign in
                    </Link>
                </Typography>
            </Stack>
            <Form defaultValues={{ name: "", email: "", password: "", c_password: "" }} validationSchema={signupSchema} onSubmit={onSubmit}>
                <FormInput name="name" label="Name" />
                <FormInput type="email" name="email" label="Email" />
                <FormInput type="password" name="password" label="Password" />
                <FormInput type="password" name="c_password" label="Confirm Password" />
                <Stack gap={4} sx={{ mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Checkbox size="sm" label="Remember me" name="persistent" />
                        <Link component={RLink} level="title-sm" to="/signin">
                            Forgot your password?
                        </Link>
                    </Stack>
                    <Button type="submit" fullWidth>
                        Sign in
                    </Button>
                </Stack>
            </Form>
        </AuthLayout>
    );
}
