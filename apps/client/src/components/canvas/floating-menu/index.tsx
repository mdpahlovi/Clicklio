import Actions from "@/components/canvas/floating-menu/Actions";
import Colors from "@/components/canvas/floating-menu/Colors";
import Opacity from "@/components/canvas/floating-menu/Opacity";
import Text from "@/components/canvas/floating-menu/Text";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { Attributes, FloatingMenuProps } from "@/types";
import { modifyShape } from "@/utils/shapes";
import { Divider, Sheet, styled } from "@mui/joy";

export default function FloatingMenu({ fabricRef }: FloatingMenuProps) {
    const { createEvent } = useEventStore();
    const { currentObject, openedFloatingMenu, setOpenedFloatingMenu } = useCanvasState();

    const handleInputChange = (property: keyof Attributes, value: string) =>
        modifyShape({
            fabricRef,
            property,
            value,
            createEvent,
        });

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
