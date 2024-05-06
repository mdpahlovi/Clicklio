import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import { WindowKeyDown } from "@/types";
import { socket } from "@/utils/socket";

export const handleCopy = (canvas: fabric.Canvas, copiedObjectRef: React.MutableRefObject<fabric.Object[] | null>) => {
    const activeObjects = canvas.getActiveObjects();

    // set copied objects in the copiedObjectRef
    if (activeObjects.length > 0) {
        // @ts-ignore
        copiedObjectRef.current = activeObjects.map((object) => object.toJSON());
    }
};

export const handlePaste = (
    canvas: fabric.Canvas,
    pasteTimeRef: React.MutableRefObject<number | null>,
    copiedObjectRef: React.MutableRefObject<fabric.Object[] | null>,
    setShape: (shape: fabric.Object) => void,
) => {
    // if no pasteTime or copiedObject, return
    if (!pasteTimeRef.current || !copiedObjectRef.current || !copiedObjectRef.current.length) return;

    copiedObjectRef.current.forEach((object) => {
        // convert the plain javascript objects into fabric.js objects (deserialization)
        fabric.util.enlivenObjects(
            [object],
            (enlivenedObjects: fabric.Object[]) => {
                enlivenedObjects.forEach((enlivenedObj) => {
                    // Offset the pasted objects to avoid overlap with existing objects
                    enlivenedObj.set({
                        top: enlivenedObj.top! + 20 * pasteTimeRef.current!,
                        left: enlivenedObj.left! + 20 * pasteTimeRef.current!,

                        // @ts-ignore
                        objectId: uuidv4(),
                    });

                    canvas.add(enlivenedObj);
                    // sync in storage
                    // @ts-ignore
                    if (enlivenedObj?.objectId) {
                        // @ts-ignore
                        setShape({ objectId: enlivenedObj.objectId, ...enlivenedObj.toJSON() });
                        // @ts-ignore
                        socket.emit("set:shape", { objectId: enlivenedObj.objectId, ...enlivenedObj.toJSON() });
                    }
                });
                canvas.renderAll();
            },
            "fabric",
        );
    });

    pasteTimeRef.current = pasteTimeRef.current + 1;
};

export const handleDelete = (canvas: fabric.Canvas, deleteShape: (id: string) => void) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;

    if (activeObjects.length > 0) {
        activeObjects.forEach((object) => {
            canvas.remove(object);
            // sync in storage
            // @ts-ignore
            deleteShape(object.objectId);
            // @ts-ignore
            socket.emit("delete:shape", { objectId: object.objectId });
        });
    }

    canvas.discardActiveObject();
    canvas.requestRenderAll();
};

// create a handleKeyDown function that listen to different keydown events
export const handleKeyDown = ({ e, canvas, pasteTimeRef, copiedObjectRef, setShape, deleteShape }: WindowKeyDown) => {
    // Check if the key pressed is ctrl/cmd + c (copy)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 67) {
        handleCopy(canvas, copiedObjectRef);
    }

    // Check if the key pressed is ctrl/cmd + v (paste)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 86) {
        handlePaste(canvas, pasteTimeRef, copiedObjectRef, setShape);
    }

    // Check if the key pressed is delete (delete)
    if (canvas && e.keyCode === 46) {
        handleDelete(canvas, deleteShape);
    }

    // check if the key pressed is ctrl/cmd + x (cut)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 88) {
        handleCopy(canvas, copiedObjectRef);
        handleDelete(canvas, deleteShape);
    }
};
