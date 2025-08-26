import { type CanvasProps } from "@/types";
import RemoteCursor from "../ui/remote-cursor";
import BottomToolbar from "./bottom-toolbar";
import CanvasContainer from "./canvas-container";
import Conference from "./conference/index";
import FloatingMenu from "./floating-menu";
import Toolbar from "./toolbar";

export default function Canvas({ canvasRef, fabricRef, selectedToolRef, room, device }: CanvasProps) {
    return (
        <CanvasContainer>
            <canvas ref={canvasRef} />

            {fabricRef.current ? (
                <>
                    <FloatingMenu canvas={fabricRef.current} />
                    <Toolbar canvas={fabricRef.current} selectedToolRef={selectedToolRef} />
                    <BottomToolbar canvas={fabricRef.current} />
                    {room ? (
                        <>
                            <RemoteCursor room={room} />
                            {device ? <Conference room={room} device={device} /> : null}
                        </>
                    ) : null}
                </>
            ) : null}
        </CanvasContainer>
    );
}
