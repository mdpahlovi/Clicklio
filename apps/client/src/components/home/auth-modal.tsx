import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { useRoomState } from "@/hooks/useRoomState";

import { FaPlus } from "react-icons/fa6";
import { Button, Input, Modal, ModalClose, Sheet, Typography } from "@mui/joy";

export default function AuthModal() {
    const [searchParams] = useSearchParams();
    const { user, setUser } = useAuthState();
    const { authModal, toggleAuthModal } = useRoomState();

    useEffect(() => {
        if (searchParams.get("room") && !user?.id) toggleAuthModal();
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // @ts-ignore
        const formData = new FormData(event.target);
        const formProps = Object.fromEntries(formData);

        // @ts-ignore
        setUser({ ...formProps });
        toggleAuthModal();
    };

    return (
        <Modal open={authModal} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Sheet sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}>
                <ModalClose variant="plain" sx={{ m: 1 }} />
                <Typography component="h2" fontWeight="lg" mb={1}>
                    Join Room
                </Typography>

                <Typography textColor="text.tertiary" mb={1.75}>
                    Please input your name to join room. Don't worry, the session is end-to-end encrypted, and fully private. Not even our
                    server can see what you draw.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Input name="name" placeholder="Your Name" sx={{ mb: 2 }} required />
                    <Button type="submit" startDecorator={<FaPlus size={18} />}>
                        Join Room
                    </Button>
                </form>
            </Sheet>
        </Modal>
    );
}
