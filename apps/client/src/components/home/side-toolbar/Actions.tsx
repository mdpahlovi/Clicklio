import { Button } from "@mui/joy";
import { useSearchParams } from "react-router-dom";
import { useShapeState } from "@/hooks/useShapeState";
import { Section } from "@/components/home/side-toolbar/components";
import { handleCopy, handleDelete, handlePaste } from "@/utils/key-events";
import type { ActionsProps } from "@/types";

export default function Actions({ fabricRef, pasteTimeRef, copiedObjectRef }: ActionsProps) {
    const [searchParams] = useSearchParams();
    const { setShape, deleteShape } = useShapeState();

    return (
        <Section title="Actions">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        if (fabricRef.current) {
                            handleCopy(fabricRef.current, copiedObjectRef);
                            handlePaste(fabricRef.current, searchParams.get("room"), pasteTimeRef, copiedObjectRef, setShape);
                        }
                    }}
                    disabled={!fabricRef.current || !fabricRef.current.getActiveObject()}
                >
                    Duplicate
                </Button>
                <Button
                    color="danger"
                    variant="outlined"
                    onClick={() => (fabricRef.current ? handleDelete(fabricRef.current, searchParams.get("room"), deleteShape) : null)}
                    disabled={!fabricRef.current || !fabricRef.current.getActiveObject()}
                >
                    Delete
                </Button>
            </div>
        </Section>
    );
}
