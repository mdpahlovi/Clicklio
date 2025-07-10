import Modal from "@/components/ui/modal";
import { useRoomState } from "@/hooks/zustand/useRoomState";
import { socket } from "@/utils/socket";
import { Button, Divider, Input, Stack, Typography } from "@mui/joy";
import { useRef } from "react";
import { FaPlay, FaRegCopy, FaStop } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

export default function ShareModal({ roomRef }: { roomRef: React.RefObject<string | null> }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { name, shareModal, setName, toggleShareModal } = useRoomState();

    const room = searchParams.get("room");

    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    return (
        <Modal open={shareModal} onClose={toggleShareModal} title="Live collaboration">
            {room ? (
                <>
                    <Input
                        placeholder="Type Your Name!..."
                        sx={{ mt: 1.75, mb: 1.5 }}
                        value={name}
                        onChange={({ target: { value: name } }) => {
                            setName(name);
                            if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
                            updateTimeoutRef.current = setTimeout(() => socket.emit("update:name", { room, name }), 1000);
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Stack flexDirection="row" gap={1.5}>
                        <Input value={window.location.href} sx={{ width: "100%", pointerEvents: "none" }} />
                        <Button
                            startDecorator={<FaRegCopy size={18} />}
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Copy Link
                        </Button>
                    </Stack>
                    <Divider sx={{ mt: 2.75, mb: 1.75 }} />
                    <Typography level="body-sm">
                        Stopping the session will disconnect you from the room, but you'll be able to continue working with the scene,
                        locally. Note that this won't affect other people, and they'll still be able to collaborate on their version.
                    </Typography>
                    <Stack mt={1.75} flexDirection="row" justifyContent="center">
                        <Button
                            startDecorator={<FaStop size={18} />}
                            color="danger"
                            onClick={() => {
                                toggleShareModal();
                                socket.emit("leave:room", { room });
                                roomRef.current = null;
                                searchParams.delete("room");
                                setSearchParams(searchParams);
                            }}
                        >
                            Stop Session
                        </Button>
                    </Stack>
                </>
            ) : (
                <>
                    <Typography level="body-sm">
                        Invite People to Collaborate on Your Drawing! 🎨 Create something amazing together! Collaborate on a shared canvas
                        in real time. The session is public anyone by like can join the room.
                    </Typography>
                    <Stack mt={1.75} flexDirection="row" justifyContent="center">
                        <Button
                            onClick={() => {
                                const room = uuid();
                                roomRef.current = room;
                                setSearchParams({ room });
                                socket.emit("join:room", { room });
                            }}
                            startDecorator={<FaPlay size={18} />}
                        >
                            Start Session
                        </Button>
                    </Stack>
                </>
            )}
        </Modal>
    );
}
