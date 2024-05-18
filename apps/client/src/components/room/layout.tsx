import { Box, Sheet } from "@mui/joy";

function Root({ children }: React.PropsWithChildren) {
    return (
        <Box
            style={{ minHeight: "100vh", display: "grid", gridTemplateRows: "64px 1fr" }}
            sx={{ backgroundColor: "background.body", gridTemplateColumns: { xs: "1fr", md: "300px 1fr" } }}
        >
            {children}
        </Box>
    );
}

function Header({ children }: React.PropsWithChildren) {
    return (
        <Sheet
            component="header"
            style={{ position: "sticky", top: 0, zIndex: 1200, borderWidth: "0 0 1px" }}
            sx={{ px: 2, gap: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gridColumn: "1 / -1" }}
        >
            {children}
        </Sheet>
    );
}

function SideNav({ children }: React.PropsWithChildren) {
    return (
        <Sheet style={{ borderWidth: "0 1px 0 0" }} sx={{ p: 2, display: { xs: "none", md: "initial" } }}>
            {children}
        </Sheet>
    );
}

function Main({ children }: React.PropsWithChildren) {
    return (
        <Box
            component="main"
            height="max-content"
            sx={{ p: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: 2 }}
        >
            {children}
        </Box>
    );
}

export default { Root, Header, SideNav, Main };
