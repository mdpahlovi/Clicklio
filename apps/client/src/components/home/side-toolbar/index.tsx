import { useMemo, useRef } from "react";
import { modifyShape } from "@/utils/shapes";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";

import Text from "./Text";
import Color from "./Color";
import Dimensions from "./Dimensions";
import Action from "./Action";

import type { Attributes, RightSidebarProps } from "@/types";
import { Divider } from "@mui/joy";

export default function SideToolbar({ fabricRef, isEditingRef, pasteTimeRef, copiedObjectRef }: RightSidebarProps) {
    const colorInputRef = useRef(null);
    const strokeInputRef = useRef(null);
    const { updateShape } = useShapeState();
    const { attributes, updateAttributes } = useCanvasState();

    const handleInputChange = (property: keyof Attributes, value: string) => {
        if (!fabricRef.current) return;
        if (!isEditingRef.current) isEditingRef.current = true;

        updateAttributes(property, value);
        modifyShape({ fabricRef, property, value, updateShape });
    };

    // memoize the content of the right sidebar to avoid re-rendering on every mouse actions
    const memoizedContent = useMemo(
        () => (
            <section
                style={{
                    maxHeight: "calc(100vh - 12rem)",
                    overflowY: "scroll",
                    position: "fixed",
                    left: 24,
                    top: 96,
                    width: 240,
                    zIndex: 1,
                }}
            >
                <Dimensions {...{ isEditingRef, handleInputChange }} />
                <Divider />
                <Text {...{ handleInputChange }} />
                <Divider />
                <Color inputRef={colorInputRef} placeholder="Color" attribute="fill" {...{ handleInputChange }} />
                <Divider />
                <Color inputRef={strokeInputRef} placeholder="Stroke" attribute="stroke" {...{ handleInputChange }} />
                <Divider />
                <Action {...{ fabricRef, pasteTimeRef, copiedObjectRef }} />
            </section>
        ),
        [attributes],
    ); // only re-render when attributes changes

    return memoizedContent;
}
