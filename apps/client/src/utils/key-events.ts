import type { WindowKeyDown } from "@/types";
import { socket } from "@/utils/socket";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";

export const handleCopy = (canvas: fabric.Canvas, copiedObjectRef: React.RefObject<fabric.FabricObject | null>) => {
    const activeObjects = canvas.getActiveObject();

    if (activeObjects) activeObjects.clone().then((cloned) => (copiedObjectRef.current = cloned));
};

export const handlePaste = async (
    canvas: fabric.Canvas,
    room: string | null,
    copiedObjectRef: React.RefObject<fabric.FabricObject | null>,
    setShape: (shape: fabric.FabricObject) => void,
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
            obj.set({ objectId: uuidv4() });
            canvas.add(obj);

            // sync in storage
            if (obj?.objectId) {
                setShape({ objectId: obj?.objectId, ...obj.toJSON() });
                if (room) socket.emit("set:shape", { room, objectId: obj?.objectId, ...obj.toJSON() });
            }
        });
        // this should solve the unselectability
        clonedObj.setCoords();
    } else {
        clonedObj.set({ objectId: uuidv4() });
        canvas.add(clonedObj);

        // sync in storage
        if (clonedObj?.objectId) {
            setShape({ objectId: clonedObj?.objectId, ...clonedObj.toJSON() });
            if (room) socket.emit("set:shape", { room, objectId: clonedObj?.objectId, ...clonedObj.toJSON() });
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
            obj.set({ objectId: uuidv4() });
            canvas.add(obj);

            // Sync in storage
            if (obj?.objectId) {
                setShape({ objectId: obj?.objectId, ...obj.toJSON() });
                if (room) socket.emit("set:shape", { room, objectId: obj?.objectId, ...obj.toJSON() });
            }
        });
        clonedObj.setCoords();
    } else {
        // Handle single object duplication
        clonedObj.set({ objectId: uuidv4() });
        canvas.add(clonedObj);

        // Sync in storage
        if (clonedObj?.objectId) {
            setShape({ objectId: clonedObj?.objectId, ...clonedObj.toJSON() });
            if (room) socket.emit("set:shape", { room, objectId: clonedObj?.objectId, ...clonedObj.toJSON() });
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
            if (object?.objectId && object?.objectId !== "webcam") {
                deleteShape(object?.objectId);
                if (room) socket.emit("delete:shape", { room, objectId: object?.objectId });
            }
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
    isEditing,
    copiedObjectRef,
    setShape,
    deleteShape,
    undo,
    redo,
    setTool,
    setZoom,
    setMode,
    setRefresh,
}: WindowKeyDown) => {
    const zoom = canvas?.getZoom();
    const light = localStorage.getItem("joy-mode") === "light";

    if (isEditing.current) return;

    // Tool Selection Shortcuts
    // Check if key pressed is H (Hand Tool)
    if (e.keyCode === 72) setTool("panning");
    // Check if key pressed is V (Select Tool)
    if (e.keyCode === 86) setTool("select");
    // Check if key pressed is R (Rectangle Tool)
    if (e.keyCode === 82) setTool("rect");
    // Check if key pressed is T (Triangle Tool)
    if (e.keyCode === 84) setTool("triangle");
    // Check if key pressed is C (Circle Tool)
    if (e.keyCode === 67) setTool("circle");
    // Check if key pressed is L (Line Tool)
    if (e.keyCode === 76) setTool("line");
    // Check if key pressed is Shift + L (Arrow Tool)
    if (e.shiftKey && e.keyCode === 76) setTool("arrow");
    // Check if key pressed is P (Pencil Tool)
    if (e.keyCode === 80) setTool("path-5");
    // Check if key pressed is A (Text Tool)
    if (e.keyCode === 65) setTool("i-text");
    // Check if key pressed is I (Image Tool)
    if (e.keyCode === 73) setTool("image");
    // Check if key pressed is E (Eraser Tool)
    if (e.keyCode === 69) setTool("eraser");

    // View Controls
    // Check if the key pressed is ctrl/cmd + + (Zoom In)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 107) {
        e.preventDefault();
        if (zoom && Number(zoom.toFixed(1)) <= 10) {
            setZoom(zoom + 0.1);
            canvas.setZoom(zoom + 0.1);
        }
    }
    // Check if the key pressed is ctrl/cmd + - (Zoom Out)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 109) {
        e.preventDefault();
        if (zoom && Number(zoom.toFixed(1)) >= 0.1) {
            setZoom(zoom - 0.1);
            canvas.setZoom(zoom - 0.1);
        }
    }
    // Check if the key pressed is ctrl/cmd + 0 (Reset View)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 48) {
        e.preventDefault();
        setZoom(2);
        canvas.setZoom(2);
    }
    // Check if the key pressed is ctrl + alt + D (Toggle Dark Mode)
    if (canvas && e?.ctrlKey && e?.altKey && e.keyCode === 68) {
        setMode(light ? "dark" : "light");
    }

    // Editor Controls
    // Check if the key pressed is ctrl/cmd + c (Copy)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 67 && !e.altKey) {
        handleCopy(canvas, copiedObjectRef);
    }
    // Check if the key pressed is ctrl/cmd + v (Paste)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 86) {
        handlePaste(canvas, roomRef.current, copiedObjectRef, setShape);
    }
    // Check if the key pressed is ctrl/cmd + d (Duplicate)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 68 && !e.altKey) {
        e.preventDefault();
        handleDuplicate(canvas, roomRef.current, setShape);
    }
    // Check if the key pressed is delete (Delete Selection)
    if (canvas && e.keyCode === 46) {
        handleDelete(canvas, roomRef.current, deleteShape);
    }
    // Check if the key pressed is ctrl/cmd + x (Cut)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 88) {
        handleCopy(canvas, copiedObjectRef);
        handleDelete(canvas, roomRef.current, deleteShape);
    }
    // Check if the key pressed is ctrl/cmd + z (Undo)
    if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 90 && !e.shiftKey) {
        undo();
        setRefresh();
        if (roomRef.current) socket.emit("undo:shape", { room: roomRef.current, status: true });
    }
    // Check if the key pressed is ctrl/cmd + shift + z (Redo)
    if ((e?.ctrlKey || e?.metaKey) && e.shiftKey && e.keyCode === 90) {
        redo();
        setRefresh();
        if (roomRef.current) socket.emit("redo:shape", { room: roomRef.current, status: true });
    }
    // Check if the key pressed is space (Temporary Pan)
    if (e.keyCode === 32) setTool("panning");
};
