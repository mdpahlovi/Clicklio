import Logo from "@/components/ui/logo";
import Layout from "@/components/room/layout";
import Header from "@/components/room/header";
import FileCard from "@/components/room/file-card";
import Navigation from "@/components/room/navigation";
import { useBasicState } from "@/hooks/useBasicState";
import { Box, DialogTitle, Drawer, ModalClose } from "@mui/joy";

export default function RoomPage() {
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
                <Layout.Main>
                    <FileCard />
                    <FileCard />
                    <FileCard />
                    <FileCard />
                </Layout.Main>
            </Layout.Root>

            <Drawer open={sidebar} onClose={toggleSidebar} sx={{ display: { md: "none" } }}>
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
