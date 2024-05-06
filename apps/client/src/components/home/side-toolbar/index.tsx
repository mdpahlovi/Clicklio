import { useMemo, useRef } from "react";
import { modifyShape } from "@/utils/shapes";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";

import Text from "./Text";
import Color from "./Color";
import Dimensions from "./Dimensions";
import Action from "./Action";

import type { Attributes, RightSidebarProps } from "@/types";

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
                style={{ maxHeight: "calc(100vh - 12rem)", overflowY: "scroll" }}
                className="bg-foreground fixed left-6 top-24 z-10 w-60 divide-y rounded"
            >
                <Dimensions {...{ isEditingRef, handleInputChange }} />
                <Text {...{ handleInputChange }} />
                <Color inputRef={colorInputRef} placeholder="Color" attribute="fill" {...{ handleInputChange }} />
                <Color inputRef={strokeInputRef} placeholder="Stroke" attribute="stroke" {...{ handleInputChange }} />
                <Action {...{ fabricRef, pasteTimeRef, copiedObjectRef }} />
            </section>
        ),
        [attributes],
    ); // only re-render when attributes changes

    return memoizedContent;
}
