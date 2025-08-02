import { useEventStore } from "@/stores/canvas/useEventStore";
import type { ShapeEvent } from "@/types/event";
import axios from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

type PersistEventPayload = { photo: string; events: ShapeEvent[] };

export function usePersist({ stageRef }: { stageRef: React.RefObject<Konva.Stage | null> }) {
    const { id } = useParams<{ id: string }>();
    const { unPersistEvent, onPersistEvent } = useEventStore();
    const timeoutRef = useRef<number | null>(null);

    const { mutate: persistEvents } = useMutation({
        mutationFn: (data: PersistEventPayload) => axios.patch(`/room/${id}`, data),
        onSuccess: (response) => onPersistEvent(response.data),
    });

    useEffect(() => {
        if (!unPersistEvent?.length) return;

        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(async () => {
            const photo = stageRef.current?.toDataURL({ mimeType: "image/png" }) || "";
            persistEvents({ photo, events: unPersistEvent });
        }, 10000);

        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unPersistEvent?.length]);

    return { persistEvents };
}
