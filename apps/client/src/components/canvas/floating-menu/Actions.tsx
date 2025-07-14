import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { useShapeState } from "@/hooks/zustand/useShapeState";
import type { ActionsProps } from "@/types";
import { handleDelete, handleDuplicate } from "@/utils/key-events";
import { IconButton, Tooltip } from "@mui/joy";
import { IoDuplicateOutline } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";

export default function Actions({ fabricRef, currentObject }: ActionsProps) {
    const [searchParams] = useSearchParams();
    const { setShape, deleteShape } = useShapeState();
    const { userMedia, setUserMedia } = useCanvasState();

    const room = searchParams.get("room");

    return (
        <>
            {currentObject?.uid !== "webcam" ? (
                <Tooltip title="Duplicate">
                    <IconButton
                        color="primary"
                        variant="soft"
                        onClick={() => (fabricRef.current ? handleDuplicate(fabricRef.current, room, setShape) : null)}
                    >
                        <IoDuplicateOutline />
                    </IconButton>
                </Tooltip>
            ) : null}
            <Tooltip title="Delete">
                <IconButton
                    color="danger"
                    variant="soft"
                    onClick={() => {
                        if (fabricRef.current) {
                            handleDelete(fabricRef.current, room, deleteShape);
                            if (currentObject?.uid === "webcam" && userMedia) {
                                userMedia.getTracks().forEach((track) => track.stop());

                                setUserMedia(null);
                            }
                        }
                    }}
                >
                    <RiDeleteBin5Line />
                </IconButton>
            </Tooltip>
        </>
    );
}
