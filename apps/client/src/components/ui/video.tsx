import { IconButton, Sheet } from "@mui/joy";
import { useState } from "react";
import { BiSolidWebcam } from "react-icons/bi";
import { MdMic, MdScreenShare } from "react-icons/md";

export default function Video() {
    const [isHover, setIsHover] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                aspectRatio: 16 / 9,
                backgroundColor: "red",
                borderRadius: 16,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                overflow: "hidden",
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <Sheet
                style={{
                    transition: "all 300ms ease-in-out",
                    transform: isHover ? "translateY(-6px)" : "translateY(100%)",
                }}
                sx={{ opacity: isHover ? 1 : 0, display: "flex", borderRadius: 24 }}
            >
                <div style={{ padding: 6 }}>
                    <IconButton variant="solid" color="primary">
                        <MdMic size={20} />
                    </IconButton>
                </div>
                <Sheet sx={{ p: 0.75, display: "flex", gap: 0.5, borderRadius: 24, borderWidth: "0 0 0 1px" }}>
                    <IconButton variant="solid" color="primary">
                        <BiSolidWebcam size={18} />
                    </IconButton>
                    <IconButton>
                        <MdScreenShare size={16} />
                    </IconButton>
                </Sheet>
            </Sheet>
        </div>
    );
}
