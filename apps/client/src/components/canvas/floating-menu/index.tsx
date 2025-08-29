import Actions from "@/components/canvas/floating-menu/Actions";
import Colors from "@/components/canvas/floating-menu/Colors";
import Opacity from "@/components/canvas/floating-menu/Opacity";
import Text from "@/components/canvas/floating-menu/Text";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { Attributes, FloatingMenuProps } from "@/types";
import { handleCreateEvent } from "@/utils/event";
import { Divider, Sheet, styled } from "@mui/joy";
import Konva from "konva";
import { useCallback, useMemo, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function FloatingMenu({ stage }: FloatingMenuProps) {
    const { createEvent } = useEventStore();
    const { currentObject, openedFloatingMenu, setOpenedFloatingMenu } = useCanvasState();
    const floatingMenuRef = useRef<HTMLDivElement | null>(null);

    const debouncedUpdate = useDebouncedCallback((object: Konva.Node) => {
        handleCreateEvent({
            action: "UPDATE",
            object,
            createEvent,
        });
    }, 150);

    const handleInputChange = useCallback(
        (property: keyof Attributes, value: string) => {
            const selectedElement = stage.findOne("#" + currentObject?.id());
            if (!selectedElement) return;

            switch (property) {
                case "fontSize":
                    (selectedElement as Konva.Text).fontSize(Number(value));
                    break;
                case "fontFamily":
                    (selectedElement as Konva.Text).fontFamily(value);
                    break;
                case "fontStyle":
                    (selectedElement as Konva.Text).fontStyle(value);
                    break;
                case "fill":
                    (selectedElement as Konva.Rect).fill(value ? value : null);
                    break;
                case "stroke":
                    (selectedElement as Konva.Rect).stroke(value ? value : null);
                    break;
                case "strokeWidth":
                    (selectedElement as Konva.Rect).strokeWidth(Number(value));
                    break;
                case "opacity":
                    (selectedElement as Konva.Rect).opacity(Number(value));
                    break;
            }

            if (selectedElement.id()) debouncedUpdate(selectedElement);
        },
        [currentObject?.id()],
    );

    const menuPosition = useMemo(() => {
        const floatingMenu = floatingMenuRef?.current;
        if (!currentObject || !floatingMenu) return;

        const objBoundRect = currentObject.getClientRect();

        const absoluteX = objBoundRect.x + objBoundRect.width / 2;
        const absoluteY = objBoundRect.y - 48 - 37.6;

        const menuHalfWidth = floatingMenu.clientWidth / 2 + 16;

        const adjustedX = Math.max(menuHalfWidth, Math.min(absoluteX, window.innerWidth - menuHalfWidth));
        const adjustedY = Math.max(16, absoluteY);

        return { left: adjustedX, top: adjustedY };
    }, [currentObject?.getClientRect()]);

    return (
        <FloatingMenuSheet ref={floatingMenuRef} sx={menuPosition || { display: "none" }} onClick={(e) => e.stopPropagation()}>
            {currentObject ? (
                <>
                    {currentObject?.className === "Text" ? (
                        <Text
                            open={!!openedFloatingMenu["text"]}
                            onOpenChange={() => setOpenedFloatingMenu("text")}
                            {...{ currentObject, handleInputChange }}
                        />
                    ) : null}
                    <Colors
                        name="fill"
                        open={!!openedFloatingMenu["fill"]}
                        onOpenChange={() => setOpenedFloatingMenu("fill")}
                        {...{ currentObject, handleInputChange }}
                    />
                    <Colors
                        name="stroke"
                        open={!!openedFloatingMenu["stroke"]}
                        onOpenChange={() => setOpenedFloatingMenu("stroke")}
                        {...{ currentObject, handleInputChange }}
                    />
                    <Opacity
                        open={!!openedFloatingMenu["opacity"]}
                        onOpenChange={() => setOpenedFloatingMenu("opacity")}
                        {...{ currentObject, handleInputChange }}
                    />
                    <Divider orientation="vertical" sx={{ mx: 0.5 }} />
                    <Actions {...{ stage, currentObject }} />
                </>
            ) : null}
        </FloatingMenuSheet>
    );
}

const FloatingMenuSheet = styled(Sheet)(() => ({
    position: "fixed",
    overflow: "hidden",
    zIndex: 20,
    borderRadius: 99,
    display: "flex",
    transform: "translateX(-50%)",
    "& > button": { borderRadius: 0 },
}));
