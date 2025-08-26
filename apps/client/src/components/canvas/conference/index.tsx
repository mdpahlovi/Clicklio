import TextChatUI from "@/components/canvas/conference/text-chat-ui";
import VideoChatUI from "@/components/canvas/conference/video-chat-ui";
import { IconButton, Sheet, styled, Tab, TabList, Tabs } from "@mui/joy";
import type { Device } from "mediasoup-client";
import { useState } from "react";

export default function Conference({ room, device }: { room: string; device: Device }) {
    const [tab, setTab] = useState(0);
    const [isShow, setIsShow] = useState(true);

    return (
        <ConferenceContainer sx={{ transform: isShow ? "translateX(0)" : "translateX(calc(100% - 48px))" }}>
            <ButtonSheet onClick={() => setIsShow(!isShow)}>
                <IconButton>
                    {isShow ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path
                                d="M12.5 18C12.5 18 18.5 13.5811 18.5 12C18.5 10.4188 12.5 6 12.5 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M5.50005 18C5.50005 18 11.5 13.5811 11.5 12C11.5 10.4188 5.5 6 5.5 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path
                                d="M11.5 18C11.5 18 5.50001 13.5811 5.5 12C5.49999 10.4188 11.5 6 11.5 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M18.5 18C18.5 18 12.5 13.5811 12.5 12C12.5 10.4188 18.5 6 18.5 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    )}
                </IconButton>
            </ButtonSheet>
            <ConferenceSheet>
                <Tabs value={tab} onChange={(_, value) => setTab(value as number)} sx={{ width: 320 }}>
                    <TabList sx={{ position: "relative" }}>
                        <Tab variant="plain" color="neutral" sx={{ flexGrow: 1 }}>
                            Video Chat
                        </Tab>
                        <Tab variant="plain" color="neutral" sx={{ flexGrow: 1 }}>
                            Text Chat
                        </Tab>
                    </TabList>
                    {tab === 0 ? <VideoChatUI room={room} device={device} /> : null}
                    {tab === 1 ? <TextChatUI room={room} messages={[]} /> : null}
                </Tabs>
            </ConferenceSheet>
        </ConferenceContainer>
    );
}

const ConferenceContainer = styled("div")(() => ({
    position: "fixed",
    top: 78,
    bottom: 78,
    right: 16,
    zIndex: 10,
    display: "flex",
    alignItems: "flex-start",
    transition: "transform 0.3s ease-in-out",
}));

const ButtonSheet = styled(Sheet)(() => ({
    position: "relative",
    top: 38,
    borderTopLeftRadius: 99,
    borderBottomLeftRadius: 99,
}));

const ConferenceSheet = styled(Sheet)(() => ({
    overflow: "auto",
    borderRadius: 16,
    display: "grid",
    gap: 4,
    height: "100%",
}));
