import { ChatBubble, MessageInput } from "@/components/chat";
import { Stack, TabPanel, Typography } from "@mui/joy";
import { useState } from "react";

type MessageProps = {
    id: string;
    message: string;
    timestamp: string;
    sender: { name: string } | "You";
};

export default function TextChatUI({ messages }: { room: string; messages: MessageProps[] }) {
    const [chatMessages, setChatMessages] = useState(messages);
    const [message, setMessage] = useState("");

    return (
        <>
            <TabPanel value={1} sx={{ p: 1, overflowY: "auto", display: "flex" }}>
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
                    <Stack width="100%" alignItems="center" justifyContent="center" gap={2}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none">
                            <path
                                d="M18.5 18.8349C16.7519 20.2676 14.4814 21.133 12 21.133C11.3507 21.1338 10.7032 21.0737 10.0654 20.9539C9.60633 20.8676 9.37678 20.8245 9.21653 20.849C9.05627 20.8735 8.82918 20.9943 8.37499 21.236C7.09014 21.9196 5.59195 22.1611 4.15111 21.8929C4.69874 21.219 5.07275 20.4103 5.23778 19.5434C5.33778 19.0132 5.09 18.498 4.71889 18.1209C3.03333 16.4084 2 14.1007 2 11.5609C2 9.0218 3.03313 6.71344 4.71889 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M7.5 3.02125C8.85265 2.36798 10.3815 2 12 2C17.5222 2 22 6.28357 22 11.5667C22 13.1665 21.5894 14.6747 20.8635 16"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path d="M2 2L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
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
                            message,
                            timestamp: "Just now",
                            sender: "You",
                        },
                    ]);
                }}
            />
        </>
    );
}
