import { useMemo, useRef } from "react";
import { modifyShape } from "@/utils/shapes";
import { useSearchParams } from "react-router-dom";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";

import Text from "./Text";
import Color from "./Color";
import Dimensions from "./Dimensions";
import Action from "./Action";
import { Divider, Sheet } from "@mui/joy";

import type { Attributes, RightSidebarProps } from "@/types";

export default function SideToolbar({ fabricRef, isEditingRef, pasteTimeRef, copiedObjectRef }: RightSidebarProps) {
    const { updateShape } = useShapeState();
    const [searchParams] = useSearchParams();
    const { attributes, updateAttributes } = useCanvasState();
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const handleInputChange = (property: keyof Attributes, value: string) => {
        if (!fabricRef.current) return;
        if (!isEditingRef.current) isEditingRef.current = true;

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
                style={{ overflowY: "auto", maxHeight: "calc(100vh - 12rem)" }}
                sx={{ position: "fixed", top: 89, right: 24, zIndex: 1, width: 240, borderRadius: 16 }}
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
        [attributes]
    ); // only re-render when attributes changes

    return memoizedContent;
}
