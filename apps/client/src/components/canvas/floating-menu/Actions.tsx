import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { useShapeStore } from "@/stores/room/useShapeStore";
import type { ActionsProps } from "@/types";
import { handleDelete, handleDuplicate } from "@/utils/key-events";
import { IconButton, Tooltip } from "@mui/joy";
import { IoDuplicateOutline } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";

export default function Actions({ fabricRef, currentObject }: ActionsProps) {
    const { userMedia, setUserMedia } = useCanvasState();
    const { createShape, deleteShape } = useShapeStore();

    const room = useSearchParams()[0].get("room");

    return (
        <>
            {currentObject?.uid !== "webcam" ? (
                <Tooltip title="Duplicate">
                    <IconButton
                        color="primary"
                        variant="soft"
                        onClick={() => (fabricRef.current ? handleDuplicate(fabricRef.current, room, createShape) : null)}
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
