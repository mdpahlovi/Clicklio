import { TabPanel } from "@mui/joy";

// eslint-disable-next-line no-empty-pattern
export default function VideoChatUI({}: { room: string }) {
    return (
        <TabPanel value={0} sx={{ p: 1.25, overflowY: "auto", display: "flex" }}>
            {/* {true ? (
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
            )} */}
        </TabPanel>
    );
}
