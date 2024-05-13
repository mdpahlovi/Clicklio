import AuthLayout from "@/layout/auth";
import { FaGoogle } from "react-icons/fa";
import { Link as RLink } from "react-router-dom";
import { Form, FormInput } from "@/components/form";
import { Button, Checkbox, Divider, Typography, Stack, Link } from "@mui/joy";

export default function JoySignInSideTemplate() {
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
            <Button variant="soft" color="neutral" fullWidth startDecorator={<FaGoogle />}>
                Continue with Google
            </Button>
            <Divider sx={{ mt: 2, mb: 1 }}>OR</Divider>
            <Form onSubmit={(value) => console.log(value)}>
                <FormInput type="email" name="email" label="Email" />
                <FormInput type="password" name="password" label="Password" />
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
