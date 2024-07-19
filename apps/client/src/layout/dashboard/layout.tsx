import { Box, Sheet } from "@mui/joy";

function Root({ children }: React.PropsWithChildren) {
    return (
        <Box
            style={{ minHeight: "100vh", display: "grid", gridTemplateRows: "64px 1fr" }}
            sx={{ backgroundColor: "background.body", gridTemplateColumns: { xs: "1fr", xl: "300px 1fr" } }}
        >
            {children}
        </Box>
    );
}

function Header({ children }: React.PropsWithChildren) {
    return (
        <Sheet
            component="header"
            style={{ position: "sticky", top: 0, zIndex: 10, borderWidth: "0 0 1px" }}
            sx={{ px: 2, gap: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
            {children}
        </Sheet>
    );
}

function SideNav({ children }: React.PropsWithChildren) {
    return (
        <Sheet style={{ borderWidth: "0 1px 0 0" }} sx={{ p: 2, display: { xs: "none", xl: "initial" } }}>
            {children}
        </Sheet>
    );
}

export default { Root, Header, SideNav };
