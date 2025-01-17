import { Avatar, Box, Sheet, Stack, Typography } from "@mui/joy";
import { PiFilesFill } from "react-icons/pi";

type MessageProps = {
    id: string;
    content: string;
    unread?: boolean;
    timestamp: string;
    sender: { name: string } | "You";
    attachment?: { fileName: string; type: string; size: string };
};

type ChatBubbleProps = MessageProps & {
    variant: "sent" | "received";
};

export default function ChatBubble(props: ChatBubbleProps) {
    const { content, variant, timestamp, attachment = undefined, sender } = props;
    const isSent = variant === "sent";

    return (
        <Box>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", mb: 0.25 }}>
                <Typography level="body-xs">{sender === "You" ? sender : sender.name}</Typography>
                <Typography level="body-xs">{timestamp}</Typography>
            </Stack>
            {attachment ? (
                <Sheet
                    variant="outlined"
                    sx={[
                        { p: 1, borderRadius: "lg" },
                        isSent ? { borderTopRightRadius: 0 } : { borderTopRightRadius: "lg" },
                        isSent ? { borderTopLeftRadius: "lg" } : { borderTopLeftRadius: 0 },
                    ]}
                >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar color="primary">
                            <PiFilesFill />
                        </Avatar>
                        <div>
                            <Typography sx={{ fontSize: "sm" }}>{attachment.fileName}</Typography>
                            <Typography level="body-sm">{attachment.size}</Typography>
                        </div>
                    </Stack>
                </Sheet>
            ) : (
                <Box sx={{ position: "relative" }}>
                    <Sheet
                        color={isSent ? "primary" : "neutral"}
                        variant={isSent ? "solid" : "soft"}
                        sx={[
                            { px: 1.25, py: 0.75, borderRadius: "lg" },
                            isSent ? { borderTopRightRadius: 0 } : { borderTopRightRadius: "lg" },
                            isSent ? { borderTopLeftRadius: "lg" } : { borderTopLeftRadius: 0 },
                            isSent
                                ? { backgroundColor: "var(--joy-palette-primary-solidBg)" }
                                : { backgroundColor: "var(--joy-palette-neutral-softBg)" },
                        ]}
                    >
                        <Typography
                            level="body-sm"
                            sx={[isSent ? { color: "var(--joy-palette-common-white)" } : { color: "var(--joy-palette-text-primary)" }]}
                        >
                            {content}
                        </Typography>
                    </Sheet>
                </Box>
            )}
        </Box>
    );
}
