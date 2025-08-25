import { type CanvasProps } from "@/types";
import RemoteCursor from "../ui/remote-cursor";
import BottomToolbar from "./bottom-toolbar";
import CanvasContainer from "./canvas-container";
import Conference from "./conference";
import FloatingMenu from "./floating-menu";
import Toolbar from "./toolbar";

export default function Canvas({ canvasRef, fabricRef, selectedToolRef }: CanvasProps) {
    return (
        <CanvasContainer>
            <RemoteCursor />
            <FloatingMenu {...{ fabricRef }} />
            <Toolbar {...{ fabricRef, selectedToolRef }} />
            <BottomToolbar {...{ fabricRef }} />
            <Conference />

            <canvas ref={canvasRef} />
        </CanvasContainer>
    );
}
