import { CursorIcon } from "@/components/icons";
import { usePointerStore, type Pointer } from "@/stores/room/usePointerStore";
import { useUserStore } from "@/stores/room/useUserStore";
import { socket } from "@/utils/socket";
import { Box, Sheet, Typography } from "@mui/joy";
import { useCallback, useEffect, useRef } from "react";
import { useThrottledCallback } from "use-debounce";

export default function RemoteCursor({ room }: { room: string }) {
    const { roomUser } = useUserStore();
    const { pointers, setPointer, deletePointer } = usePointerStore();

    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const throttledEmitCursor = useThrottledCallback(
        (e: MouseEvent) => {
            if (typeof e?.clientX !== "number" || typeof e?.clientY !== "number") return;

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
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <Box
                    style={{
                        width: "max-content",
                        color: "white",
                        rotate: "-7.5deg",
                    }}
                >
                    <CursorIcon />
                </Box>
                {user?.name && (
                    <Sheet sx={{ borderRadius: 9999, margin: "-10px 10px", padding: "1px 8px 0" }}>
                        <Typography level="title-sm">{user.name}</Typography>
                    </Sheet>
                )}
            </div>
        );
    });
}
