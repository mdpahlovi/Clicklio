import { useAuthState } from "@/stores/auth/useAuthStore";
import { Box, Button, Card, Input } from "@mui/joy";
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
        navigator(`/rooms`);
        toast.success(`Create File ${name}`);
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
