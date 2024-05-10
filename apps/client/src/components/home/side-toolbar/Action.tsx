import { Button } from "@mui/joy";
import { Section, DoubleColumn } from "@/components/home/side-toolbar/components";

import { useShapeState } from "@/hooks/useShapeState";
import { handleCopy, handleDelete, handlePaste } from "@/utils/key-events";

type ActionProps = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    pasteTimeRef: React.MutableRefObject<number | null>;
    copiedObjectRef: React.MutableRefObject<fabric.Object[] | null>;
};

export default function Action({ fabricRef, pasteTimeRef, copiedObjectRef }: ActionProps) {
    const { setShape, deleteShape } = useShapeState();

    return (
        <Section title="Actions">
            <DoubleColumn>
                <Button
                    variant="outlined"
                    onClick={() => {
                        if (fabricRef.current) {
                            handleCopy(fabricRef.current, copiedObjectRef);
                            handlePaste(fabricRef.current, pasteTimeRef, copiedObjectRef, setShape);
                        }
                    }}
                >
                    Duplicate
                </Button>
                <Button
                    color="danger"
                    variant="outlined"
                    onClick={() => {
                        if (fabricRef.current) {
                            handleDelete(fabricRef.current, deleteShape);
                        }
                    }}
                >
                    Delete
                </Button>
            </DoubleColumn>
        </Section>
    );
}
