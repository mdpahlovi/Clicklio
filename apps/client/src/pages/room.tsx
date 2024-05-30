import { db } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { useBasicState } from "@/hooks/useBasicState";
import { collection, getDocs, Timestamp } from "firebase/firestore";

import Logo from "@/components/ui/logo";
import NewFile from "@/components/room/new-file";
import FileCard from "@/components/room/file-card";
import Navigation from "@/layout/dashboard/navigation";
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
            <Box
                component="main"
                style={{ height: "max-content", display: "grid", gap: 16 }}
                sx={{ p: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" } }}
            >
                <NewFile />
                {files?.length ? files.map((file) => <FileCard key={file.id} {...file} {...{ refresh, setRefresh }} />) : null}
            </Box>

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
