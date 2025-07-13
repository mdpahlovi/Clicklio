import Logo from "@/components/ui/logo";
import Header from "@/layout/dashboard/header";
import * as Layout from "@/layout/dashboard/layout";
import Navigation from "@/layout/dashboard/navigation";
import { Box, DialogTitle, Drawer, ModalClose } from "@mui/joy";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Layout.Root>
                <Layout.Header>
                    <Header setIsOpen={setIsOpen} />
                </Layout.Header>
                <Layout.SideNav>
                    <Navigation />
                </Layout.SideNav>
                <Outlet />
            </Layout.Root>

            {/* Mobile SideBar */}
            <Drawer open={isOpen} onClose={() => setIsOpen(false)} sx={{ display: { xl: "none" } }}>
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
