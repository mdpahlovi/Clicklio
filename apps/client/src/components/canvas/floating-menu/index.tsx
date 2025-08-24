import Actions from "@/components/canvas/floating-menu/Actions";
import Colors from "@/components/canvas/floating-menu/Colors";
import Opacity from "@/components/canvas/floating-menu/Opacity";
import Text from "@/components/canvas/floating-menu/Text";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { Attributes, FloatingMenuProps } from "@/types";
import { handleCreateEvent } from "@/utils/event";
import { Divider, Sheet, styled } from "@mui/joy";
import * as fabric from "fabric";
import { useCallback, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function FloatingMenu({ fabricRef }: FloatingMenuProps) {
    const { createEvent } = useEventStore();
    const { currentObject, openedFloatingMenu, setOpenedFloatingMenu } = useCanvasState();

    const debouncedUpdate = useDebouncedCallback((object: fabric.Object) => {
        handleCreateEvent({
            action: "UPDATE",
            object,
            createEvent,
        });
    }, 150);

    const handleInputChange = useCallback((property: keyof Attributes, value: string) => {
        if (!fabricRef.current) return;
        const selectedElement = fabricRef.current.getActiveObject();
        if (!selectedElement || selectedElement?.type === "activeSelection") return;

        switch (property) {
            case "fontSize":
                selectedElement.set({ fontSize: Number(value) });
                break;
            case "fontFamily":
                selectedElement.set({ fontFamily: value });
                break;
            case "fontWeight":
                selectedElement.set({ fontWeight: value });
                break;
            case "fill":
                selectedElement.set({ fill: value ? value : null });
                break;
            case "stroke":
                selectedElement.set({ stroke: value ? value : null });
                break;
            case "strokeWidth":
                selectedElement.set({ strokeWidth: Number(value) });
                break;
            case "opacity":
                selectedElement.set({ opacity: Number(value) });
                break;
        }

        fabricRef.current.requestRenderAll();

        if (selectedElement?.uid && selectedElement?.uid !== "webcam") {
            debouncedUpdate(selectedElement);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const menuPosition = useMemo(() => {
        if (!fabricRef?.current || !currentObject) return {};

        const canvas = fabricRef.current;
        const canvasElement = canvas.getElement();
        const zoom = canvas.getZoom();
        const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];

        const boundingRect = currentObject.getBoundingRect();

        const viewportLeft = boundingRect.left * zoom + vpt[4];
        const viewportTop = boundingRect.top * zoom + vpt[5];
        const viewportWidth = boundingRect.width * zoom;

        const canvasRect = canvasElement.getBoundingClientRect();
        const canvasOffsetLeft = canvasRect.left + window.scrollX;
        const canvasOffsetTop = canvasRect.top + window.scrollY;
        const absoluteLeft = canvasOffsetLeft + viewportLeft + viewportWidth / 2;
        const absoluteTop = canvasOffsetTop + viewportTop - 80;

        const adjustedLeft = Math.max(100, Math.min(absoluteLeft, window.innerWidth - 100));
        const adjustedTop = Math.max(20, absoluteTop);

        return { left: adjustedLeft, top: adjustedTop };
    }, [currentObject?.top, currentObject?.left]);

    if (fabricRef?.current && currentObject) {
        return (
            <FloatingMenuSheet sx={menuPosition} onClick={(e) => e.stopPropagation()}>
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
                <Actions {...{ fabricRef, currentObject }} />
            </FloatingMenuSheet>
        );
    } else {
        return null;
    }
}

const FloatingMenuSheet = styled(Sheet)(() => ({
    position: "absolute",
    overflow: "hidden",
    zIndex: 10,
    borderRadius: 99,
    display: "flex",
    transform: "translateX(-50%) translateY(-100%)",
    "& > button": { borderRadius: 0 },
}));
