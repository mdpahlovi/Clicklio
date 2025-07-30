import { usePointerStore, type Pointer } from "@/stores/room/usePointerStore";
import { useUserStore } from "@/stores/room/useUserStore";
import { socket } from "@/utils/socket";
import { useTheme } from "@mui/joy";
import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useThrottledCallback } from "use-debounce";
import { CursorIcon } from "../icons";

export default function RemoteCursor() {
    const { palette } = useTheme();
    const { roomUser } = useUserStore();
    const { pointers, setPointer, deletePointer } = usePointerStore();

    const room = useSearchParams()[0].get("room");

    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const throttledEmitCursor = useThrottledCallback(
        (e: MouseEvent) => {
            if (!room || typeof e?.clientX !== "number" || typeof e?.clientY !== "number") return;

            socket.emit("cursor", { room, cursor: { x: e.clientX, y: e.clientY } });
        },
        50,
        { leading: true, trailing: false },
    );

    const handleCursorUpdate = useCallback(
        ({ key, value }: { key: string; value: Pointer }) => {
            if (!key || typeof value?.x !== "number" || typeof value?.y !== "number") return;

            setPointer(key, value);

            const existingTimer = timersRef.current.get(key);
            if (existingTimer) {
                clearTimeout(existingTimer);
            }

            const newTimer = setTimeout(() => {
                deletePointer(key);
                timersRef.current.delete(key);
            }, 300);

            timersRef.current.set(key, newTimer);
        },
        [setPointer, deletePointer],
    );

    useEffect(() => {
        window.addEventListener("mousemove", throttledEmitCursor);
        return () => {
            window.removeEventListener("mousemove", throttledEmitCursor);
        };
    }, [throttledEmitCursor]);

    useEffect(() => {
        socket.on("cursor", handleCursorUpdate);
        return () => {
            socket.off("cursor", handleCursorUpdate);
        };
    }, [handleCursorUpdate]);

    useEffect(() => {
        return () => {
            timersRef.current.forEach((timer) => clearTimeout(timer));
            timersRef.current.clear();
        };
    }, []);

    return Array.from(pointers.entries()).map(([key, pointer]) => {
        const user = roomUser.get(key);

        return (
            <div
                key={key}
                style={{
                    position: "fixed",
                    zIndex: 1000,
                    transform: `translate(${pointer.x}px, ${pointer.y}px)`,
                    pointerEvents: "none",
                }}
            >
                <CursorIcon />
                {user?.name && (
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
                                margin: 0,
                            }}
                        >
                            {user.name}
                        </p>
                    </div>
                )}
            </div>
        );
    });
}
