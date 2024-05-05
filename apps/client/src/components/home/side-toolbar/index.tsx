import { useMemo, useRef } from "react";
import { modifyShape } from "@/utils/shapes";

import Text from "./Text";
import Color from "./Color";
import Export from "./Export";
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
    // return <div className="bg-foreground fixed left-6 top-24 z-10 h-80 w-60 rounded">Pahlovi</div>;

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
            <section className="bg-foreground fixed left-6 top-24 z-10 h-[calc(100vh-12rem)] w-60 overflow-scroll rounded">
                <h3 className=" px-5 pt-4 text-xs uppercase">Design</h3>
                <span className="text-primary-grey-300 border-primary-grey-200 mt-3 border-b px-5 pb-4 text-xs">
                    Make changes to canvas as you like
                </span>

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
                    placeholder="color"
                    attributeType="fill"
                    handleInputChange={handleInputChange}
                />

                <Color
                    inputRef={strokeInputRef}
                    attribute={elementAttributes.stroke}
                    placeholder="stroke"
                    attributeType="stroke"
                    handleInputChange={handleInputChange}
                />

                <Export />
            </section>
        ),
        [elementAttributes],
    ); // only re-render when elementAttributes changes

    return memoizedContent;
}
