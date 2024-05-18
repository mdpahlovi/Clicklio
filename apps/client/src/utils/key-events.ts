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
    room: string | null,
    pasteTimeRef: React.MutableRefObject<number | null>,
    copiedObjectRef: React.MutableRefObject<fabric.Object[] | null>,
    setShape: (shape: fabric.Object) => void
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
                        socket.emit("set:shape", { room, objectId: enlivenedObj.objectId, ...enlivenedObj.toJSON() });
                    }
                });
                canvas.requestRenderAll();
            },
            "fabric"
        );
    });

    pasteTimeRef.current = pasteTimeRef.current + 1;
};

export const handleDelete = (canvas: fabric.Canvas, room: string | null, deleteShape: (id: string) => void) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;

    if (activeObjects.length > 0) {
        activeObjects.forEach((object) => {
            canvas.remove(object);
            // sync in storage
            // @ts-ignore
            deleteShape(object.objectId);
            // @ts-ignore
            socket.emit("delete:shape", { room, objectId: object.objectId });
        });
    }

    canvas.discardActiveObject();
    canvas.requestRenderAll();
};

// create a handleKeyDown function that listen to different keydown events
export const handleKeyDown = ({
    e,
    canvas,
    roomRef,
    isEditingRef,
    pasteTimeRef,
    copiedObjectRef,
    setShape,
    deleteShape,
    undo,
    redo,
    setTool,
    setZoom,
    setMode,
}: WindowKeyDown) => {
    const zoom = canvas?.getZoom();
    const light = localStorage.getItem("joy-mode") === "light";

    // Check if the key pressed is 1
    if (e.keyCode === 49 && !isEditingRef.current) setTool("panning");
    // Check if the key pressed is 2
    if (e.keyCode === 50 && !isEditingRef.current) setTool("select");
    // Check if the key pressed is 3
    if (e.keyCode === 51 && !isEditingRef.current) setTool("rect");
    // Check if the key pressed is 4
    if (e.keyCode === 52 && !isEditingRef.current) setTool("triangle");
    // Check if the key pressed is 5
    if (e.keyCode === 53 && !isEditingRef.current) setTool("circle");
    // Check if the key pressed is 6
    if (e.keyCode === 54 && !isEditingRef.current) setTool("line");
    // Check if the key pressed is 7
    if (e.keyCode === 55 && !isEditingRef.current) setTool("path-5");
    // Check if the key pressed is 8
    if (e.keyCode === 56 && !isEditingRef.current) setTool("i-text");
    // Check if the key pressed is 9
    if (e.keyCode === 57 && !isEditingRef.current) setTool("image");
    // Check if the key pressed is 0
    if (e.keyCode === 48 && !isEditingRef.current) setTool("eraser");

    // Check if the key pressed is ctrl/cmd + +
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 107) {
        e.preventDefault();
        if (zoom && Number(zoom.toFixed(1)) <= 10) {
            setZoom(zoom + 0.1);
            canvas.setZoom(zoom + 0.1);
        }
    }
    // Check if the key pressed is ctrl/cmd + -
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 109) {
        e.preventDefault();
        if (zoom && Number(zoom.toFixed(1)) >= 0.1) {
            setZoom(zoom - 0.1);
            canvas.setZoom(zoom - 0.1);
        }
    }
    // Check if the key pressed is ctrl/cmd + R
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 82) {
        e.preventDefault();
        setZoom(1);
        canvas.setZoom(1);
    }
    // Check if the key pressed is ctrl/cmd + D
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 68) {
        setMode(light ? "dark" : "light");
    }

    // Check if the key pressed is ctrl/cmd + c (copy)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 67) {
        handleCopy(canvas, copiedObjectRef);
    }
    // Check if the key pressed is ctrl/cmd + v (paste)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 86) {
        handlePaste(canvas, roomRef.current, pasteTimeRef, copiedObjectRef, setShape);
    }
    // Check if the key pressed is ctrl/cmd + D (paste)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 68) {
        e.preventDefault();
        handleCopy(canvas, copiedObjectRef);
        handlePaste(canvas, roomRef.current, pasteTimeRef, copiedObjectRef, setShape);
    }
    // Check if the key pressed is delete (delete)
    if (canvas && e.keyCode === 46) {
        handleDelete(canvas, roomRef.current, deleteShape);
    }
    // check if the key pressed is ctrl/cmd + x (cut)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 88) {
        handleCopy(canvas, copiedObjectRef);
        handleDelete(canvas, roomRef.current, deleteShape);
    }
    // check if the key pressed is ctrl/cmd + z (undo)
    if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 90) {
        undo();
        socket.emit("undo:shape", { room: roomRef.current, status: true });
    }
    // check if the key pressed is ctrl/cmd + y (redo)
    if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 89) {
        redo();
        socket.emit("redo:shape", { room: roomRef.current, status: true });
    }
    // check if the key pressed is space (panning)
    if (e.keyCode === 32) setTool("panning");
};
