import { CanvasProps } from "@/types";
import RemoteCursor from "../ui/remote-cursor";
import BottomToolbar from "./buttom-toolbar";
import CanvasContainer from "./canvas-container";
import FloatingMenu from "./floating-menu";
// import RightSidebar from "./right-sidebar";
import IncomingCall from "./right-sidebar/incoming-call";
import Sidebar from "./sidebar";
import Toolbar from "./toolbar";

export default function Canvas({ canvasRef, fabricRef, selectedToolRef }: CanvasProps) {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar {...{ fabricRef }} />
            <CanvasContainer>
                <RemoteCursor />
                {/* <RightSidebar /> */}
                <FloatingMenu {...{ fabricRef }} />
                <Toolbar {...{ fabricRef, selectedToolRef }} />
                <BottomToolbar {...{ fabricRef }} />

                <canvas ref={canvasRef} />
            </CanvasContainer>
            <IncomingCall />
        </div>
    );
}
