import toast from "react-hot-toast";

export const handleNavigatorError = (error: any) => {
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
