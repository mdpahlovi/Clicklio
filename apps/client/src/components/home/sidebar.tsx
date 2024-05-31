import { IconButton, Sheet } from "@mui/joy";
import { ImHome, ImUpload } from "react-icons/im";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ saveShapes, isUpToDate }: { saveShapes: () => void; isUpToDate: boolean }) {
    const { pathname } = useLocation();

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

            {pathname !== "/" ? (
                <IconButton onClick={saveShapes} disabled={isUpToDate}>
                    <ImUpload />
                </IconButton>
            ) : null}
        </Sheet>
    );
}
