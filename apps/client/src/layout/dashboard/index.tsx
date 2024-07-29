import Logo from "@/components/ui/logo";
import { Outlet } from "react-router-dom";
import Layout from "@/layout/dashboard/layout";
import Header from "@/layout/dashboard/header";
import { useBasicState } from "@/hooks/useBasicState";
import Navigation from "@/layout/dashboard/navigation";
import { Box, DialogTitle, Drawer, ModalClose } from "@mui/joy";

export default function DashboardLayout() {
    const { sidebar, toggleSidebar } = useBasicState();

    return (
        <>
            <Layout.Root>
                <Layout.Header>
                    <Header />
                </Layout.Header>
                <Layout.SideNav>
                    <Navigation />
                </Layout.SideNav>
                <Outlet />
            </Layout.Root>

            {/* Mobile SideBar */}
            <Drawer open={sidebar} onClose={toggleSidebar} sx={{ display: { xl: "none" } }}>
                <ModalClose />
                <DialogTitle>
                    <Logo />
                </DialogTitle>
                <Box sx={{ px: 1 }}>
                    <Navigation />
                </Box>
            </Drawer>
        </>
    );
}
