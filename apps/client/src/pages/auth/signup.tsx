import AuthLayout from "@/layout/auth";
import { Link as RLink } from "react-router-dom";
import { Form, FormInput } from "@/components/form";
import { Button, Checkbox, Typography, Stack, Link } from "@mui/joy";

export default function SignupPage() {
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
            <Form onSubmit={(value) => console.log(value)}>
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
