import { useRoomState } from "@/hooks/useRoomState";
import { socket } from "@/utils/socket";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Modal from "@/components/ui/modal";
import { Button, Divider, Input, Stack, Typography } from "@mui/joy";
import { FaPlay, FaRegCopy, FaStop } from "react-icons/fa6";

export default function ShareModal({ roomRef }: { roomRef: React.RefObject<string | null> }) {
    const [name, setName] = useState("");
    const { shareModal, toggleShareModal } = useRoomState();
    const [searchParams, setSearchParams] = useSearchParams();

    const room = searchParams.get("room");

    const removeRoomParam = () => {
        if (room) {
            socket.emit("leave:room", { room });
            roomRef.current = null;

            searchParams.delete("room");
            setSearchParams(searchParams);

            toggleShareModal();
        }
    };

    return (
        <Modal open={shareModal} onClose={toggleShareModal} title="Live collaboration">
            {room ? (
                <>
                    <Input value={window.location.href} sx={{ mb: 2, pointerEvents: "none" }} />
                    <Stack flexDirection="row" justifyContent="end" gap={2}>
                        <Button startDecorator={<FaStop size={18} />} color="danger" onClick={removeRoomParam}>
                            Stop Session
                        </Button>
                        <Button
                            startDecorator={<FaRegCopy size={18} />}
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                        >
                            Copy Link
                        </Button>
                    </Stack>
                    <Divider sx={{ mt: 2.75, mb: 1.75 }} />
                    <Typography textColor="text.tertiary">
                        Stopping the session will disconnect you from the room, but you'll be able to continue working with the scene,
                        locally. Note that this won't affect other people, and they'll still be able to collaborate on their version.
                    </Typography>
                </>
            ) : (
                <>
                    <Typography textColor="text.tertiary">
                        Invite People to Collaborate on Your Drawing! 🎨 Create something amazing together! Collaborate on a shared canvas
                        in real time. The session is public anyone by like can join the room.
                    </Typography>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        placeholder="Type Your Name!..."
                        sx={{ mt: 1.85, mb: 3 }}
                    />
                    <Button
                        onClick={() => {
                            const room = uuidv4();
                            roomRef.current = room;
                            setSearchParams({ room });
                            socket.emit("join:room", { room, name });
                        }}
                        startDecorator={<FaPlay size={18} />}
                    >
                        Start Session
                    </Button>
                </>
            )}
        </Modal>
    );
}
