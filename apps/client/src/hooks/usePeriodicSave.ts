import { useShapeState } from "@/hooks/zustand/useShapeState";
import { useAuthState } from "@/stores/auth/useAuthStore";
import * as fabric from "fabric";
import { isEqual } from "lodash";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export function usePeriodicSave({ fabricRef }: { fabricRef: React.RefObject<fabric.Canvas | null> }) {
    const { id } = useParams();
    const { user } = useAuthState();
    const { shapes, previous } = useShapeState();

    const saveShapes = () => {
        if (!fabricRef.current || !id || !user?.id || !shapes.length) return;

        toast.success("Save Shapes");
    };

    useEffect(() => {
        if (!id) return;

        // Initial shapes load
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const saveInterval = setInterval(() => saveShapes(), 600000);

        return () => clearInterval(saveInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shapes]);

    return { saveShapes, isUpToDate: isEqual(shapes, previous) };
}
