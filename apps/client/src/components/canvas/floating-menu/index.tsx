import Actions from "@/components/canvas/floating-menu/Actions";
import Colors from "@/components/canvas/floating-menu/Colors";
import Opacity from "@/components/canvas/floating-menu/Opacity";
import Text from "@/components/canvas/floating-menu/Text";
import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { Attributes, FloatingMenuProps } from "@/types";
import { modifyShape } from "@/utils/shapes";
import { Divider, Sheet } from "@mui/joy";

export default function FloatingMenu({ fabricRef }: FloatingMenuProps) {
    const { addEvent } = useEventStore();
    const { currentObject, openedFloatingMenu, setOpenedFloatingMenu } = useCanvasState();

    const handleInputChange = (property: keyof Attributes, value: string) =>
        modifyShape({
            fabricRef,
            property,
            value,
            addEvent,
        });

    if (fabricRef?.current && currentObject) {
        return (
            <Sheet
                onClick={(e) => e.stopPropagation()}
                sx={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", p: 0.75, gap: 0.5 }}
                style={{ zIndex: 10, display: "flex", height: 36, borderTopWidth: 0, borderRadius: "0 0 24px 24px" }}
            >
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
            </Sheet>
        );
    } else {
        return null;
    }
}
