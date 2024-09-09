import { Divider, Sheet } from "@mui/joy";
import { modifyShape } from "@/utils/shapes";
import { useSearchParams } from "react-router-dom";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import Text from "@/components/home/floating-menu/Text";
import Colors from "@/components/home/floating-menu/Colors";
import Actions from "@/components/home/floating-menu/Actions";
import Opacity from "@/components/home/floating-menu/Opacity";
import type { Attributes, FloatingMenuProps } from "@/types";

export default function FloatingMenu({ fabricRef, copiedObjectRef }: FloatingMenuProps) {
    const { updateShape } = useShapeState();
    const [searchParams] = useSearchParams();
    const { currentObject, openedFloatingMenu, setOpenedFloatingMenu } = useCanvasState();

    const handleInputChange = (property: keyof Attributes, value: string) =>
        modifyShape({ fabricRef, room: searchParams.get("room"), property, value, updateShape });

    if (fabricRef?.current && currentObject) {
        console.log(currentObject.getCenterPoint());
        const { top: OTop, left: OLeft, width } = currentObject.getBoundingRect();
        console.log({ OTop, OLeft });

        const top = Math.max(10, OTop - 96);
        const left = Math.min(
            fabricRef?.current?.width! - (currentObject?.type === "i-text" ? 137.3 : 117.3),
            Math.max(currentObject?.type === "i-text" ? 137.3 : 117.3, OLeft + width / 2)
        );

        return (
            <Sheet
                onClick={(e) => e.stopPropagation()}
                sx={{ position: "absolute", zIndex: 1, p: 0.75, display: "flex", gap: 0.5 }}
                style={{ top, left, transform: "translateX(-50%)", height: 36, borderRadius: 24 }}
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
                <Actions {...{ fabricRef, copiedObjectRef }} />
            </Sheet>
        );
    } else {
        return null;
    }
}
