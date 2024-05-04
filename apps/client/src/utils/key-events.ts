import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import { WindowKeyDown } from "@/types";

export const handleCopy = (canvas: fabric.Canvas) => {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
        // Serialize the selected objects
        const serializedObjects = activeObjects.map((obj) => obj.toObject());
        // Store the serialized objects in the clipboard
        localStorage.setItem("clipboard", JSON.stringify(serializedObjects));
    }

    return activeObjects;
};

export const handlePaste = (canvas: fabric.Canvas, setShape: (shape: fabric.Object) => void) => {
    if (!canvas || !(canvas instanceof fabric.Canvas)) {
        console.error("Invalid canvas object. Aborting paste operation.");
        return;
    }

    // Retrieve serialized objects from the clipboard
    const clipboardData = localStorage.getItem("clipboard");

    if (clipboardData) {
        try {
            const parsedObjects = JSON.parse(clipboardData);
            parsedObjects.forEach((objData: fabric.Object) => {
                // convert the plain javascript objects retrieved from localStorage into fabricjs objects (deserialization)
                fabric.util.enlivenObjects(
                    [objData],
                    (enlivenedObjects: fabric.Object[]) => {
                        enlivenedObjects.forEach((enlivenedObj) => {
                            // Offset the pasted objects to avoid overlap with existing objects
                            enlivenedObj.set({
                                left: enlivenedObj.left! + 20,
                                top: enlivenedObj.top! + 20,

                                // @ts-ignore
                                objectId: uuidv4(),
                                fill: "#000000",
                            });

                            canvas.add(enlivenedObj);
                            // sync in storage
                            // @ts-ignore
                            if (enlivenedObj?.objectId) setShape(enlivenedObj);
                        });
                        canvas.renderAll();
                    },
                    "fabric",
                );
            });
        } catch (error) {
            console.error("Error parsing clipboard data:", error);
        }
    }
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
        });
    }

    canvas.discardActiveObject();
    canvas.requestRenderAll();
};

// create a handleKeyDown function that listen to different keydown events
export const handleKeyDown = ({ e, canvas, setShape, deleteShape }: WindowKeyDown) => {
    // Check if the key pressed is ctrl/cmd + c (copy)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 67) {
        handleCopy(canvas);
    }

    // Check if the key pressed is ctrl/cmd + v (paste)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 86) {
        handlePaste(canvas, setShape);
    }

    // Check if the key pressed is delete (delete)
    if (canvas && e.keyCode === 46) {
        handleDelete(canvas, deleteShape);
    }

    // check if the key pressed is ctrl/cmd + x (cut)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 88) {
        handleCopy(canvas);
        handleDelete(canvas, deleteShape);
    }
};
