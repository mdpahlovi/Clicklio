import { CopyIcon, PlayFillIcon, SquareFillIcon } from "@/components/icons";
import Modal from "@/components/ui/modal";
import { useEventStore } from "@/stores/canvas/useEventStore";
import { useUserStore, type RoomUser } from "@/stores/room/useUserStore";
import { socket } from "@/utils/socket";
import { Button, Divider, Input, Stack, Typography } from "@mui/joy";
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuid } from "uuid";

type ShareModalProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ShareModal({ isOpen, setIsOpen }: ShareModalProps) {
    const { events } = useEventStore();
    const { currUser, createCurrUser, updateCurrUser, deleteCurrUser } = useUserStore();

    const [searchParams, setSearchParams] = useSearchParams();
    const room = searchParams.get("room");

    const debounceUpdate = useDebouncedCallback((user: RoomUser) => {
        updateCurrUser(user);
        socket.emit("update:user", { room, user });
    }, 500);

    return (
        <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Live collaboration">
            {room && currUser ? (
                <>
                    <Input
                        placeholder="Type Your Name!..."
                        sx={{ mt: 1.75, mb: 1.5 }}
                        defaultValue={currUser?.name}
                        onChange={(e) => debounceUpdate({ ...currUser, name: e.target.value })}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Stack flexDirection="row" gap={1.5}>
                        <Input value={window.location.href} sx={{ width: "100%", pointerEvents: "none" }} />
                        <Button
                            startDecorator={<CopyIcon />}
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
                            startDecorator={<SquareFillIcon />}
                            color="danger"
                            onClick={() => {
                                // Leave room
                                setIsOpen(false);
                                deleteCurrUser();
                                socket.emit("leave:room", { room });

                                // Leave room in url
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

                                if (socket.connected) {
                                    // Set room in url
                                    setSearchParams({ room });

                                    // Set current user
                                    const user = createCurrUser(room, "ADMIN");
                                    socket.emit("join:room", { room, user, events });
                                }
                            }}
                            startDecorator={<PlayFillIcon />}
                        >
                            Start Session
                        </Button>
                    </Stack>
                </>
            )}
        </Modal>
    );
}
