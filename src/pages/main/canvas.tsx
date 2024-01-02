import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import Canvas from "@/components/main/home/canvas";
import TopBar from "@/components/main/home/topbar";
import useCanvasStore from "@/hooks/useCanvasStore";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import Loader from "@/components/ui/loader";
import { GET_CANVAS } from "@/graphql/queries";
import { UPDATE_CANVAS } from "@/graphql/mutations";

export default function CanvasPage() {
    const params = useParams();
    const { loading, data, refetch } = useQuery(GET_CANVAS, { variables: { code: params?.id }, fetchPolicy: "no-cache" });
    const [updateCanvas, { loading: uploadLoading }] = useMutation(UPDATE_CANVAS);
    const { elements, image, updateElements } = useCanvasStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (data) updateElements(data?.canvas?.elements);
    }, [data, updateElements]);
    if (loading) return <Loader />;

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Failed to get canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Failed to get context");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        updateElements([]);
    };

    const handleUpdate = () => {
        updateCanvas({ variables: { code: params?.id, data: { image, elements } } })
            .then(() => refetch())
            .catch(({ message }) => toast.error(message));
    };

    return (
        <section className="space-y-6">
            <TopBar handleUpdate={handleUpdate} uploadLoading={uploadLoading} clearCanvas={clearCanvas} />
            <Canvas canvasRef={canvasRef} />
        </section>
    );
}
