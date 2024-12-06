import { socket } from "@/utils/socket";
import { GrPowerReset } from "react-icons/gr";
import { ImHome, ImUpload } from "react-icons/im";
import { useShapeState } from "@/hooks/useShapeState";
import { IconButton, Sheet, Tooltip } from "@mui/joy";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import type { SidebarProps } from "@/types";

export default function Sidebar({ fabricRef, saveShapes, isUpToDate }: SidebarProps) {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const { shapes, setShapes } = useShapeState();

    const room = searchParams.get("room");

    return (
        <Sheet
            style={{ width: 64, height: "calc(100vh - 97px)", borderWidth: "0 1px 0 0" }}
            sx={{ py: 2, display: { xs: "none", sm: "flex" }, flexDirection: "column", alignItems: "center", gap: 1.5 }}
        >
            <Link to="/rooms">
                <IconButton variant="solid" color="primary">
                    <ImHome />
                </IconButton>
            </Link>

            <Tooltip title="Reset Canvas" placement="right">
                <IconButton
                    color="danger"
                    onClick={() => {
                        if (fabricRef.current) {
                            setShapes([]);
                            fabricRef.current.clear();
                            if (room) socket.emit("reset:canvas", { room, status: true });
                        }
                    }}
                    disabled={!shapes?.length}
                >
                    <GrPowerReset />
                </IconButton>
            </Tooltip>

            {pathname !== "/" ? (
                <IconButton onClick={saveShapes} disabled={isUpToDate}>
                    <ImUpload />
                </IconButton>
            ) : null}
        </Sheet>
    );
}
