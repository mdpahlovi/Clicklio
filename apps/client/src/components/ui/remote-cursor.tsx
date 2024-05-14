import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { useRoomState } from "@/hooks/useRoomState";

import { RxCursorArrow } from "react-icons/rx";

export default function RemoteCursor() {
    const { cursor, setCursor } = useRoomState();

    useEffect(() => {
        socket.on("cursor", (cursor) => setCursor(cursor));

        return () => {
            socket.off("cursor", (cursor) => setCursor(cursor));
        };
    }, []);

    return cursor.map(({ id, x, y }) => (
        <RxCursorArrow style={id ? { position: "absolute", zIndex: 1, top: y, left: x } : { display: "none" }} />
    ));
}
