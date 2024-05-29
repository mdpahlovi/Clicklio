import { useId } from "react";
import toast from "react-hot-toast";
import { db } from "@/utils/firebase";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Box } from "@mui/joy";
import { useAuthState } from "@/hooks/useAuthState";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function NewFile() {
    const id = useId();
    const navigator = useNavigate();
    const { user } = useAuthState();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user || !user?.id) return;
        // @ts-ignore
        const formData = new FormData(event.target);
        const formProps = Object.fromEntries(formData);

        const room = { name: formProps.name as string, user: user?.id, shapes: [], updatedAt: Timestamp.now() };
        addDoc(collection(db, "shapes"), room)
            .then((value) => navigator(`/room/${value.id}`))
            .catch(() => toast.error("Failed To Create Room"));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gridTemplateRows: "1fr 47px", gap: 1.5 }}>
            <Card component="label" htmlFor={id} sx={{ justifyContent: "center", alignItems: "center" }}>
                <MdAdd size={64} style={{ padding: "24px 0" }} />
            </Card>
            <Input
                id={id}
                required
                size="sm"
                name="name"
                placeholder="File Name"
                sx={{ "--Input-decoratorChildHeight": "45px" }}
                endDecorator={
                    <Button type="submit" size="sm" sx={{ borderRadius: "0 6px 6px 0" }}>
                        New File
                    </Button>
                }
            />
        </Box>
    );
}
