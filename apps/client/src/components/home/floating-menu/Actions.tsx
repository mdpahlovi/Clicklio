import { IconButton, Tooltip } from "@mui/joy";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";
import { IoDuplicateOutline } from "react-icons/io5";
import { useShapeState } from "@/hooks/useShapeState";
import { handleDelete, handleDuplicate } from "@/utils/key-events";
import type { ActionsProps } from "@/types";

export default function Actions({ fabricRef }: ActionsProps) {
    const [searchParams] = useSearchParams();
    const { setShape, deleteShape } = useShapeState();

    return (
        <>
            <Tooltip title="Duplicate">
                <IconButton
                    color="primary"
                    variant="soft"
                    onClick={() => (fabricRef.current ? handleDuplicate(fabricRef.current, searchParams.get("room"), setShape) : null)}
                >
                    <IoDuplicateOutline />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton
                    color="danger"
                    variant="soft"
                    onClick={() => (fabricRef.current ? handleDelete(fabricRef.current, searchParams.get("room"), deleteShape) : null)}
                >
                    <RiDeleteBin5Line />
                </IconButton>
            </Tooltip>
        </>
    );
}
