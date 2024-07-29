import { fabric } from "fabric";
import { db } from "@/utils/firebase";
import { useQuery } from "react-query";
import { useAuthState } from "@/hooks/useAuthState";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";

import NewFile from "@/components/room/new-file";
import FileCard from "@/components/room/file-card";
import FileLoader from "@/components/room/file-loader";

export type File = { name: string; shapes: fabric.Object[]; image: string; updatedAt: Timestamp };

export default function RoomPage() {
    const { user } = useAuthState();

    const { data, isLoading, refetch } = useQuery({
        queryKey: "shapes",
        queryFn: async () => {
            const shapes = await getDocs(query(collection(db, "shapes"), where("user", "==", user?.id)));
            return shapes.docs.map((doc) => ({ id: doc.id, ...(doc.data() as File) }));
        },
    });

    return (
        <main className="fileTemplateColumn" style={{ gap: 16, padding: 16 }}>
            <NewFile />
            {isLoading ? <FileLoader /> : data?.length ? data.map((file, idx) => <FileCard key={idx} {...{ file, refetch }} />) : null}
            <FileLoader sx={{ visibility: "hidden" }} />
        </main>
    );
}
