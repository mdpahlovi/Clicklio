import Konva from "konva";
import toast from "react-hot-toast";

export function getRandomName() {
    const firstNames = [
        "James",
        "Mary",
        "John",
        "Linda",
        "Michael",
        "Patricia",
        "Robert",
        "Jennifer",
        "William",
        "Elizabeth",
        "David",
        "Jessica",
        "Richard",
        "Susan",
        "Joseph",
        "Karen",
        "Thomas",
        "Nancy",
        "Charles",
        "Betty",
        "Daniel",
        "Helen",
        "Matthew",
        "Sandra",
        "George",
        "Margaret",
        "Anthony",
        "Ashley",
        "Mark",
        "Dorothy",
    ];

    const lastNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Jones",
        "Brown",
        "Davis",
        "Miller",
        "Wilson",
        "Moore",
        "Taylor",
        "Anderson",
        "Thomas",
        "Jackson",
        "White",
        "Harris",
        "Martin",
        "Thompson",
        "Garcia",
        "Martinez",
        "Roberts",
        "Clark",
        "Rodriguez",
        "Lewis",
        "Lee",
        "Walker",
        "Hall",
        "Allen",
        "Young",
        "King",
        "Wright",
    ];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${randomFirstName} ${randomLastName}`;
}

export const handleMediaError = (error: { name: string; message: string; constraint: string }) => {
    switch (error.name) {
        case "NotAllowedError":
            toast.error("Permission denied: User or browser blocked access.");
            break;
        case "NotFoundError":
            toast.error("No media devices found: Check camera/microphone connection.");
            break;
        case "NotReadableError":
            toast.error("Device inaccessible: Already in use or hardware error.");
            break;
        case "OverconstrainedError":
            toast.error(`Constraint '${error.constraint}' cannot be met.`);
            break;
        case "SecurityError":
            toast.error("Access blocked due to security restrictions.");
            break;
        case "TypeError":
            toast.error("Invalid constraints provided.");
            break;
        case "AbortError":
            toast.error("Operation aborted by the user or browser.");
            break;
        default:
            toast.error(`Something went wrong! ${error.message}`);
    }
};

export const getVisibleCenter = (stage: Konva.Stage) => {
    const stageCenterScreen = {
        x: stage.width() / 2,
        y: stage.height() / 2,
    };

    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    return stageTransform.point(stageCenterScreen);
};

export const setTransformer = (
    tr: Konva.Transformer,
    a1: Konva.Circle,
    a2: Konva.Circle,
    nodes: Konva.Node[],
    setCurrentObject: (object: Konva.Shape | null) => void,
) => {
    if (nodes.length > 1) {
        tr.moveToTop();
        tr.nodes(nodes);
        a1.setAttrs({ shapeId: null, visible: false });
        a2.setAttrs({ shapeId: null, visible: false });

        setCurrentObject(null);
    } else {
        const node = nodes[0];

        if ((node instanceof Konva.Line || node instanceof Konva.Arrow) && node.points().length === 4) {
            const points = node.points();

            tr.nodes([]);

            a1.moveToTop();
            a1.setAttrs({
                x: points[0] + node.x(),
                y: points[1] + node.y(),
                shapeId: node.id(),
                visible: true,
            });

            a2.moveToTop();
            a2.setAttrs({
                x: points[2] + node.x(),
                y: points[3] + node.y(),
                shapeId: node.id(),
                visible: true,
            });

            setCurrentObject(node as Konva.Shape);
        } else {
            tr.moveToTop();
            tr.nodes(nodes);
            a1.setAttrs({ shapeId: null, visible: false });
            a2.setAttrs({ shapeId: null, visible: false });

            setCurrentObject(nodes[0] as Konva.Shape);
        }
    }
};
