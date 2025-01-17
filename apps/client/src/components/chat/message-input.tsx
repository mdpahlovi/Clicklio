import { Button, Textarea } from "@mui/joy";

export type MessageInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
};

export default function MessageInput({ value, onChange, onSubmit }: MessageInputProps) {
    const handleClick = () => {
        if (value.trim() !== "") {
            onSubmit();
            onChange("");
        }
    };

    return (
        <div>
            <Textarea
                placeholder="Type something here…"
                aria-label="Message"
                onChange={(e) => onChange(e.target.value)}
                value={value}
                minRows={2}
                maxRows={6}
                sx={{ paddingInlineStart: 1 }}
                slotProps={{
                    textarea: { sx: { fontSize: 14, lineHeight: 1, paddingInlineEnd: 1 } },
                    endDecorator: { sx: { marginTop: 0, justifyContent: "flex-end" } },
                }}
                endDecorator={
                    <Button size="sm" color="primary" sx={{}} onClick={handleClick}>
                        Send
                    </Button>
                }
                onKeyDown={(event) => {
                    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) handleClick();
                }}
            />
        </div>
    );
}
