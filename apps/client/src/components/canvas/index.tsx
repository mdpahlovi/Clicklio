import { type CanvasProps } from "@/types";
import RemoteCursor from "../ui/remote-cursor";
import BottomToolbar from "./bottom-toolbar";
import CanvasContainer from "./canvas-container";
import FloatingMenu from "./floating-menu";
import Toolbar from "./toolbar";

export default function Canvas({ stageRef, selectedToolRef }: CanvasProps) {
    return (
        <CanvasContainer>
            <RemoteCursor />
            <FloatingMenu {...{ stageRef }} />
            <Toolbar {...{ stageRef, selectedToolRef }} />
            <BottomToolbar {...{ stageRef }} />

            <div id="canvas" />
        </CanvasContainer>
    );
}
