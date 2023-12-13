import Form from "@/components/form";
import FormInput from "@/components/form/FormInput";
import FormGenerateCode from "@/components/form/FormGenerateCode";
import * as yup from "yup";
import FormSubmit from "@/components/form/FormSubmit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const createRoomSchema = yup.object().shape({
    name: yup.string().required("Room name is required"),
    code: yup.string().required("Room code is required").min(24, "Room code must be 24 characters"),
});

export default function Login() {
    return (
        <section className="my-0 h-screen flex justify-center items-center">
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Create Room</CardTitle>
                    <CardDescription>Input username and generate room code for create room</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form
                        initialValues={{ name: "", code: "" }}
                        validationSchema={createRoomSchema}
                        onSubmit={(value) => console.log(value)}
                    >
                        <FormInput name="name" placeholder="Enter Room Name" label="Room Name" />
                        <FormGenerateCode name="code" placeholder="Generate Room Code" label="Room Code" />
                        <FormSubmit>Create Room</FormSubmit>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
