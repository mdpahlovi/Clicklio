import Layout from "@/components/room/layout";
import Header from "@/components/room/header";
import FileCard from "@/components/room/file-card";
import Navigation from "@/components/room/navigation";
import { useBasicState } from "@/hooks/useBasicState";
import { Box, DialogTitle, Drawer, ModalClose, useColorScheme } from "@mui/joy";

export default function FilesExample() {
    const { mode } = useColorScheme();
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
                    <img src={`/logo/${mode}.png`} alt="" width={128} />
                </DialogTitle>
                <Box sx={{ px: 1 }}>
                    <Navigation />
                </Box>
            </Drawer>
        </>
    );
}
