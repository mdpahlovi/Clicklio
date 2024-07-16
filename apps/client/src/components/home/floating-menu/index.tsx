import { useState } from "react";
import { Divider, Sheet } from "@mui/joy";
import { modifyShape } from "@/utils/shapes";
import { useSearchParams } from "react-router-dom";
import { useShapeState } from "@/hooks/useShapeState";
import Text from "@/components/home/floating-menu/Text";
import Colors from "@/components/home/floating-menu/Colors";
import Actions from "@/components/home/floating-menu/Actions";
import Opacity from "@/components/home/floating-menu/Opacity";
import type { Attributes, FloatingMenuProps } from "@/types";

export default function FloatingMenu({ fabricRef, currentObject, copiedObjectRef, pasteTimeRef }: FloatingMenuProps) {
    const { updateShape } = useShapeState();
    const [searchParams] = useSearchParams();
    const [open, setOpen] = useState<{ [key: string]: boolean }>({});

    const handleOpenChange = (key: string) => () =>
        setOpen((prev) => (Object.keys(prev).includes(key) ? { [key]: !prev[key] } : { [key]: true }));

    const handleInputChange = (property: keyof Attributes, value: string) =>
        modifyShape({ fabricRef, room: searchParams.get("room"), property, value, updateShape });

    if (currentObject) {
        const { top: OTop, left: OLeft, width } = currentObject.getBoundingRect();

        const top = Math.min(window.innerHeight, Math.max(10, OTop - 96));
        const left = Math.min(window.innerWidth - 178, Math.max(166, OLeft + width / 2));

        return (
            <Sheet
                onClick={(e) => e.stopPropagation()}
                sx={{ position: "absolute", zIndex: 9999, p: 0.75, display: "flex", gap: 0.5 }}
                style={{ top, left, transform: "translateX(-50%)", height: 36, borderRadius: 24 }}
            >
                {currentObject?.type === "i-text" ? (
                    <Text open={!!open["text"]} onOpenChange={handleOpenChange("text")} {...{ currentObject, handleInputChange }} />
                ) : null}
                <Colors
                    name="fill"
                    open={!!open["fill"]}
                    onOpenChange={handleOpenChange("fill")}
                    {...{ currentObject, handleInputChange }}
                />
                <Colors
                    name="stroke"
                    open={!!open["stroke"]}
                    onOpenChange={handleOpenChange("stroke")}
                    {...{ currentObject, handleInputChange }}
                />
                <Opacity open={!!open["opacity"]} onOpenChange={handleOpenChange("opacity")} {...{ currentObject, handleInputChange }} />
                <Divider orientation="vertical" />
                <Actions {...{ fabricRef, pasteTimeRef, copiedObjectRef }} />
            </Sheet>
        );
    } else {
        return null;
    }
}
