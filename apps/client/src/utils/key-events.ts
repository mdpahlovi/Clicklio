import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import { socket } from "@/utils/socket";
import { objectCorner } from "@/constants";
import type { WindowKeyDown } from "@/types";

export const handleCopy = (canvas: fabric.Canvas, copiedObjectRef: React.MutableRefObject<fabric.FabricObject | null>) => {
    const activeObjects = canvas.getActiveObject();

    if (activeObjects) activeObjects.clone().then((cloned) => (copiedObjectRef.current = cloned));
};

export const handlePaste = async (
    canvas: fabric.Canvas,
    room: string | null,
    copiedObjectRef: React.MutableRefObject<fabric.FabricObject | null>,
    setShape: (shape: fabric.FabricObject) => void
) => {
    // if no copiedObject, return
    if (!copiedObjectRef.current) return;
    const clonedObj = await copiedObjectRef.current.clone(); // clone again, so you can do multiple copies.
    canvas.discardActiveObject();
    clonedObj.set({ left: clonedObj.left + 20, top: clonedObj.top + 20, evented: true });
    if (clonedObj instanceof fabric.ActiveSelection) {
        // active selection needs a reference to the canvas.
        clonedObj.canvas = canvas;
        clonedObj.forEachObject((obj) => {
            obj.set({ objectId: uuidv4(), ...objectCorner });
            canvas.add(obj);

            // sync in storage
            if (obj?.objectId) {
                setShape({ objectId: obj?.objectId, ...obj.toJSON() });
                socket.emit("set:shape", { room, objectId: obj?.objectId, ...obj.toJSON() });
            }
        });
        // this should solve the unselectability
        clonedObj.setCoords();
    } else {
        clonedObj.set({ objectId: uuidv4(), ...objectCorner });
        canvas.add(clonedObj);

        // sync in storage
        if (clonedObj?.objectId) {
            setShape({ objectId: clonedObj?.objectId, ...clonedObj.toJSON() });
            socket.emit("set:shape", { room, objectId: clonedObj?.objectId, ...clonedObj.toJSON() });
        }
    }
    copiedObjectRef.current.top += 20;
    copiedObjectRef.current.left += 20;
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
};

export const handleDuplicate = async (canvas: fabric.Canvas, room: string | null, setShape: (shape: fabric.FabricObject) => void) => {
    // Get the active object from the canvas
    const activeObject = canvas.getActiveObject();

    // If no active object, return
    if (!activeObject) return;

    // Clone the active object
    const clonedObj = await activeObject.clone();

    // Slightly offset the cloned object to avoid overlap
    clonedObj.set({ left: clonedObj.left + 20, top: clonedObj.top + 20, evented: true });

    if (clonedObj instanceof fabric.ActiveSelection) {
        // If it's an active selection (multiple objects selected), handle each object
        clonedObj.canvas = canvas;
        clonedObj.forEachObject((obj) => {
            obj.set({ objectId: uuidv4(), ...objectCorner });
            canvas.add(obj);

            // Sync in storage
            if (obj?.objectId) {
                setShape({ objectId: obj?.objectId, ...obj.toJSON() });
                socket.emit("set:shape", { room, objectId: obj?.objectId, ...obj.toJSON() });
            }
        });
        clonedObj.setCoords();
    } else {
        // Handle single object duplication
        clonedObj.set({ objectId: uuidv4(), ...objectCorner });
        canvas.add(clonedObj);

        // Sync in storage
        if (clonedObj?.objectId) {
            setShape({ objectId: clonedObj?.objectId, ...clonedObj.toJSON() });
            socket.emit("set:shape", { room, objectId: clonedObj?.objectId, ...clonedObj.toJSON() });
        }
    }

    // Set the cloned object as the active one and render
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
};

export const handleDelete = (canvas: fabric.Canvas, room: string | null, deleteShape: (id: string) => void) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;

    if (activeObjects.length > 0) {
        activeObjects.forEach((object) => {
            canvas.remove(object);

            // sync in storage
            deleteShape(object?.objectId);
            socket.emit("delete:shape", { room, objectId: object?.objectId });
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
    if (e.keyCode === 49) setTool("panning");
    // Check if the key pressed is 2
    if (e.keyCode === 50) setTool("select");
    // Check if the key pressed is 3
    if (e.keyCode === 51) setTool("rect");
    // Check if the key pressed is 4
    if (e.keyCode === 52) setTool("triangle");
    // Check if the key pressed is 5
    if (e.keyCode === 53) setTool("circle");
    // Check if the key pressed is 6
    if (e.keyCode === 54) setTool("line");
    // Check if the key pressed is 7
    if (e.keyCode === 55) setTool("path-5");
    // Check if the key pressed is 8
    if (e.keyCode === 56) setTool("i-text");
    // Check if the key pressed is 9
    if (e.keyCode === 57) setTool("image");
    // Check if the key pressed is 0
    if (e.keyCode === 48) setTool("eraser");

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
        setZoom(2);
        canvas.setZoom(2);
    }
    // Check if the key pressed is alt + D
    if (canvas && e?.altKey && e?.shiftKey && e.keyCode === 68) {
        setMode(light ? "dark" : "light");
    }

    // Check if the key pressed is ctrl/cmd + c (copy)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 67) {
        handleCopy(canvas, copiedObjectRef);
    }
    // Check if the key pressed is ctrl/cmd + v (paste)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 86) {
        handlePaste(canvas, roomRef.current, copiedObjectRef, setShape);
    }
    // Check if the key pressed is ctrl/cmd + D (paste)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 68) {
        e.preventDefault();
        handleDuplicate(canvas, roomRef.current, setShape);
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
