import * as fabric from "fabric";
import { isEqual } from "lodash";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { db } from "@/utils/firebase";
import { useAuthState } from "@/hooks/useAuthState";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export function usePeriodicSave({ fabricRef }: { fabricRef: React.RefObject<fabric.Canvas | null> }) {
    const { id } = useParams();
    const { user } = useAuthState();
    const navigator = useNavigate();
    const { setRefresh } = useCanvasState();
    const { shapes, setShapes, previous, setPrevious } = useShapeState();

    const saveShapes = () => {
        if (!fabricRef.current || !id || !user?.id || !shapes.length) return;

        updateDoc(doc(db, "shapes", id), {
            shapes,
            image: fabricRef.current.toDataURL({ format: "png", quality: 0.75, multiplier: 1 }),
            updatedAt: Timestamp.now(),
        })
            .then(() => setPrevious(shapes))
            .catch(() => toast.error("Failed To Update Shapes"));
    };

    useEffect(() => {
        if (!id) return;

        getDoc(doc(db, "shapes", id))
            .then((value) => {
                const file = value.data();
                if (file?.shapes?.length) {
                    setShapes(file?.shapes);
                    setPrevious(file?.shapes);
                    setRefresh();
                }
            })
            .catch(() => navigator("/rooms"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const saveInterval = setInterval(() => saveShapes(), 600000);

        return () => clearInterval(saveInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shapes]);

    return { saveShapes, isUpToDate: isEqual(shapes, previous) };
}
