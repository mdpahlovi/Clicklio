import { v4 as uuidv4 } from "uuid";
import { socket } from "@/utils/socket";
import { useSearchParams } from "react-router-dom";
import { useRoomState } from "@/hooks/useRoomState";

import { FaRegCopy, FaStop, FaPlay } from "react-icons/fa6";
import { Button, Divider, Input, Modal, ModalClose, Sheet, Stack, Typography } from "@mui/joy";

export default function ShareModal({ roomRef }: { roomRef: React.MutableRefObject<string | null> }) {
    const { shareModal, toggleShareModal } = useRoomState();
    const [searchParams, setSearchParams] = useSearchParams();

    const removeRoomParam = () => {
        const room = searchParams.get("room");

        if (room) {
            socket.emit("leave:room", { room });
            roomRef.current = null;

            searchParams.delete("room");
            setSearchParams(searchParams);

            toggleShareModal();
        }
    };

    return (
        <Modal open={shareModal} onClose={toggleShareModal}>
            <Sheet sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}>
                <ModalClose variant="plain" sx={{ m: 1 }} />
                <Typography component="h2" fontWeight="lg" mb={1}>
                    Live collaboration
                </Typography>
                {searchParams.get("room") ? (
                    <>
                        <Input
                            readOnly
                            name="name"
                            placeholder="Your Name"
                            sx={{ mb: 2 }}
                            value={`https://clicklio.vercel.app/?room=${searchParams.get("room")}`}
                        />
                        <Stack flexDirection="row" justifyContent="end" gap={2}>
                            <Button startDecorator={<FaStop size={18} />} color="danger" onClick={removeRoomParam}>
                                Stop Session
                            </Button>
                            <Button
                                startDecorator={<FaRegCopy size={18} />}
                                onClick={() =>
                                    navigator.clipboard.writeText(`https://clicklio.vercel.app/?room=${searchParams.get("room")}`)
                                }
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
                        <Typography textColor="text.tertiary" mb={1.75}>
                            Invite people to collaborate on your drawing. Don't worry, the session is end-to-end encrypted, and fully
                            private. Not even our server can see what you draw.
                        </Typography>
                        <Button
                            onClick={() => {
                                const room = uuidv4();
                                roomRef.current = room;
                                setSearchParams({ room });
                                socket.emit("join:room", { room });
                            }}
                            startDecorator={<FaPlay size={18} />}
                        >
                            Start Session
                        </Button>
                    </>
                )}
            </Sheet>
        </Modal>
    );
}
