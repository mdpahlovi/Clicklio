import type { WindowKeyDown } from "@/types";
import type { ShapeEvent } from "@/types/event";
import { handleCreateEvent } from "@/utils/event";
import Konva from "konva";
import { v4 as uuid } from "uuid";

export const handleCopy = (stage: Konva.Stage, copiedObjectRef: React.RefObject<Konva.Node | null>) => {
    const selectedNodes = stage.find(".selected");
    if (selectedNodes.length > 0) {
        copiedObjectRef.current = selectedNodes[0];
    }
};

export const handlePaste = async (
    stage: Konva.Stage,
    copiedObjectRef: React.RefObject<Konva.Node | null>,
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void,
) => {
    if (!copiedObjectRef.current) return;

    const clonedObj = copiedObjectRef.current.clone({
        x: copiedObjectRef.current.x() + 20,
        y: copiedObjectRef.current.y() + 20,
    });

    clonedObj.setAttr("id", uuid());
    stage.getLayers()[0].add(clonedObj);

    handleCreateEvent({
        action: "CREATE",
        object: clonedObj,
        createEvent,
    });
};

export const handleDuplicate = async (stage: Konva.Stage, createEvent: (event: ShapeEvent, isPrivate: boolean) => void) => {
    const selectedNodes = stage.find(".selected");
    if (selectedNodes.length === 0) return;

    const node = selectedNodes[0];
    const clonedObj = node.clone({
        x: node.x() + 20,
        y: node.y() + 20,
    });

    clonedObj.setAttr("id", uuid());
    stage.getLayers()[0].add(clonedObj);

    handleCreateEvent({
        action: "CREATE",
        object: clonedObj,
        createEvent,
    });
};

export const handleDelete = (stage: Konva.Stage, createEvent: (event: ShapeEvent, isPrivate: boolean) => void) => {
    const selectedNodes = stage.find(".selected");
    if (selectedNodes.length === 0) return;

    selectedNodes.forEach((node) => {
        handleCreateEvent({
            action: "DELETE",
            object: node,
            createEvent,
        });
        node.destroy();
    });
};

// create a handleKeyDown function that listen to different keydown events
export const handleKeyDown = ({ e, stage, isEditing, copiedObjectRef, createEvent, setTool, setZoom }: WindowKeyDown) => {
    const zoom = stage?.scaleX();
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
    if (e.keyCode === 80) setTool("path");
    // Check if key pressed is A (Text Tool)
    if (e.keyCode === 65) setTool("text");
    // Check if key pressed is I (Image Tool)
    if (e.keyCode === 73) setTool("image");
    // Check if key pressed is E (Eraser Tool)
    if (e.keyCode === 69) setTool("eraser");

    // View Controls
    // Check if the key pressed is ctrl/cmd + + (Zoom In)
    if (stage && (e?.ctrlKey || e?.metaKey) && e.keyCode === 107) {
        e.preventDefault();
        if (zoom && Number(zoom.toFixed(1)) <= 10) {
            setZoom(zoom + 0.1);
            stage.scale({ x: zoom + 0.1, y: zoom + 0.1 });
        }
    }
    // Check if the key pressed is ctrl/cmd + - (Zoom Out)
    if (stage && (e?.ctrlKey || e?.metaKey) && e.keyCode === 109) {
        e.preventDefault();
        if (zoom && Number(zoom.toFixed(1)) >= 0.1) {
            setZoom(zoom - 0.1);
            stage.scale({ x: zoom - 0.1, y: zoom - 0.1 });
        }
    }
    // Check if the key pressed is ctrl/cmd + 0 (Reset View)
    if (stage && (e?.ctrlKey || e?.metaKey) && e.keyCode === 48) {
        e.preventDefault();
        setZoom(2);
        stage.scale({ x: 2, y: 2 });
    }

    // Editor Controls
    // Check if the key pressed is ctrl/cmd + c (Copy)
    if (stage && (e?.ctrlKey || e?.metaKey) && e.keyCode === 67 && !e.altKey) {
        handleCopy(stage, copiedObjectRef);
    }
    // Check if the key pressed is ctrl/cmd + v (Paste)
    if (stage && (e?.ctrlKey || e?.metaKey) && e.keyCode === 86) {
        handlePaste(stage, copiedObjectRef, createEvent);
    }
    // Check if the key pressed is ctrl/cmd + d (Duplicate)
    if (stage && (e?.ctrlKey || e?.metaKey) && e.keyCode === 68 && !e.altKey) {
        e.preventDefault();
        handleDuplicate(stage, createEvent);
    }
    // Check if the key pressed is delete (Delete Selection)
    if (stage && e.keyCode === 46) {
        handleDelete(stage, createEvent);
    }
    // Check if the key pressed is ctrl/cmd + x (Cut)
    if (stage && (e?.ctrlKey || e?.metaKey) && e.keyCode === 88) {
        handleCopy(stage, copiedObjectRef);
        handleDelete(stage, createEvent);
    }
    // Check if the key pressed is ctrl/cmd + z (Undo)
    if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 90 && !e.shiftKey) {
        handleCreateEvent({ action: "UNDO", object: null, createEvent });
    }
    // Check if the key pressed is ctrl/cmd + shift + z (Redo)
    if ((e?.ctrlKey || e?.metaKey) && e.shiftKey && e.keyCode === 90) {
        handleCreateEvent({ action: "REDO", object: null, createEvent });
    }
    // Check if the key pressed is space (Temporary Pan)
    if (e.keyCode === 32) setTool("panning");
};
