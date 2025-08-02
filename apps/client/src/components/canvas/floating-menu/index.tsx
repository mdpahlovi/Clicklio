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

    const handleInputChange = useCallback((property: keyof Attributes, value: string) => {
        const selectedElement = stage.findOne("." + currentObject?.id());
        if (!selectedElement) return;

        switch (property) {
            case "fontSize":
                selectedElement.setAttr("fontSize", Number(value));
                break;
            case "fontFamily":
                selectedElement.setAttr("fontFamily", value);
                break;
            case "fontWeight":
                selectedElement.setAttr("fontWeight", value);
                break;
            case "fill":
                selectedElement.setAttr("fill", value ? value : null);
                break;
            case "stroke":
                selectedElement.setAttr("stroke", value ? value : null);
                break;
            case "strokeWidth":
                selectedElement.setAttr("strokeWidth", Number(value));
                break;
            case "opacity":
                selectedElement.setAttr("opacity", Number(value));
                break;
        }

        if (selectedElement?.id() && selectedElement?.id() !== "webcam") {
            debouncedUpdate(selectedElement);
        }
    }, []);

    const menuPosition = useMemo(() => {
        const floatingMenu = floatingMenuRef?.current;
        if (!currentObject || !floatingMenu) return;

        const zoom = stage.getZoom();
        const viewTransform = stage.viewportTransform;

        const objectX = currentObject.left * zoom + viewTransform[4];
        const objectY = currentObject.top * zoom + viewTransform[5];
        const objectWidth = currentObject.width * zoom;

        const absoluteX = objectX + objectWidth / 2;
        const absoluteY = objectY - 48 - 37.6;

        const menuHalfWidth = floatingMenu.clientWidth / 2 + 16;

        const adjustedX = Math.max(menuHalfWidth, Math.min(absoluteX, window.innerWidth - menuHalfWidth));
        const adjustedY = Math.max(16, absoluteY);

        return { left: adjustedX, top: adjustedY };
    }, [currentObject?.top, currentObject?.left]);

    return (
        <FloatingMenuSheet ref={floatingMenuRef} sx={menuPosition || { display: "none" }} onClick={(e) => e.stopPropagation()}>
            {currentObject ? (
                <>
                    {currentObject?.type === "i-text" ? (
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
    zIndex: 10,
    borderRadius: 99,
    display: "flex",
    transform: "translateX(-50%)",
    "& > button": { borderRadius: 0 },
}));
