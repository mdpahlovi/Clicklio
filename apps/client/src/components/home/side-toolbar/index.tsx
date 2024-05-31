import { modifyShape } from "@/utils/shapes";
import { useSearchParams } from "react-router-dom";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useEffect, useMemo, useRef, useState } from "react";

import Text from "./Text";
import Color from "./Color";
import Action from "./Action";
import Dimensions from "./Dimensions";
import { Divider, IconButton, Sheet } from "@mui/joy";

import type { Attributes, RightSidebarProps } from "@/types";
import { CgMenuRight, CgClose } from "react-icons/cg";

export default function SideToolbar({ fabricRef, isEditingRef, pasteTimeRef, copiedObjectRef }: RightSidebarProps) {
    const [open, setOpen] = useState(true);
    const { updateShape } = useShapeState();
    const [searchParams] = useSearchParams();
    const { attributes, updateAttributes } = useCanvasState();
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const handleInputChange = (property: keyof Attributes, value: string) => {
        if (!fabricRef.current) return;

        switch (property) {
            case "width":
                updateAttributes("scaleX", "1");
                updateAttributes(property, value);
                break;
            case "height":
                updateAttributes("scaleY", "1");
                updateAttributes(property, value);
                break;
            default:
                updateAttributes(property, value);
                break;
        }

        if (
            property === "top" ||
            property === "left" ||
            property === "width" ||
            property === "height" ||
            property === "fill" ||
            property === "stroke"
        ) {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                modifyShape({ fabricRef, room: searchParams.get("room"), property, value, updateShape });
            }, 1000);
        } else {
            modifyShape({ fabricRef, room: searchParams.get("room"), property, value, updateShape });
        }
    };

    // memoize the content of the right sidebar to avoid re-rendering on every mouse actions
    const memoizedContent = useMemo(
        () => (
            <Sheet
                style={{ overflowY: "auto", maxHeight: "calc(100vh - 12rem)", top: 89, right: open ? 24 : -241 }}
                sx={{ position: "fixed", zIndex: 1, width: 240, borderRadius: 16, transition: "all 0.5s ease-in-out" }}
            >
                <Dimensions {...{ isEditingRef, handleInputChange }} />
                <Divider />
                <Text {...{ handleInputChange }} />
                <Divider />
                <Color placeholder="Color" attribute="fill" {...{ handleInputChange }} />
                <Divider />
                <Color placeholder="Stroke" attribute="stroke" {...{ handleInputChange }} />
                <Divider />
                <Action {...{ fabricRef, pasteTimeRef, copiedObjectRef }} />
            </Sheet>
        ),
        [attributes, open]
    ); // only re-render when attributes changes

    useEffect(() => {
        window.innerWidth <= 768 ? setOpen(false) : setOpen(true);

        window.addEventListener("resize", () => (window.innerWidth <= 768 ? setOpen(false) : setOpen(true)));

        return () => {
            window.removeEventListener("resize", () => (window.innerWidth <= 768 ? setOpen(false) : setOpen(true)));
        };
    }, []);

    return (
        <>
            {memoizedContent}
            <Sheet
                style={{ borderRadius: "12px 0 0 12px", top: 108, right: open ? 265 : 0 }}
                sx={{ p: 0.25, position: "fixed", zIndex: 1, transition: "all 0.5s ease-in-out" }}
            >
                <IconButton onClick={() => setOpen(!open)}>{open ? <CgClose /> : <CgMenuRight />}</IconButton>
            </Sheet>
        </>
    );
}
