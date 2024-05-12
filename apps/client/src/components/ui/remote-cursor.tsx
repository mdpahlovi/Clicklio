import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { RxCursorArrow } from "react-icons/rx";

export default function RemoteCursor() {
    const [position, setPosition] = useState<{ x: number; y: number } | null>();

    useEffect(() => {
        socket.on("cursor", (position) => setPosition(position));

        return () => {
            socket.off("cursor", (position) => setPosition(position));
        };
    }, []);

    return (
        <RxCursorArrow style={position ? { position: "absolute", zIndex: 1, top: position.y, left: position.x } : { display: "none" }} />
    );
}
