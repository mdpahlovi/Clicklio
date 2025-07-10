import { IconButton, Sheet } from "@mui/joy";
import { useState } from "react";
import { BiSolidWebcam } from "react-icons/bi";
import { MdMic, MdScreenShare } from "react-icons/md";

export default function Video({ withControl }: { withControl?: boolean }) {
    const [isHover, setIsHover] = useState(true);

    if (withControl) {
        return (
            <Sheet
                variant="solid"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                }}
                style={{
                    position: "relative",
                    aspectRatio: 16 / 9,
                    borderRadius: 16,
                    overflow: "hidden",
                }}
            >
                {/* Users Video */}

                <Sheet
                    style={{
                        transition: "all 300ms ease-in-out",
                        transform: isHover ? "translateY(-6px)" : "translateY(100%)",
                    }}
                    sx={{ opacity: isHover ? 1 : 0, display: "flex", borderRadius: 24 }}
                >
                    <div style={{ padding: 6 }}>
                        <IconButton
                        // {...(isMicEnabled ? { variant: "solid", color: "primary" } : {})}
                        // onClick={() => {
                        //     if (currentMedia) {
                        //         const audioTrack = currentMedia.getAudioTracks()[0];
                        //         if (audioTrack) {
                        //             audioTrack.enabled = !isMicEnabled;
                        //             toggleMic();
                        //         }
                        //     }
                        // }}
                        >
                            <MdMic size={20} />
                        </IconButton>
                    </div>
                    <Sheet
                        sx={{
                            p: 0.75,
                            display: "flex",
                            gap: 0.5,
                            borderRadius: 24,
                            borderWidth: "0 0 0 1px",
                        }}
                    >
                        <IconButton
                        // {...(isCameraEnabled ? { variant: "solid", color: "primary" } : {})}
                        // onClick={() => {
                        //     if (currentMedia) {
                        //         const videoTrack = currentMedia.getVideoTracks()[0];
                        //         if (videoTrack) {
                        //             videoTrack.enabled = !isCameraEnabled;
                        //             toggleCamera();
                        //         }
                        //     }
                        // }}
                        >
                            <BiSolidWebcam size={18} />
                        </IconButton>
                        <IconButton
                        // {...(isScreenSharing ? { variant: "solid", color: "primary" } : {})}
                        // onClick={() => {
                        //     toggleScreen();
                        // }}
                        // disabled
                        >
                            <MdScreenShare size={16} />
                        </IconButton>
                    </Sheet>
                </Sheet>
            </Sheet>
        );
    } else {
        return <Sheet variant="solid" style={{ position: "relative", aspectRatio: 16 / 9, borderRadius: 16 }}></Sheet>;
    }
}
