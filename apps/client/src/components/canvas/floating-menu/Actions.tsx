import { CopyIcon, DeleteIcon } from "@/components/icons";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { ActionsProps } from "@/types";
import { handleDelete, handleDuplicate } from "@/utils/key-event";
import { IconButton, Tooltip } from "@mui/joy";

export default function Actions({ stage, currentObject }: ActionsProps) {
    const { createEvent } = useEventStore();
    const { userMedia, setUserMedia } = useCanvasState();

    return (
        <>
            {currentObject?.id() !== "webcam" ? (
                <Tooltip title="Duplicate">
                    <IconButton
                        color="primary"
                        variant="soft"
                        onClick={() => {
                            handleDuplicate(stage, createEvent);
                        }}
                    >
                        <CopyIcon />
                    </IconButton>
                </Tooltip>
            ) : null}
            <Tooltip title="Delete">
                <IconButton
                    color="danger"
                    variant="soft"
                    onClick={() => {
                        handleDelete(stage, createEvent);
                        if (currentObject?.id() === "webcam" && userMedia) {
                            userMedia.getTracks().forEach((track) => track.stop());
                        }
                        setUserMedia(null);
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}
