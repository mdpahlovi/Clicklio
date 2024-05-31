import { db } from "@/utils/firebase";
import { useQuery } from "react-query";
import { useBasicState } from "@/hooks/useBasicState";
import { collection, getDocs, Timestamp } from "firebase/firestore";

import Logo from "@/components/ui/logo";
import NewFile from "@/components/room/new-file";
import FileCard from "@/components/room/file-card";
import Navigation from "@/layout/dashboard/navigation";
import { Box, DialogTitle, Drawer, ModalClose } from "@mui/joy";

export type File = { name: string; shapes: fabric.Object[]; image: string; updatedAt: Timestamp };

export default function RoomPage() {
    const { sidebar, toggleSidebar } = useBasicState();

    const { data, refetch } = useQuery({
        queryKey: "shapes",
        queryFn: async () => {
            const shapes = await getDocs(collection(db, "shapes"));
            return shapes.docs.map((doc) => ({ id: doc.id, ...(doc.data() as File) }));
        },
    });

    return (
        <>
            <Box
                component="main"
                style={{ height: "max-content", display: "grid", gap: 16 }}
                sx={{ p: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" } }}
            >
                <NewFile />
                {data?.length ? data.map((file) => <FileCard key={file.id} {...{ file, refetch }} />) : null}
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
