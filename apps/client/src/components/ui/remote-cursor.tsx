import { useRoomState } from "@/hooks/zustand/useRoomState";
import { socket } from "@/utils/socket";
import { useTheme } from "@mui/joy";
import { useCallback, useEffect, useRef } from "react";

import type { Cursor } from "@/hooks/zustand/useRoomState";
import { BsCursor } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";

export default function RemoteCursor() {
    const { palette } = useTheme();
    const [searchParams] = useSearchParams();
    const { users, cursor, setCursor, deleteCursor } = useRoomState();
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    const room = searchParams.get("room");

    useEffect(() => {
        const emitCursorPoint = (e: globalThis.MouseEvent) => {
            if (room) socket.emit("cursor", { room, cursor: { x: e.x, y: e.y } });
        };

        window.addEventListener("mousemove", (e) => emitCursorPoint(e));

        return () => {
            window.removeEventListener("mousemove", (e) => emitCursorPoint(e));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket.on("cursor", (cursor) => handleCursorUpdate(cursor));

        return () => {
            socket.off("cursor", (cursor) => handleCursorUpdate(cursor));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCursorUpdate = useCallback((cursor: Cursor) => {
        setCursor(cursor);

        // Reset the timeout if cursor is updated
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => deleteCursor(cursor.id), 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return cursor.map(({ id, x, y }) => {
        const user = users.find((u) => u.id === id);

        return (
            <div key={id} style={id ? { position: "fixed", zIndex: 1, top: y, left: x } : { display: "none" }}>
                <BsCursor style={{ transform: "rotate(-90deg)" }} />
                <div
                    style={{
                        borderRadius: 9999,
                        margin: "-10px 10px",
                        padding: "1px 8px 0",
                        background: palette.background.body,
                        border: `1px solid ${palette.divider}`,
                    }}
                >
                    <p
                        style={{
                            color: palette.text.primary,
                            fontSize: 14,
                            fontFamily: "Poppins",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {user?.name}
                    </p>
                </div>
            </div>
        );
    });
}
