import type { WindowKeyDown } from "@/types";
import type { ShapeEvent } from "@/types/event";
import { handleCreateEvent } from "@/utils/event";
import * as fabric from "fabric";
import { v4 as uuid } from "uuid";

export const handleCopy = (canvas: fabric.Canvas, copiedObjectRef: React.RefObject<fabric.FabricObject | null>) => {
    const activeObjects = canvas.getActiveObject();

    if (activeObjects) activeObjects.clone().then((cloned) => (copiedObjectRef.current = cloned));
};

export const handlePaste = async (
    canvas: fabric.Canvas,
    copiedObjectRef: React.RefObject<fabric.FabricObject | null>,
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void,
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

                handleCreateEvent({
                    action: "CREATE",
                    object,
                    createEvent,
                });
            }
        });
        // this should solve the unselectable behavior
        clonedObj.setCoords();
    } else {
        clonedObj.set({ uid: uuid() });

        if (clonedObj?.uid) {
            canvas.add(clonedObj);

            handleCreateEvent({
                action: "CREATE",
                object: clonedObj,
                createEvent,
            });
        }
    }
    copiedObjectRef.current.top += 20;
    copiedObjectRef.current.left += 20;
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
};

export const handleDuplicate = async (canvas: fabric.Canvas, createEvent: (event: ShapeEvent, isPrivate: boolean) => void) => {
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

                handleCreateEvent({
                    action: "CREATE",
                    object,
                    createEvent,
                });
            }
        });
        clonedObj.setCoords();
    } else {
        // Handle single object duplication
        clonedObj.set({ uid: uuid() });

        if (clonedObj?.uid) {
            canvas.add(clonedObj);

            handleCreateEvent({
                action: "CREATE",
                object: clonedObj,
                createEvent,
            });
        }
    }

    // Set the cloned object as the active one and render
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
};

export const handleDelete = (canvas: fabric.Canvas, createEvent: (event: ShapeEvent, isPrivate: boolean) => void) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;

    if (activeObjects.length > 0) {
        activeObjects.forEach((object) => {
            if (object?.uid) {
                canvas.remove(object);

                handleCreateEvent({
                    action: "DELETE",
                    object,
                    createEvent,
                });
            }
        });
    }

    canvas.discardActiveObject();
    canvas.requestRenderAll();
};

export const handleKeyDown = ({ e, canvas, isEditing, copiedObjectRef, createEvent, setTool, setZoom }: WindowKeyDown) => {
    if (!canvas) return;

    const zoom = canvas.getZoom();
    if (isEditing.current) return;

    const key = e.key.toLowerCase();

    // Handle Delete key
    if (key === "delete") {
        e.preventDefault();
        handleDelete(canvas, createEvent);
        return;
    }

    // Handle Space key for panning
    if (key === " " && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setTool("panning");
        return;
    }

    if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        // Tool Selection Shortcuts
        switch (key) {
            case "h":
                setTool("panning");
                break;
            case "v":
                setTool("select");
                break;
            case "r":
                setTool("rect");
                break;
            case "t":
                setTool("triangle");
                break;
            case "c":
                setTool("circle");
                break;
            case "l":
                if (e.shiftKey) {
                    setTool("arrow");
                } else {
                    setTool("line");
                }
                break;
            case "p":
                setTool("path");
                break;
            case "a":
                setTool("i-text");
                break;
            case "i":
                setTool("image");
                break;
            case "e":
                setTool("eraser");
                break;
        }
    } else if ((e.metaKey || e.ctrlKey) && !e.altKey) {
        // View Controls
        if (key === "+" || key === "=") {
            e.preventDefault();
            const newZoom = Math.min(zoom + 0.1, 10);
            setZoom(newZoom);
            canvas.setZoom(newZoom);
        } else if (key === "-") {
            e.preventDefault();
            const newZoom = Math.max(zoom - 0.1, 0.1);
            setZoom(newZoom);
            canvas.setZoom(newZoom);
        } else if (key === "0") {
            e.preventDefault();
            setZoom(2);
            canvas.setZoom(2);
        }

        // Editor Controls
        else if (key === "c") {
            e.preventDefault();
            handleCopy(canvas, copiedObjectRef);
        } else if (key === "v") {
            e.preventDefault();
            handlePaste(canvas, copiedObjectRef, createEvent);
        } else if (key === "d") {
            e.preventDefault();
            handleDuplicate(canvas, createEvent);
        } else if (key === "x") {
            e.preventDefault();
            handleCopy(canvas, copiedObjectRef);
            handleDelete(canvas, createEvent);
        } else if (key === "z") {
            e.preventDefault();
            if (e.shiftKey) {
                handleCreateEvent({
                    action: "REDO",
                    object: null,
                    createEvent,
                });
            } else {
                handleCreateEvent({
                    action: "UNDO",
                    object: null,
                    createEvent,
                });
            }
        }
    }
};
