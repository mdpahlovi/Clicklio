import { ChatBubble, MessageInput } from "@/components/chat";
import { Stack, TabPanel, Typography } from "@mui/joy";
import { useState } from "react";

type MessageProps = {
    id: string;
    content: string;
    unread?: boolean;
    timestamp: string;
    sender: { name: string } | "You";
    attachment?: { fileName: string; type: string; size: string };
};

export default function TextChatUI({ room, messages }: { room: string; messages: MessageProps[] }) {
    const [chatMessages, setChatMessages] = useState(messages);
    const [message, setMessage] = useState("");

    return (
        <>
            <TabPanel value={1} sx={{ px: 1.25, py: 0.75, overflowY: "auto", display: "flex" }}>
                {chatMessages?.length ? (
                    <Stack width="100%" spacing={0.75} sx={{ justifyContent: "flex-end" }}>
                        {chatMessages.map((message: MessageProps, index: number) => (
                            <Stack
                                key={index}
                                direction="row"
                                spacing={2}
                                sx={{ flexDirection: message.sender === "You" ? "row-reverse" : "row" }}
                            >
                                <ChatBubble variant={message.sender === "You" ? "sent" : "received"} {...message} />
                            </Stack>
                        ))}
                    </Stack>
                ) : (
                    <Stack width="100%" alignItems="center" justifyContent="center">
                        <Typography level="body-sm">No message available!...</Typography>
                    </Stack>
                )}
            </TabPanel>
            <MessageInput
                value={message}
                onChange={setMessage}
                onSubmit={() => {
                    const newId = chatMessages.length + 1;
                    const newIdString = newId.toString();
                    setChatMessages([
                        ...chatMessages,
                        {
                            id: newIdString,
                            sender: "You",
                            content: message,
                            timestamp: "Just now",
                        },
                    ]);
                }}
            />
        </>
    );
}
