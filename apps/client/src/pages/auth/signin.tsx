import * as yup from "yup";
import { useEffect } from "react";
import toast from "react-hot-toast";
import AuthLayout from "@/layout/auth";
import { RiGoogleLine } from "react-icons/ri";
import { Link as RLink } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { Form, FormInput } from "@/components/form";
import { Button, Checkbox, Divider, Typography, Stack, Link } from "@mui/joy";

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
    const { signin, loading, error, setError } = useAuthState();

    useEffect(() => {
        if (error) {
            toast.error(error);
            setTimeout(() => setError(null), 1500);
        }
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
            <Button variant="soft" color="neutral" fullWidth startDecorator={<RiGoogleLine />}>
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
                <Stack gap={4} sx={{ mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Checkbox size="sm" label="Remember me" name="persistent" />
                        <Link component={RLink} level="title-sm" to="/signin">
                            Forgot your password?
                        </Link>
                    </Stack>
                    <Button type="submit" {...{ loading }} fullWidth>
                        Sign in
                    </Button>
                </Stack>
            </Form>
        </AuthLayout>
    );
}
