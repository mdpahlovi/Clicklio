import { useEffect } from "react";
import { useTheme } from "@mui/joy";
import { socket } from "@/utils/socket";
import { useRoomState } from "@/hooks/useRoomState";

import { RxCursorArrow } from "react-icons/rx";
import { useAuthState } from "@/hooks/useAuthState";

export default function RemoteCursor({ roomRef }: { roomRef: React.MutableRefObject<string | null> }) {
    const { palette } = useTheme();
    const { user } = useAuthState();
    const { cursor, setCursor } = useRoomState();

    useEffect(() => {
        window.addEventListener("mousemove", (e) => {
            socket.emit("cursor", { room: roomRef.current, cursor: { ...user, x: e.x, y: e.y } });
        });

        return () => {
            window.removeEventListener("mousemove", (e) =>
                socket.emit("cursor", { room: roomRef.current, cursor: { ...user, x: e.x, y: e.y } })
            );
        };
    }, [user]);

    useEffect(() => {
        socket.on("cursor", (cursor) => setCursor(cursor));

        return () => {
            socket.off("cursor", (cursor) => setCursor(cursor));
        };
    }, []);

    return cursor.map(({ id, name, x, y }) => (
        <div style={id ? { position: "absolute", zIndex: 1, top: y, left: x } : { display: "none" }}>
            <RxCursorArrow />
            <div
                style={{
                    borderRadius: 9999,
                    padding: "2px 6px 1px",
                    background: palette.background.body,
                    border: `1px solid ${palette.divider}`,
                }}
            >
                <p style={{ color: palette.text.primary, fontSize: 14, fontFamily: "Poppins", whiteSpace: "nowrap" }}>{name}</p>
            </div>
        </div>
    ));
}
