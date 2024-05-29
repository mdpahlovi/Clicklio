import { db } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { useBasicState } from "@/hooks/useBasicState";
import { collection, getDocs, Timestamp } from "firebase/firestore";

import Logo from "@/components/ui/logo";
import Layout from "@/components/room/layout";
import Header from "@/components/room/header";
import NewFile from "@/components/room/new-file";
import FileCard from "@/components/room/file-card";
import Navigation from "@/components/room/navigation";
import { Box, DialogTitle, Drawer, ModalClose } from "@mui/joy";

export type File = { id: string; name: string; shapes: fabric.Object[]; image: string; updatedAt: Timestamp };

export default function RoomPage() {
    const [files, setFiles] = useState<File[]>();
    const [refresh, setRefresh] = useState(false);
    const { sidebar, toggleSidebar } = useBasicState();

    useEffect(() => {
        getDocs(collection(db, "shapes"))
            // @ts-ignore
            .then(({ docs }) => setFiles(docs.map((doc) => ({ id: doc.id, ...doc.data() }))))
            .catch(() => console.log("Error Get All Document"));
    }, [refresh]);

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
                    <NewFile />
                    {files?.length ? files.map((file) => <FileCard key={file.id} {...file} {...{ refresh, setRefresh }} />) : null}
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
