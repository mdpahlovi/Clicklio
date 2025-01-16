import { Typography } from "@mui/joy";
import * as fabric from "fabric";
import { Timestamp } from "firebase/firestore";

export type File = { name: string; shapes: fabric.FabricObject[]; image: string; updatedAt: Timestamp };

export default function RoomPage() {
    // const { data, isLoading, refetch } = useQuery({
    //     queryKey: "shapes",
    //     queryFn: async () => {
    //         const shapes = await getDocs(query(collection(db, "shapes"), where("user", "==", user?.id)));
    //         return shapes.docs.map((doc) => ({ id: doc.id, ...(doc.data() as File) }));
    //     },
    // });

    return (
        // <main className="fileTemplateColumn" style={{ gap: 16, padding: 16 }}>
        //     <NewFile />
        //     {isLoading ? <FileLoader /> : data?.length ? data.map((file, idx) => <FileCard key={idx} {...{ file, refetch }} />) : null}
        //     <FileLoader sx={{ visibility: "hidden" }} />
        // </main>

        <div style={{ width: "100%", display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Typography>Sorry! Currently Private Room Service Not available</Typography>
        </div>
    );
}
