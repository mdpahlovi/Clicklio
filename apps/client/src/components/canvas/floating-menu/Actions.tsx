import { CopyIcon, DeleteIcon } from "@/components/icons";
import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { ActionsProps } from "@/types";
import { handleDelete, handleDuplicate } from "@/utils/key-events";
import { IconButton, Tooltip } from "@mui/joy";

export default function Actions({ fabricRef, currentObject }: ActionsProps) {
    const { createEvent } = useEventStore();
    const { userMedia, setUserMedia } = useCanvasState();

    return (
        <>
            {currentObject?.uid !== "webcam" ? (
                <Tooltip title="Duplicate">
                    <IconButton
                        color="primary"
                        variant="soft"
                        onClick={() => {
                            if (fabricRef.current) {
                                handleDuplicate(fabricRef.current, createEvent);
                            }
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
                        if (fabricRef.current) {
                            handleDelete(fabricRef.current, createEvent);
                            if (currentObject?.uid === "webcam" && userMedia) {
                                userMedia.getTracks().forEach((track) => track.stop());

                                setUserMedia(null);
                            }
                        }
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}
