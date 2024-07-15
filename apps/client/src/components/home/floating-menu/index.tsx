import { Divider, Sheet } from "@mui/joy";
import { modifyShape } from "@/utils/shapes";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useShapeState } from "@/hooks/useShapeState";
import Colors from "@/components/home/floating-menu/Colors";
import Actions from "@/components/home/floating-menu/Actions";
import Opacity from "@/components/home/floating-menu/Opacity";
import type { Attributes, FloatingMenuProps } from "@/types";
import Text from "./Text";

export default function FloatingMenu({ fabricRef, copiedObjectRef, pasteTimeRef }: FloatingMenuProps) {
    const [show, setShow] = useState(false);
    const touchEventRef = useRef<NodeJS.Timeout | null>(null);
    const currentObject = fabricRef?.current && fabricRef?.current?.getActiveObject();

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

    const { updateShape } = useShapeState();
    const [searchParams] = useSearchParams();
    const handleInputChange = (property: keyof Attributes, value: string) =>
        modifyShape({ fabricRef, room: searchParams.get("room"), property, value, updateShape });

    if (currentObject && show) {
        const { top, left, width } = currentObject.getBoundingRect();

        return (
            <Sheet
                onClick={(e) => e.stopPropagation()}
                sx={{ position: "absolute", zIndex: 9999, p: 0.75, display: "flex", gap: 0.5 }}
                style={{ top: top + 10, left: left + width / 2, transform: "translateX(-50%)", height: 36, borderRadius: 24 }}
            >
                {currentObject?.type === "i-text" ? <Text {...{ currentObject, handleInputChange }} /> : null}
                <Colors name="fill" {...{ currentObject, handleInputChange }} />
                <Colors name="stroke" {...{ currentObject, handleInputChange }} />
                <Opacity {...{ currentObject, handleInputChange }} />
                <Divider orientation="vertical" />
                <Actions {...{ fabricRef, pasteTimeRef, copiedObjectRef }} />
            </Sheet>
        );
    } else {
        return null;
    }
}
