import { Form, FormInput } from "@/components/form";
import AuthLayout from "@/layout/auth";
import { useAuthState } from "@/stores/auth/useAuthStore";
import { Button, Link, Stack, Typography } from "@mui/joy";
import { useEffect } from "react";
import { Link as RLink, useNavigate } from "react-router-dom";
import * as yup from "yup";

import type { Credentials } from "@/stores/auth/useAuthStore";

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
    const navigate = useNavigate();
    const { user, signupLoading, signup } = useAuthState();

    useEffect(() => {
        if (user && user?.id) navigate("/rooms");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

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
            <Form
                defaultValues={{ name: "", email: "", password: "", c_password: "" }}
                validationSchema={signupSchema}
                onSubmit={(data) => signup(data as { name: string } & Credentials)}
            >
                <FormInput name="name" label="Name" />
                <FormInput type="email" name="email" label="Email" />
                <FormInput type="password" name="password" label="Password" />
                <FormInput type="password" name="c_password" label="Confirm Password" />
                <Stack gap={4} sx={{ mt: 2 }}>
                    <Button type="submit" loading={signupLoading} fullWidth>
                        Sign up
                    </Button>
                </Stack>
            </Form>
        </AuthLayout>
    );
}
