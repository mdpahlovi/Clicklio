import { Form, FormInput } from "@/components/form";
import { useAuthState } from "@/hooks/useAuthState";
import AuthLayout from "@/layout/auth";
import { Button, Checkbox, Divider, Link, Stack, Typography } from "@mui/joy";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { RiGoogleLine } from "react-icons/ri";
import { Link as RLink, useNavigate } from "react-router-dom";
import * as yup from "yup";

import { type Credentials } from "@/hooks/useAuthState";

const signinSchema = yup.object().shape({
    email: yup.string().required("Please provide your email.").email("Please provide a valid email."),
    password: yup
        .string()
        .required("Please provide your password.")
        .min(6, "Password must be at least 6 characters.")
        .max(40, "Password must not exceed 40 characters."),
});

export default function JoySignInSideTemplate() {
    const navigate = useNavigate();
    const { user, signinLoading, socialLoading, error, signin, googleSignin } = useAuthState();

    useEffect(() => {
        if (user && user?.id) navigate("/rooms");
    }, [user]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    return (
        <AuthLayout>
            <Stack sx={{ mb: 1.5, gap: 1 }}>
                <Typography component="h1" level="h3">
                    Sign in
                </Typography>
                <Typography level="body-sm">
                    Don't have any account?{" "}
                    <Link component={RLink} to="/signup" level="title-sm">
                        Sign up
                    </Link>
                </Typography>
            </Stack>
            <Button variant="soft" color="neutral" startDecorator={<RiGoogleLine />} onClick={googleSignin} loading={socialLoading}>
                Continue with Google
            </Button>
            <Divider sx={{ mt: 2, mb: 1 }}>OR</Divider>
            <Form
                defaultValues={{ email: "", password: "" }}
                validationSchema={signinSchema}
                onSubmit={(data) => signin(data as Credentials)}
            >
                <FormInput type="email" name="email" label="Email" />
                <FormInput type="password" name="password" label="Password" />
                <Stack gap={3.5} sx={{ mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Checkbox size="sm" label="Remember me" name="persistent" />
                        <Link component={RLink} level="title-sm" to="/signin">
                            Forgot your password?
                        </Link>
                    </Stack>
                    <Button type="submit" loading={signinLoading}>
                        Sign in
                    </Button>
                </Stack>
            </Form>
        </AuthLayout>
    );
}
