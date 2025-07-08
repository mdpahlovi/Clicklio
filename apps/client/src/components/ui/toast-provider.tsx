import { Snackbar } from "@mui/joy";
import toast, { type ToastType, Toaster, resolveValue } from "react-hot-toast";
import { RiErrorWarningLine } from "react-icons/ri";

export function ToastProvider() {
    const getColor = (type: ToastType): "success" | "danger" | "primary" => {
        switch (type) {
            case "success":
                return "success";
            case "error":
                return "danger";
            default:
                return "primary";
        }
    };
    return (
        <Toaster position="top-right" toastOptions={{ duration: 1500 }}>
            {(t) => (
                <Snackbar color={getColor(t.type)} open={t.visible} onClose={() => toast.dismiss(t.id)}>
                    <RiErrorWarningLine size={20} /> {resolveValue(t.message, t)}
                </Snackbar>
            )}
        </Toaster>
    );
}
