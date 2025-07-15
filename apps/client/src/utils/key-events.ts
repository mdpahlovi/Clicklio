import type { WindowKeyDown } from "@/types";
import type { ShapeEvent } from "@/types/event";
import * as fabric from "fabric";
import { v4 as uuid } from "uuid";
import { handleAddEvent } from "./event";

export const handleCopy = (canvas: fabric.Canvas, copiedObjectRef: React.RefObject<fabric.FabricObject | null>) => {
    const activeObjects = canvas.getActiveObject();

    if (activeObjects) activeObjects.clone().then((cloned) => (copiedObjectRef.current = cloned));
};

export const handlePaste = async (
    canvas: fabric.Canvas,
    room: string | null,
    copiedObjectRef: React.RefObject<fabric.FabricObject | null>,
    addEvent: (event: ShapeEvent) => void,
) => {
    // if no copiedObject, return
    if (!copiedObjectRef.current) return;
    const clonedObj = await copiedObjectRef.current.clone(); // clone again, so you can do multiple copies.
    canvas.discardActiveObject();
    clonedObj.set({ left: clonedObj.left + 20, top: clonedObj.top + 20, evented: true });
    if (clonedObj instanceof fabric.ActiveSelection) {
        // active selection needs a reference to the canvas.
        clonedObj.canvas = canvas;
        clonedObj.forEachObject((object) => {
            object.set({ uid: uuid() });

            if (object?.uid) {
                canvas.add(object);

                // sync in storage
                handleAddEvent({
                    action: "CREATE",
                    object,
                    addEvent,
                    room,
                });
            }
        });
        // this should solve the unselectable behavior
        clonedObj.setCoords();
    } else {
        clonedObj.set({ uid: uuid() });

        if (clonedObj?.uid) {
            canvas.add(clonedObj);

            // sync in storage
            handleAddEvent({
                action: "CREATE",
                object: clonedObj,
                addEvent,
                room,
            });
        }
    }
    copiedObjectRef.current.top += 20;
    copiedObjectRef.current.left += 20;
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
};

export const handleDuplicate = async (canvas: fabric.Canvas, room: string | null, addEvent: (event: ShapeEvent) => void) => {
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
        clonedObj.forEachObject((object) => {
            object.set({ uid: uuid() });

            if (object?.uid) {
                canvas.add(object);

                // sync in storage
                handleAddEvent({
                    action: "CREATE",
                    object,
                    addEvent,
                    room,
                });
            }
        });
        clonedObj.setCoords();
    } else {
        // Handle single object duplication
        clonedObj.set({ uid: uuid() });

        if (clonedObj?.uid) {
            canvas.add(clonedObj);

            // sync in storage
            handleAddEvent({
                action: "CREATE",
                object: clonedObj,
                addEvent,
                room,
            });
        }
    }

    // Set the cloned object as the active one and render
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
};

export const handleDelete = (canvas: fabric.Canvas, room: string | null, addEvent: (event: ShapeEvent) => void) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;

    if (activeObjects.length > 0) {
        activeObjects.forEach((object) => {
            if (object?.uid) {
                canvas.remove(object);

                handleAddEvent({
                    action: "DELETE",
                    object,
                    addEvent,
                    room,
                });
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
    addEvent,
    undo,
    redo,
    setTool,
    setZoom,
    setMode,
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
        handlePaste(canvas, roomRef.current, copiedObjectRef, addEvent);
    }
    // Check if the key pressed is ctrl/cmd + d (Duplicate)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 68 && !e.altKey) {
        e.preventDefault();
        handleDuplicate(canvas, roomRef.current, addEvent);
    }
    // Check if the key pressed is delete (Delete Selection)
    if (canvas && e.keyCode === 46) {
        handleDelete(canvas, roomRef.current, addEvent);
    }
    // Check if the key pressed is ctrl/cmd + x (Cut)
    if (canvas && (e?.ctrlKey || e?.metaKey) && e.keyCode === 88) {
        handleCopy(canvas, copiedObjectRef);
        handleDelete(canvas, roomRef.current, addEvent);
    }
    // Check if the key pressed is ctrl/cmd + z (Undo)
    if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 90 && !e.shiftKey) {
        undo();
        // UNDO REDO FUNCTIONALITY
    }
    // Check if the key pressed is ctrl/cmd + shift + z (Redo)
    if ((e?.ctrlKey || e?.metaKey) && e.shiftKey && e.keyCode === 90) {
        redo();
        // UNDO REDO FUNCTIONALITY
    }
    // Check if the key pressed is space (Temporary Pan)
    if (e.keyCode === 32) setTool("panning");
};
