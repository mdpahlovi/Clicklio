import { type CanvasProps } from "@/types";
import RemoteCursor from "../ui/remote-cursor";
import BottomToolbar from "./buttom-toolbar";
import CanvasContainer from "./canvas-container";
import FloatingMenu from "./floating-menu";
import Toolbar from "./toolbar";

export default function Canvas({ canvasRef, fabricRef, selectedToolRef }: CanvasProps) {
    return (
        <CanvasContainer>
            <RemoteCursor />
            <FloatingMenu {...{ fabricRef }} />
            <Toolbar {...{ fabricRef, selectedToolRef }} />
            <BottomToolbar {...{ fabricRef }} />

            <canvas ref={canvasRef} />
        </CanvasContainer>
    );
}
