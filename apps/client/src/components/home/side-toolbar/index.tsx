import { modifyShape } from "@/utils/shapes";
import { useSearchParams } from "react-router-dom";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useEffect, useMemo, useRef, useState } from "react";

import { Divider, IconButton, Sheet } from "@mui/joy";
import Text from "@/components/home/side-toolbar/Text";
import Color from "@/components/home/side-toolbar/Color";
import Opacity from "@/components/home/side-toolbar/Opacity";
import Actions from "@/components/home/side-toolbar/Actions";
import Dimensions from "@/components/home/side-toolbar/Dimensions";
import StrokeWidth from "@/components/home/side-toolbar/StrokeWidth";

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

        if (property === "top" || property === "left" || property === "width" || property === "height") {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                modifyShape({ fabricRef, room: searchParams.get("room"), property, value, updateShape });
            }, 1000);
        } else {
            modifyShape({ fabricRef, room: searchParams.get("room"), property, value, updateShape });
        }
    };

    const memoizedContent = useMemo(
        () => (
            <Sheet
                style={{ overflowY: "auto", maxHeight: 594, top: 24, bottom: 73, right: open ? 24 : -241 }}
                sx={{ position: "absolute", zIndex: 1, width: 240, borderRadius: 30, transition: "right 0.5s ease-in-out" }}
            >
                <Dimensions {...{ isEditingRef, handleInputChange }} />
                <Divider />
                {attributes?.type === "i-text" ? (
                    <>
                        <Text {...{ handleInputChange }} />
                        <Divider />
                    </>
                ) : null}
                <Color placeholder="Fill Color" attribute="fill" {...{ handleInputChange }} />
                <Divider />
                <Color placeholder="Stroke Color" attribute="stroke" {...{ handleInputChange }} />
                <Divider />
                <StrokeWidth {...{ handleInputChange }} />
                <Divider />
                <Opacity {...{ handleInputChange }} />
                <Divider />
                <Actions {...{ fabricRef, pasteTimeRef, copiedObjectRef }} />
            </Sheet>
        ),
        [attributes, open]
    );

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
                style={{ borderRadius: "9999px 0 0 9999px", top: 52, right: open ? 265 : 0 }}
                sx={{ position: "absolute", zIndex: 1, transition: "right 0.5s ease-in-out" }}
            >
                <IconButton onClick={() => setOpen(!open)}>{open ? <CgClose /> : <CgMenuRight />}</IconButton>
            </Sheet>
        </>
    );
}
