import { fabric } from "fabric";
import { isEqual } from "lodash";
import toast from "react-hot-toast";
import { db } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export function usePeriodicSave({ fabricRef }: { fabricRef: React.MutableRefObject<fabric.Canvas | null> }) {
    const { id } = useParams();
    const navigator = useNavigate();
    const { user } = useAuthState();
    const { setRefresh } = useCanvasState();
    const [roomId, setRoomId] = useState("");
    const { shapes, setShapes } = useShapeState();
    const [previous, setPrevious] = useState<fabric.Object[]>([]);

    const saveShapes = () => {
        if (!fabricRef.current || !roomId || !user?.id || !shapes.length) return;

        updateDoc(doc(db, "shapes", roomId), {
            shapes,
            image: fabricRef.current.toDataURL({ format: "png", quality: 0.75 }),
            updatedAt: Timestamp.now(),
        })
            .then(() => setPrevious(shapes))
            .catch(() => toast.error("Failed To Update Shapes"));
    };

    useEffect(() => {
        if (!id) return;

        getDoc(doc(db, "shapes", id))
            .then((value) => {
                setRoomId(value.id);
                const file = value.data();
                if (file?.shapes?.length) {
                    setShapes(file?.shapes);
                    setRefresh();
                }
            })
            .catch(() => navigator("/rooms"));
    }, []);

    useEffect(() => {
        const saveInterval = setInterval(() => saveShapes(), 600000);

        return () => clearInterval(saveInterval);
    }, [shapes]);

    return { saveShapes, isUpToDate: isEqual(shapes, previous) };
}
