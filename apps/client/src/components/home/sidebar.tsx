import { GrPowerReset } from "react-icons/gr";
import { ImHome, ImUpload } from "react-icons/im";
import { Link, useLocation } from "react-router-dom";
import { useShapeState } from "@/hooks/useShapeState";
import { IconButton, Sheet, Tooltip } from "@mui/joy";
import { SidebarProps } from "@/types";

export default function Sidebar({ fabricRef, saveShapes, isUpToDate }: SidebarProps) {
    const { pathname } = useLocation();
    const { setShapes } = useShapeState();

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
                        }
                    }}
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
