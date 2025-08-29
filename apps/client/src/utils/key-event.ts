import type { WindowKeyDown } from "@/types";
import type { ShapeEvent } from "@/types/event";
import { handleCreateEvent } from "@/utils/event";
import Konva from "konva";
import { v4 as uuid } from "uuid";

export const handleCopy = (stage: Konva.Stage, copiedObjectRef: React.RefObject<Konva.Node[] | null>) => {
    const tr = stage.findOne("Transformer") as Konva.Transformer | null;
    if (!tr || tr.nodes().length === 0) return;

    copiedObjectRef.current = tr.nodes();
};

export const handlePaste = async (
    stage: Konva.Stage,
    copiedObjectRef: React.RefObject<Konva.Node[] | null>,
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void,
    setCurrentObject: (object: Konva.Shape | null) => void,
) => {
    const tr = stage.findOne("Transformer") as Konva.Transformer | null;
    if (!tr || tr.nodes().length === 0) return;
    if (!copiedObjectRef.current?.length) return;

    const clonedObjs: Konva.Node[] = [];
    copiedObjectRef.current.forEach((node) => {
        const clonedObj = node.clone({
            x: node.x() + 20,
            y: node.y() + 20,
        });

        clonedObj.id(uuid());
        stage.getLayers()[0].add(clonedObj);
        clonedObjs.push(clonedObj);

        handleCreateEvent({
            action: "CREATE",
            object: clonedObj,
            createEvent,
        });
    });

    copiedObjectRef.current = null;

    tr.moveToTop();
    tr.nodes(clonedObjs);
    if (clonedObjs.length > 1) {
        setCurrentObject(null);
    } else {
        setCurrentObject(clonedObjs[0] as Konva.Shape);
    }
};

export const handleDuplicate = async (
    stage: Konva.Stage,
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void,
    setCurrentObject: (object: Konva.Shape | null) => void,
) => {
    const tr = stage.findOne("Transformer") as Konva.Transformer | null;
    if (!tr || tr.nodes().length === 0) return;

    const clonedObjs: Konva.Node[] = [];
    tr.nodes().forEach((node) => {
        const clonedObj = node.clone({
            x: node.x() + 20,
            y: node.y() + 20,
        });

        clonedObj.id(uuid());
        stage.getLayers()[0].add(clonedObj);
        clonedObjs.push(clonedObj);

        handleCreateEvent({
            action: "CREATE",
            object: clonedObj,
            createEvent,
        });
    });

    tr.moveToTop();
    tr.nodes(clonedObjs);
    if (clonedObjs.length > 1) {
        setCurrentObject(null);
    } else {
        setCurrentObject(clonedObjs[0] as Konva.Shape);
    }
};

export const handleDelete = (stage: Konva.Stage, createEvent: (event: ShapeEvent, isPrivate: boolean) => void) => {
    const tr = stage.findOne("Transformer") as Konva.Transformer | null;
    if (!tr || tr.nodes().length === 0) return;

    tr.nodes().forEach((node) => {
        if (node.id()) {
            node.destroy();
            handleCreateEvent({
                action: "DELETE",
                object: node,
                createEvent,
            });
        }
    });

    tr.nodes([]);
};

// create a handleKeyDown function that listen to different keydown events
export const handleKeyDown = ({ e, stage, isEditing, copiedObjectRef, createEvent, setTool, setZoom, setCurrentObject }: WindowKeyDown) => {
    if (!stage || isEditing.current) return;

    const zoom = stage.scaleX();
    const key = e.key.toLowerCase();

    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        e.preventDefault();

        switch (key) {
            case "+":
            case "add":
                {
                    const newZoom = Math.min(10, zoom + 0.1);
                    setZoom(newZoom);
                    stage.scale({ x: newZoom, y: newZoom });
                }
                break;
            case "-":
            case "subtract":
                {
                    const newZoom = Math.max(0.1, zoom - 0.1);
                    setZoom(newZoom);
                    stage.scale({ x: newZoom, y: newZoom });
                }
                break;
            case "0":
                setZoom(1);
                stage.scale({ x: 1, y: 1 });
                break;
            case "c":
                handleCopy(stage, copiedObjectRef);
                break;
            case "v":
                handlePaste(stage, copiedObjectRef, createEvent, setCurrentObject);
                break;
            case "d":
                e.preventDefault();
                handleDuplicate(stage, createEvent, setCurrentObject);
                break;
            case "x":
                e.preventDefault();
                handleCopy(stage, copiedObjectRef);
                handleDelete(stage, createEvent);
                break;
            case "z":
                if (e.shiftKey) {
                    handleCreateEvent({ action: "REDO", object: null, createEvent });
                } else {
                    handleCreateEvent({ action: "UNDO", object: null, createEvent });
                }
                break;
        }
    } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (key) {
            case "delete":
                handleDelete(stage, createEvent);
                break;
            case " ":
            case "h":
                setTool("panning");
                break;
            case "v":
                setTool("select");
                break;
            case "r":
                setTool("rect");
                break;
            case "d":
                setTool("diamond");
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
                setTool("text");
                break;
            case "i":
                setTool("image");
                break;
            case "e":
                setTool("eraser");
                break;
        }
    }
};
