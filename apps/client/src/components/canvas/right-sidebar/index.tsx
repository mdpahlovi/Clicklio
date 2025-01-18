import { Sheet, Tab, TabList, Tabs } from "@mui/joy";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TextChatUI from "./text-chat-ui";
import VideoChatUI from "./video-chat-ui";

export default function RightSidebar() {
    const [tab, setTab] = useState(0);

    const [searchParams] = useSearchParams();
    const room = searchParams.get("room");

    if (room) {
        return (
            <Sheet style={{ position: "absolute", top: 10, right: 10, borderRadius: 24, zIndex: 1 }}>
                <Tabs
                    value={tab}
                    onChange={(_, value) => setTab(value as number)}
                    sx={{ width: 288, height: "calc(100vh - 136px)", borderRadius: 24 }}
                >
                    <TabList sx={{ width: "100%" }}>
                        <Tab variant="plain" color="neutral" sx={{ flexGrow: 1, borderRadius: "24px 0 0 0" }}>
                            Video Chat
                        </Tab>
                        <Tab variant="plain" color="neutral" sx={{ flexGrow: 1, borderRadius: "0 24px 0 0" }}>
                            Text Chat
                        </Tab>
                    </TabList>

                    {tab === 0 ? <VideoChatUI /> : null}
                    {tab === 1 ? <TextChatUI messages={[]} /> : null}
                </Tabs>
            </Sheet>
        );
    }
}
