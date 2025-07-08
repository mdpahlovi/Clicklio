import { Modal as JUIModal, ModalClose, Sheet, Typography } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";

type ModalProps = {
    sx?: SxProps;
    open: boolean;
    onClose: (event: object, reason: "backdropClick" | "escapeKeyDown" | "closeClick") => void;
    title: string;
} & React.PropsWithChildren;

export default function Modal({ sx, open, onClose, title, children }: ModalProps) {
    return (
        <JUIModal open={open} onClose={onClose}>
            <Sheet variant="outlined" sx={{ width: "100%", maxWidth: 512, borderRadius: 24, p: 3, boxShadow: "lg", ...sx }}>
                <ModalClose variant="plain" sx={{ m: 1 }} />
                <Typography level="h4" fontWeight="lg" mt={-0.75} mb={1}>
                    {title}
                </Typography>
                {children}
            </Sheet>
        </JUIModal>
    );
}
