import { Form, FormInput } from "@/components/form";
import { GoogleIcon } from "@/components/icons";
import AuthLayout from "@/layout/auth";
import { useAuthState, type Credentials } from "@/stores/auth/useAuthStore";
import { Button, Divider, Link, Stack, Typography } from "@mui/joy";
import { useEffect } from "react";
import { Link as RLink, useNavigate } from "react-router-dom";
import * as yup from "yup";

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
    const { user, signinLoading, signin, oAuthSigninLoading, oAuthSignin } = useAuthState();

    useEffect(() => {
        if (user && user?.id) navigate("/rooms");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <AuthLayout>
            <Stack sx={{ mb: 2.5, gap: 0.5 }}>
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
            <Button variant="soft" color="neutral" startDecorator={<GoogleIcon />} onClick={oAuthSignin} loading={oAuthSigninLoading}>
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
                <Stack gap={2} sx={{ mt: 0.5 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <div />
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
