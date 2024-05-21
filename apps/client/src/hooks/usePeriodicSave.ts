import { isEqual } from "lodash";
import toast from "react-hot-toast";
import { db } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useShapeState } from "@/hooks/useShapeState";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export function usePeriodicSave() {
    const { id } = useParams();
    const navigator = useNavigate();
    const { user } = useAuthState();
    const { shapes } = useShapeState();
    const [roomId, setRoomId] = useState("");
    const [previous, setPrevious] = useState<fabric.Object[]>([]);

    const saveShapes = () => {
        if (!roomId || !user || !shapes.length) return;

        updateDoc(doc(db, "shapes", roomId), { shapes, updatedAt: Timestamp.now() })
            .then(() => setPrevious(shapes))
            .catch(() => toast.error("Failed To Update Shapes"));
    };

    useEffect(() => {
        if (!id) return;

        getDoc(doc(db, "shapes", id))
            .then((value) => setRoomId(value.id))
            .catch(() => navigator("/rooms"));
    }, []);

    useEffect(() => {
        const saveInterval = setInterval(() => saveShapes(), 600);

        return () => clearInterval(saveInterval);
    }, [shapes]);

    return { saveShapes, isUpToDate: isEqual(shapes, previous) };
}
