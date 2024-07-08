import { fabric } from "fabric";
import { db } from "@/utils/firebase";
import { useQuery } from "react-query";
import { useBasicState } from "@/hooks/useBasicState";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";

import Logo from "@/components/ui/logo";
import NewFile from "@/components/room/new-file";
import FileCard from "@/components/room/file-card";
import FileLoader from "@/components/room/file-loader";
import Navigation from "@/layout/dashboard/navigation";
import { Box, DialogTitle, Drawer, ModalClose } from "@mui/joy";
import { useAuthState } from "@/hooks/useAuthState";

export type File = { name: string; shapes: fabric.Object[]; image: string; updatedAt: Timestamp };

export default function RoomPage() {
    const { user } = useAuthState();
    const { sidebar, toggleSidebar } = useBasicState();

    const { data, isLoading, refetch } = useQuery({
        queryKey: "shapes",
        queryFn: async () => {
            const shapes = await getDocs(query(collection(db, "shapes"), where("user", "==", user?.id)));
            return shapes.docs.map((doc) => ({ id: doc.id, ...(doc.data() as File) }));
        },
    });

    return (
        <>
            <Box component="main" className="fileTemplateColumn" sx={{ gap: 2, p: 2 }}>
                <NewFile />
                {isLoading ? <FileLoader /> : data?.length ? data.map((file, idx) => <FileCard key={idx} {...{ file, refetch }} />) : null}
                <FileLoader sx={{ visibility: "hidden" }} />
            </Box>

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
