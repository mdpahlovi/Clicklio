import { Box, Sheet, Stack, Typography } from "@mui/joy";

type MessageProps = {
    id: string;
    message: string;
    timestamp: string;
    sender: { name: string } | "You";
};

type ChatBubbleProps = MessageProps & {
    variant: "sent" | "received";
};

export default function ChatBubble({ message, variant, timestamp, sender }: ChatBubbleProps) {
    const isSent = variant === "sent";

    return (
        <Box>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", mb: 0.25 }}>
                <Typography level="body-xs" lineHeight={1}>
                    {sender === "You" ? sender : sender.name}
                </Typography>
                <Typography level="body-xs" lineHeight={1}>
                    {timestamp}
                </Typography>
            </Stack>
            <Box sx={{ position: "relative" }}>
                <Sheet
                    color={isSent ? "primary" : "neutral"}
                    variant={isSent ? "solid" : "soft"}
                    sx={[
                        { px: 1.25, py: 0.75, borderRadius: 8 },
                        isSent ? { borderTopRightRadius: 0 } : { borderTopRightRadius: 8 },
                        isSent ? { borderTopLeftRadius: 8 } : { borderTopLeftRadius: 0 },
                        isSent
                            ? { backgroundColor: "var(--joy-palette-primary-solidBg)" }
                            : { backgroundColor: "var(--joy-palette-neutral-softBg)" },
                    ]}
                >
                    <Typography level="body-sm" sx={{ wordBreak: "break-word", color: "white", lineHeight: 1.25 }}>
                        {message}
                    </Typography>
                </Sheet>
            </Box>
        </Box>
    );
}
