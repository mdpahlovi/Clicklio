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
            <canvas ref={canvasRef} />

            {fabricRef.current ? (
                <>
                    <RemoteCursor />
                    <FloatingMenu canvas={fabricRef.current} />
                    <Toolbar canvas={fabricRef.current} selectedToolRef={selectedToolRef} />
                    <BottomToolbar canvas={fabricRef.current} />
                    <Conference />
                </>
            ) : null}
        </CanvasContainer>
    );
}
