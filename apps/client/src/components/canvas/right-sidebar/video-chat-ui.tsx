import Video from "@/components/ui/video";
import { useChatState } from "@/hooks/useChatState";
import { handleNavigatorError } from "@/utils/error-handle";
import { Button, Stack, TabPanel } from "@mui/joy";

export default function VideoChatUI({ room }: { room: string }) {
    console.log({ room });

    const { isCallActive, toggleCal, setCurrentMedia } = useChatState();

    return (
        <TabPanel value={0} sx={{ p: 1.25, overflowY: "auto", display: "flex" }}>
            {isCallActive ? (
                <Stack width="100%" spacing={1.25}>
                    <Video withControl />
                </Stack>
            ) : (
                <Stack width="100%" sx={{ justifyContent: "center" }}>
                    <Button
                        onClick={() => {
                            navigator.mediaDevices
                                .getUserMedia({ audio: true, video: true })
                                .then((stream) => {
                                    setCurrentMedia(stream);
                                    toggleCal();
                                })
                                .catch((error) => handleNavigatorError(error));
                        }}
                        fullWidth
                    >
                        Start Video Chat
                    </Button>
                </Stack>
            )}
        </TabPanel>
    );
}
