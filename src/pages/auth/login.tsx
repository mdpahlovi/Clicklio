import Form from "@/components/form";
import FormInput from "@/components/form/FormInput";
import FormGenerateCode from "@/components/form/FormGenerateCode";
import FormSubmit from "@/components/form/FormSubmit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
    return (
        <section className="my-0 h-screen flex justify-center items-center">
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Create Room</CardTitle>
                    <CardDescription>Input username and generate room code for create room</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form initialValues={{ user: "", code: "" }} onSubmit={(value) => console.log(value)}>
                        <FormInput name="user" placeholder="Enter User Name" label="User" />
                        <FormGenerateCode name="code" placeholder="Generate Room Code" label="Room Code" />
                        <FormSubmit>Create Room</FormSubmit>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
