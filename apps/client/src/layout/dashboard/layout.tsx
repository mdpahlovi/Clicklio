import { Box, Sheet } from "@mui/joy";

export function Root({ children }: React.PropsWithChildren) {
    return <Box sx={{ display: "flex", height: "calc(100dvh - 64px)", backgroundColor: "background.body" }}>{children}</Box>;
}

export function Header({ children }: React.PropsWithChildren) {
    return (
        <Sheet sx={{ px: 2, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>{children}</Sheet>
    );
}

export function SideNav({ children }: React.PropsWithChildren) {
    return <Sheet sx={{ p: 2, borderWidth: "0 1px 1px 0", display: { xs: "none", xl: "initial" }, width: 288 }}>{children}</Sheet>;
}
