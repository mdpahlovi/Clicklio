import { MicIcon, MicOffIcon, ScreenShareIcon, ScreenShareOffIcon, VideoIcon, VideoOffIcon } from "@/components/icons";
import { Box, Button, Divider, IconButton, Stack } from "@mui/joy";
import { types } from "mediasoup-client";
import { handleMediaError } from "../../../utils/utils";

type LocalStreams = {
    audio: MediaStreamTrack | null;
    camera: MediaStreamTrack | null;
    screen: MediaStreamTrack | null;
};

type VideoControllersProps = {
    isStarted: boolean;
    localStreams: LocalStreams;
    sendTransportRef: React.RefObject<types.Transport | null>;
    createProducer: (sendTransport: types.Transport, track: MediaStreamTrack, mediaType: keyof LocalStreams) => void;
    deleteProducer: (mediaType: keyof LocalStreams) => void;
    handleStopVideoChat: () => void;
    handleStartVideoChat: () => void;
};

export default function VideoControllers({
    isStarted,
    localStreams,
    createProducer,
    deleteProducer,
    sendTransportRef,
    handleStopVideoChat,
    handleStartVideoChat,
}: VideoControllersProps) {
    const handleSwitchMic = () => {
        const sendTransport = sendTransportRef.current;
        if (sendTransport) {
            if (localStreams.audio) {
                deleteProducer("audio");
            } else {
                navigator.mediaDevices
                    .getUserMedia({ audio: true })
                    .then((stream) => createProducer(sendTransport, stream.getAudioTracks()[0], "audio"))
                    .catch((error) => handleMediaError(error));
            }
        }
    };

    const handleSwitchCamera = () => {
        const sendTransport = sendTransportRef.current;
        if (sendTransport) {
            if (localStreams.camera) {
                deleteProducer("camera");
            } else {
                navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then((stream) => {
                        if (localStreams.screen) deleteProducer("screen");
                        createProducer(sendTransport, stream.getVideoTracks()[0], "camera");
                    })
                    .catch((error) => handleMediaError(error));
            }
        }
    };

    const handleSwitchScreen = () => {
        const sendTransport = sendTransportRef.current;
        if (sendTransport) {
            if (localStreams.screen) {
                deleteProducer("screen");
            } else {
                navigator.mediaDevices
                    .getDisplayMedia({ video: true })
                    .then((stream) => {
                        if (localStreams.camera) deleteProducer("camera");
                        createProducer(sendTransport, stream.getVideoTracks()[0], "screen");
                    })
                    .catch((error) => handleMediaError(error));
            }
        }
    };

    return (
        <>
            <Divider />
            <Box sx={{ p: 1 }}>
                {isStarted ? (
                    <Stack direction="row" justifyContent="center" spacing={1}>
                        <IconButton
                            variant={localStreams.audio ? "solid" : "outlined"}
                            color={localStreams.audio ? "primary" : "neutral"}
                            onClick={() => handleSwitchMic()}
                        >
                            {localStreams.audio ? <MicOffIcon /> : <MicIcon />}
                        </IconButton>
                        <IconButton
                            variant={localStreams.camera ? "solid" : "outlined"}
                            color={localStreams.camera ? "primary" : "neutral"}
                            onClick={() => handleSwitchCamera()}
                        >
                            {localStreams.camera ? <VideoOffIcon /> : <VideoIcon />}
                        </IconButton>
                        <IconButton
                            variant={localStreams.screen ? "solid" : "outlined"}
                            color={localStreams.screen ? "primary" : "neutral"}
                            onClick={() => handleSwitchScreen()}
                        >
                            {localStreams.screen ? <ScreenShareOffIcon /> : <ScreenShareIcon />}
                        </IconButton>
                        <IconButton variant="solid" color="danger" onClick={() => handleStopVideoChat()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none">
                                <path
                                    d="M15.9212 9.24433L15.931 9.30236C16.0456 9.98064 16.1029 10.3198 16.2809 10.5938C16.3339 10.6753 16.3943 10.7518 16.4613 10.8221C16.6866 11.0586 17.0029 11.1923 17.6356 11.4598C18.5863 11.8617 19.0616 12.0627 19.5176 11.9827C19.6515 11.9592 19.7818 11.9184 19.9053 11.8613C20.3256 11.6669 20.605 11.2259 21.1637 10.344C21.7465 9.42428 22.0378 8.9644 21.9961 8.43957C21.9867 8.32195 21.9561 8.17279 21.9184 8.06099C21.7504 7.56215 21.3553 7.29135 20.5653 6.74976C15.2168 3.0834 8.78319 3.08342 3.43474 6.74976C2.64467 7.29135 2.24964 7.56215 2.08155 8.06099C2.04388 8.17279 2.0133 8.32195 2.00394 8.43958C1.96217 8.96441 2.25354 9.42428 2.83628 10.344C3.39504 11.2259 3.67442 11.6669 4.09473 11.8613C4.21816 11.9184 4.34846 11.9592 4.48236 11.9827C4.93835 12.0627 5.41371 11.8617 6.36443 11.4598C6.99706 11.1923 7.31337 11.0586 7.5387 10.8221C7.60574 10.7518 7.66613 10.6753 7.7191 10.5938C7.89713 10.3198 7.95443 9.98064 8.06903 9.30236L8.07883 9.24433C8.19712 8.54421 8.25626 8.19414 8.51567 7.87314C8.55197 7.82822 8.61802 7.75692 8.66002 7.71731C8.96021 7.43423 9.22512 7.36865 9.75492 7.23749C11.1819 6.88423 12.8181 6.88423 14.2451 7.23749C14.7749 7.36865 15.0398 7.43423 15.34 7.71731C15.382 7.75692 15.448 7.82822 15.4843 7.87314C15.7437 8.19414 15.8029 8.54421 15.9212 9.24433Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="square"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M9.49976 17.5L11.9998 20L14.4998 17.5M11.9998 12.5V19.3912"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </IconButton>
                    </Stack>
                ) : (
                    <Button onClick={() => handleStartVideoChat()} sx={{ borderRadius: 8 }} startDecorator={<VideoIcon />} fullWidth>
                        Start Video
                    </Button>
                )}
            </Box>
        </>
    );
}
