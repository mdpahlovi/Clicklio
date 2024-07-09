import { useEffect, useRef, useState } from "react";
import { Sheet } from "@mui/joy";
import Actions from "@/components/home/floating-menu/Actions";
import type { FloatingMenuProps } from "@/types";

export default function FloatingMenu({ fabricRef, copiedObjectRef, pasteTimeRef }: FloatingMenuProps) {
    const [show, setShow] = useState(false);
    const touchEventRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        window.addEventListener("click", () => setShow(false));
        window.addEventListener("dblclick", () => setShow(true));
        window.addEventListener("touchstart", () => (touchEventRef.current = setTimeout(() => setShow(true), 500)));
        window.addEventListener("touchend", () => (touchEventRef.current ? clearTimeout(touchEventRef.current) : null));

        return () => {
            window.removeEventListener("click", () => setShow(false));
            window.removeEventListener("dblclick", () => setShow(true));
            window.removeEventListener("touchstart", () => (touchEventRef.current = setTimeout(() => setShow(true), 500)));
            window.removeEventListener("touchend", () => (touchEventRef.current ? clearTimeout(touchEventRef.current) : null));
        };
    }, []);

    const currentObject = fabricRef?.current && fabricRef?.current?.getActiveObject();

    if (currentObject && show) {
        const { top, left, width } = currentObject.getBoundingRect();

        return (
            <Sheet
                onClick={(e) => e.stopPropagation()}
                sx={{ position: "absolute", zIndex: 9999, p: 0.75, display: "flex", gap: 0.5 }}
                style={{ top, left: left + width / 2, transform: "translateX(-50%)", height: 36, borderRadius: 24 }}
            >
                <Actions {...{ fabricRef, pasteTimeRef, copiedObjectRef }} />
            </Sheet>
        );
    } else {
        return null;
    }
}
