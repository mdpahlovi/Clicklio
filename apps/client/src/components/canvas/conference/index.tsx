import { Button, Sheet, styled } from "@mui/joy";

export default function Conference() {
    return (
        <ConferenceSheet>
            <div>
                <Button>Start Conference</Button>
            </div>
        </ConferenceSheet>
    );
}

const ConferenceSheet = styled(Sheet)(() => ({
    position: "absolute",
    top: 78,
    bottom: 78,
    right: 16,
    zIndex: 10,
    padding: 4,
    borderRadius: 16,
    display: "grid",
    gap: 4,
}));
