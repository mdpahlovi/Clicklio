import Actions from "@/components/canvas/floating-menu/Actions";
import Colors from "@/components/canvas/floating-menu/Colors";
import Properties from "@/components/canvas/floating-menu/Properties";
import Text from "@/components/canvas/floating-menu/Text";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { CurrentObject, FloatingMenuProps } from "@/types";
import { handleCreateEvent } from "@/utils/event";
import { Divider, Sheet, styled } from "@mui/joy";
import Konva from "konva";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type Dropdown = "text" | "fill" | "stroke" | "opacity";

export default function FloatingMenu({ stage }: FloatingMenuProps) {
    const { createEvent } = useEventStore();
    const { currentObject } = useCanvasState();
    const [isOpen, setIsOpen] = useState<Dropdown | null>(null);
    const floatingMenuRef = useRef<HTMLDivElement | null>(null);

    const onOpenChange = useCallback((name: Dropdown) => {
        setIsOpen((prev) => (prev === name ? null : name));
    }, []);

    const debouncedUpdate = useDebouncedCallback((object: Konva.Node) => {
        handleCreateEvent({
            action: "UPDATE",
            object,
            createEvent,
        });
    }, 300);

    const handleInputChange = useCallback(
        (property: keyof CurrentObject, value: string) => {
            const selectedElement = stage.findOne("#" + currentObject?.id);
            if (!selectedElement) return;

            switch (property) {
                case "fontSize":
                    (selectedElement as Konva.Text).fontSize(Number(value));
                    break;
                case "fontFamily":
                    (selectedElement as Konva.Text).fontFamily(value);
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
                case "strokeStyle":
                    if (value === "solid") {
                        (selectedElement as Konva.Rect).dash([]);
                    } else {
                        (selectedElement as Konva.Rect).dash([10, 5]);
                    }
                    break;
                case "cornerRadius":
                    selectedElement.setAttr("cornerRadius", Number(value));
                    break;
                case "opacity":
                    (selectedElement as Konva.Rect).opacity(Number(value));
                    break;
            }

            if (selectedElement.id()) debouncedUpdate(selectedElement);
        },
        [currentObject?.id],
    );

    const menuPosition = useMemo(() => {
        const floatingMenu = floatingMenuRef?.current;
        if (!currentObject || !floatingMenu) return;

        const absoluteX = Number(currentObject.x || 0) + Number(currentObject.width || 0) / 2;
        const absoluteY = Number(currentObject.y || 0) - 48 - 37.6;

        const menuHalfWidth = floatingMenu.clientWidth / 2 + 16;

        const adjustedX = Math.max(menuHalfWidth, Math.min(absoluteX, window.innerWidth - menuHalfWidth));
        const adjustedY = Math.max(16, absoluteY);

        return { left: adjustedX, top: adjustedY };
    }, [currentObject?.x, currentObject?.y, currentObject?.width, currentObject?.height]);

    return (
        <FloatingMenuSheet ref={floatingMenuRef} sx={menuPosition || { display: "none" }} onClick={(e) => e.stopPropagation()}>
            {currentObject ? (
                <>
                    {currentObject?.type === "Text" ? (
                        <Text
                            open={isOpen === "text"}
                            onOpenChange={() => onOpenChange("text")}
                            {...{ currentObject, handleInputChange }}
                        />
                    ) : null}
                    <Colors
                        name="fill"
                        open={isOpen === "fill"}
                        onOpenChange={() => onOpenChange("fill")}
                        {...{ currentObject, handleInputChange }}
                    />
                    <Colors
                        name="stroke"
                        open={isOpen === "stroke"}
                        onOpenChange={() => onOpenChange("stroke")}
                        {...{ currentObject, handleInputChange }}
                    />
                    <Properties
                        open={isOpen === "opacity"}
                        onOpenChange={() => onOpenChange("opacity")}
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
