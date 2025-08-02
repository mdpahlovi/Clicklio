import { type CanvasProps } from "@/types";
import RemoteCursor from "../ui/remote-cursor";
import BottomToolbar from "./bottom-toolbar";
import CanvasContainer from "./canvas-container";
import Conference from "./conference/index";
import FloatingMenu from "./floating-menu";
import Toolbar from "./toolbar";

export default function Canvas({ stageRef, selectedToolRef, room, device }: CanvasProps) {
    return (
        <CanvasContainer>
            <div id="canvas" />

            {stageRef.current ? (
                <>
                    <FloatingMenu stage={stageRef.current} />
                    <Toolbar stage={stageRef.current} selectedToolRef={selectedToolRef} />
                    <BottomToolbar stage={stageRef.current} />
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
