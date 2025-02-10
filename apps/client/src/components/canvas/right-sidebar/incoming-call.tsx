import { Avatar, AvatarGroup, Button, Modal, Sheet, Typography } from "@mui/joy";
import { useState } from "react";
import { GoPeople } from "react-icons/go";

export default function IncomingCall() {
    const [open, setOpen] = useState(false);

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Sheet
                variant="outlined"
                sx={{
                    width: "100%",
                    maxWidth: 512,
                    borderRadius: 24,
                    p: 3,
                    boxShadow: "lg",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <AvatarGroup sx={{ ml: 2, justifyContent: "center" }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 80, height: 80, marginLeft: -2 }} />
                    <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" sx={{ width: 80, height: 80, marginLeft: -2 }} />
                    <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" sx={{ width: 80, height: 80, marginLeft: -2 }} />
                    <Avatar sx={{ width: 80, height: 80, marginLeft: -2 }}>+3</Avatar>
                </AvatarGroup>
                <Typography marginTop={1.5} level="h4">
                    Incoming Video Chat
                </Typography>
                <Typography marginTop={0.5} level="body-sm">
                    <GoPeople style={{ marginBottom: -1.75 }} /> 6 Participants
                </Typography>
                <Typography level="body-sm">Ringing...</Typography>
                <div style={{ width: "100%", marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Button variant="solid" color="danger" onClick={() => setOpen(false)}>
                        Decline
                    </Button>
                    <Button variant="solid" color="success">
                        Answer
                    </Button>
                </div>
            </Sheet>
        </Modal>
    );
}
