import { IconButton } from "@mui/joy";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";
import { IoDuplicateOutline } from "react-icons/io5";
import { useShapeState } from "@/hooks/useShapeState";
import { handleCopy, handleDelete, handlePaste } from "@/utils/key-events";
import type { ActionsProps } from "@/types";

export default function Actions({ fabricRef, pasteTimeRef, copiedObjectRef }: ActionsProps) {
    const [searchParams] = useSearchParams();
    const { setShape, deleteShape } = useShapeState();

    return (
        <>
            <IconButton
                color="primary"
                variant="soft"
                onClick={() => {
                    if (fabricRef.current) {
                        handleCopy(fabricRef.current, copiedObjectRef);
                        handlePaste(fabricRef.current, searchParams.get("room"), pasteTimeRef, copiedObjectRef, setShape);
                    }
                }}
            >
                <IoDuplicateOutline />
            </IconButton>
            <IconButton
                color="danger"
                variant="soft"
                onClick={() => (fabricRef.current ? handleDelete(fabricRef.current, searchParams.get("room"), deleteShape) : null)}
            >
                <RiDeleteBin5Line />
            </IconButton>
        </>
    );
}
