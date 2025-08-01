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
import { useCallback } from "react";
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
    }, 300);

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

    if (fabricRef?.current && currentObject) {
        return (
            <FloatingMenuSheet onClick={(e) => e.stopPropagation()}>
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
                <Divider orientation="vertical" />
                <Actions {...{ fabricRef, currentObject }} />
            </FloatingMenuSheet>
        );
    } else {
        return null;
    }
}

const FloatingMenuSheet = styled(Sheet)(() => ({
    position: "absolute",
    top: 16,
    left: "50%",
    zIndex: 10,
    padding: 4,
    borderRadius: 99,
    display: "flex",
    gap: 4,
    transform: "translateX(-50%)",
}));
