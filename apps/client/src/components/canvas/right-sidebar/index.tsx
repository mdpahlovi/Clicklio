import { IconButton, Sheet, Tab, TabList, Tabs } from "@mui/joy";
import { useState } from "react";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";
import TextChatUI from "./text-chat-ui";
import VideoChatUI from "./video-chat-ui";

export default function RightSidebar() {
    const [tab, setTab] = useState(0);
    const [searchParam] = useSearchParams();
    const [isShow, setIsShow] = useState(false);

    const room = searchParam.get("room");

    if (room) {
        return (
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    right: isShow ? 10 : -290,
                    zIndex: 1,
                    display: "flex",
                    transition: "right 0.3s ease-in-out",
                }}
            >
                <Sheet sx={{ height: 36, mt: 4.5, p: 0.75, borderRadius: "24px 0 0 24px", borderRightWidth: 0 }}>
                    <IconButton variant="solid" color="primary" onClick={() => setIsShow(!isShow)}>
                        {isShow ? <RiArrowRightDoubleLine size={20} /> : <RiArrowLeftDoubleLine size={20} />}
                    </IconButton>
                </Sheet>
                <Tabs
                    value={tab}
                    onChange={(_, value) => setTab(value as number)}
                    sx={{ width: 288, height: "calc(100vh - 136px)", borderRadius: 24 }}
                    style={{ border: "1px solid var(--joy-palette-neutral-outlinedBorder)" }}
                >
                    <TabList sx={{ width: "100%" }}>
                        <Tab variant="plain" color="neutral" sx={{ flexGrow: 1, borderRadius: "24px 0 0 0" }}>
                            Video Chat
                        </Tab>
                        <Tab variant="plain" color="neutral" sx={{ flexGrow: 1, borderRadius: "0 24px 0 0" }}>
                            Text Chat
                        </Tab>
                    </TabList>

                    {tab === 0 ? <VideoChatUI room={room} /> : null}
                    {tab === 1 ? <TextChatUI room={room} messages={[]} /> : null}
                </Tabs>
            </div>
        );
    }
}
