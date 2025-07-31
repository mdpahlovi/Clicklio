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
