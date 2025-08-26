import { Button, Divider, Textarea } from "@mui/joy";

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
        <>
            <Divider />
            <Textarea
                placeholder="Type something here…"
                aria-label="Message"
                onChange={(e) => onChange(e.target.value)}
                value={value}
                minRows={2}
                maxRows={6}
                style={{ padding: 8, paddingTop: 6, border: "none", borderRadius: 0 }}
                slotProps={{
                    root: { sx: { "--Textarea-focusedThickness": 0 } },
                    textarea: { sx: { paddingInlineEnd: 0, fontSize: 14, lineHeight: 1.25 } },
                    endDecorator: { sx: { margin: 0, justifyContent: "flex-end" } },
                }}
                endDecorator={
                    <Button
                        size="sm"
                        color="primary"
                        endDecorator={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none">
                                <path
                                    d="M9.49811 15L16.9981 7.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8.00634 7.67888L15.327 4.21881C18.3688 2.78111 19.8897 2.06226 20.8598 2.78341C21.8299 3.50455 21.5527 5.14799 20.9984 8.43486L20.0435 14.0968C19.6811 16.246 19.4998 17.3205 18.6989 17.7891C17.8979 18.2577 16.8574 17.8978 14.7765 17.178L8.41077 14.9762C4.51917 13.6301 2.57337 12.9571 2.50019 11.6365C2.427 10.3159 4.28678 9.43692 8.00634 7.67888Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M9.49811 15.5V17.7274C9.49811 20.101 9.49811 21.2878 10.2083 21.4771C10.9185 21.6663 11.6664 20.6789 13.1622 18.7039L13.9981 17.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        }
                        sx={{ borderRadius: 8 }}
                        onClick={handleClick}
                    >
                        Send
                    </Button>
                }
                onKeyDown={(event) => {
                    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) handleClick();
                }}
            />
        </>
    );
}
