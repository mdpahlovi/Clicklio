import Modal from "@/components/ui/modal";
import { editors, tools, views } from "@/constants";
import { Box, Divider, Sheet, Typography } from "@mui/joy";
import React from "react";

export default function GuideModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <Modal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            title="Keyboard shortcuts"
            sx={{ maxWidth: 768, maxHeight: "80vh", overflowY: "scroll" }}
        >
            <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1fr 1fr" }, gap: 3 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <KeyboardShortcuts title="Tool" shortcuts={tools} />
                    <KeyboardShortcuts title="View" shortcuts={views} />
                </div>
                <KeyboardShortcuts title="Editor" shortcuts={editors} />
            </Box>
        </Modal>
    );
}

function KeyboardShortcuts({ title, shortcuts }: { title: string; shortcuts: { name: string; key: string }[] }) {
    return (
        <div>
            <Typography level="title-md" fontWeight="bold" mb={1}>
                {title}
            </Typography>
            <Sheet>
                {shortcuts.map(({ name, key }, idx) => (
                    <React.Fragment key={idx}>
                        <div style={{ padding: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography>{name}</Typography>

                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                {key.split(" ").map((key, idx) => (
                                    <Typography
                                        key={idx}
                                        variant={idx % 2 !== 0 ? undefined : "soft"}
                                        color={idx % 2 !== 0 ? undefined : "primary"}
                                        fontSize={14}
                                    >
                                        {key}
                                    </Typography>
                                ))}
                            </div>
                        </div>
                        {shortcuts.length !== idx + 1 ? <Divider /> : null}
                    </React.Fragment>
                ))}
            </Sheet>
        </div>
    );
}
