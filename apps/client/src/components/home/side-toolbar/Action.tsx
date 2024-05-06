import { Button } from "@/components/ui/button";
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
        <div className="flex flex-col gap-2.5 p-4">
            <p className="text-sm">Actions</p>
            <div className="grid grid-cols-2 gap-2.5">
                <Button
                    variant="outline"
                    size="sm"
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
                    size="sm"
                    variant="outline"
                    className="border-error text-error hover:bg-error"
                    onClick={() => fabricRef.current && handleDelete(fabricRef.current, deleteShape)}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
