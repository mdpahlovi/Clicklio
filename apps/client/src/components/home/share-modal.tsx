import Modal from "@/components/ui/modal";
import { useRoomUserStore, type RoomUser } from "@/stores/useRoomUserStore";
import { socket } from "@/utils/socket";
import { Button, Divider, Input, Stack, Typography } from "@mui/joy";
import { FaPlay, FaRegCopy, FaStop } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuid } from "uuid";

export default function ShareModal({ roomRef }: { roomRef: React.RefObject<string | null> }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { shareModal, currUser, setShareModal, setCurUser } = useRoomUserStore();

    const room = searchParams.get("room");

    const debounceUpdate = useDebouncedCallback((user: RoomUser) => {
        setCurUser(user);
        socket.emit("update:user", { room, user });
    }, 500);

    return (
        <Modal open={shareModal} onClose={() => setShareModal(false)} title="Live collaboration">
            {room && currUser ? (
                <>
                    <Input
                        placeholder="Type Your Name!..."
                        sx={{ mt: 1.75, mb: 1.5 }}
                        value={currUser?.name}
                        onChange={(e) => debounceUpdate({ ...currUser, name: e.target.value })}
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
                                // Leave room
                                setShareModal(false);
                                socket.emit("leave:room", { room });

                                // Remove room from url
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
                                // Create and join room
                                const room = uuid();
                                roomRef.current = room;
                                setSearchParams({ room });
                                socket.emit("join:room", { room, user: { role: "ADMIN" } });
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
