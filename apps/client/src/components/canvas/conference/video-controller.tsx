import { Button } from "@mui/joy";

export default function VideoController({ handleStopVideoChat }: { handleStopVideoChat: () => void }) {
    return (
        <Button color="danger" onClick={() => handleStopVideoChat()} fullWidth>
            Stop Video
        </Button>
    );
}
