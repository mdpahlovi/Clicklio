import { useAuthState } from "@/hooks/useAuthState";
import { db } from "@/utils/firebase";
import { Box, Button, Card, Input } from "@mui/joy";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useId } from "react";
import toast from "react-hot-toast";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function NewFile() {
    const id = useId();
    const { user } = useAuthState();
    const navigator = useNavigate();

    // Add New File Actions
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user || !user?.id) return;

        const name = new FormData(event.currentTarget).get("name");
        addDoc(collection(db, "shapes"), { name, user: user?.id, shapes: [], updatedAt: Timestamp.now() })
            .then((value) => navigator(`/room/${value.id}`))
            .catch(() => toast.error("Failed To Create Room"));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gridTemplateRows: "1fr 47px", gap: 1.5 }}>
            <Card component="label" htmlFor={id} className="newFileCard">
                <MdAdd size={64} style={{ padding: "24px 0" }} />
            </Card>
            <Input
                id={id}
                required
                name="name"
                placeholder="File Name"
                sx={{ "--Input-decoratorChildHeight": "45px" }}
                endDecorator={<Button type="submit">New File</Button>}
            />
        </Box>
    );
}
