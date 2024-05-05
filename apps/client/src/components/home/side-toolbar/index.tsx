import { useMemo, useRef } from "react";
import { modifyShape } from "@/utils/shapes";

import Text from "./Text";
import Color from "./Color";
import Dimensions from "./Dimensions";
import { useShapeState } from "@/hooks/useShapeState";

import type { RightSidebarProps } from "@/types";

export default function SideToolbar({
    elementAttributes,
    setElementAttributes,
    fabricRef,
    activeObjectRef,
    isEditingRef,
}: RightSidebarProps) {
    const colorInputRef = useRef(null);
    const strokeInputRef = useRef(null);
    const { updateShape } = useShapeState();

    const handleInputChange = (property: string, value: string) => {
        if (!fabricRef.current) return;
        if (!isEditingRef.current) isEditingRef.current = true;

        setElementAttributes((prev) => ({ ...prev, [property]: value }));

        modifyShape({ fabricRef, property, value, activeObjectRef, updateShape });
    };

    // memoize the content of the right sidebar to avoid re-rendering on every mouse actions
    const memoizedContent = useMemo(
        () => (
            <section
                style={{ maxHeight: "calc(100vh - 12rem)", overflowY: "scroll" }}
                className="bg-foreground fixed left-6 top-24 z-10 w-60 divide-y rounded"
            >
                <Dimensions
                    isEditingRef={isEditingRef}
                    width={elementAttributes.width}
                    height={elementAttributes.height}
                    handleInputChange={handleInputChange}
                />

                <Text
                    fontFamily={elementAttributes.fontFamily}
                    fontSize={elementAttributes.fontSize}
                    fontWeight={elementAttributes.fontWeight}
                    handleInputChange={handleInputChange}
                />

                <Color
                    inputRef={colorInputRef}
                    attribute={elementAttributes.fill}
                    placeholder="Color"
                    attributeType="fill"
                    handleInputChange={handleInputChange}
                />

                <Color
                    inputRef={strokeInputRef}
                    attribute={elementAttributes.stroke}
                    placeholder="Stroke"
                    attributeType="stroke"
                    handleInputChange={handleInputChange}
                />
            </section>
        ),
        [elementAttributes],
    ); // only re-render when elementAttributes changes

    return memoizedContent;
}
