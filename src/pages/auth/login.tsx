import Form from "@/components/form";
import FormInput from "@/components/form/FormInput";
import FormGenerateCode from "@/components/form/FormGenerateCode";
import * as yup from "yup";
import FormSubmit from "@/components/form/FormSubmit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const createCanvasSchema = yup.object().shape({
    name: yup.string().required("Canvas name is required"),
    code: yup.string().required("Canvas code is required").min(24, "Canvas code must be 24 characters"),
});

export default function Login() {
    return (
        <section className="my-0 h-screen flex justify-center items-center">
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Create Canvas</CardTitle>
                    <CardDescription>Input username and generate canvas code for create canvas</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form
                        initialValues={{ name: "", code: "" }}
                        validationSchema={createCanvasSchema}
                        onSubmit={(value) => console.log(value)}
                    >
                        <FormInput name="name" placeholder="Enter Canvas Name" label="Canvas Name" />
                        <FormGenerateCode name="code" placeholder="Generate Canvas Code" label="Canvas Code" />
                        <FormSubmit>Create Canvas</FormSubmit>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
