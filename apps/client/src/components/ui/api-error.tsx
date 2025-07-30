import { ErrorIcon, RefreshIcon } from "@/components/icons";
import { Box, Button, Stack, Typography } from "@mui/joy";

interface RoomErrorProps {
    onRetry?: () => void;
}

export default function ApiError({ onRetry }: RoomErrorProps) {
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Stack spacing={2} alignItems="center">
                {/* Error Icon */}
                <Box
                    sx={{
                        color: "danger.500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        bgcolor: "danger.50",
                        border: "2px solid",
                        borderColor: "danger.200",
                    }}
                >
                    <ErrorIcon size={48} />
                </Box>

                <div>
                    <Typography level="title-lg" textAlign="center" sx={{ fontWeight: "bold", color: "danger.700" }}>
                        Something went wrong
                    </Typography>
                    <Typography level="body-sm" textAlign="center" sx={{ maxWidth: 320, lineHeight: 1.35, mt: 1 }}>
                        An unexpected error occurred while please try again
                    </Typography>
                </div>

                {/* Retry Button */}
                {onRetry && (
                    <Button
                        variant="solid"
                        color="danger"
                        startDecorator={<RefreshIcon />}
                        onClick={onRetry}
                        sx={{ mt: 1, transition: "transform 0.15s ease-in-out", "&:hover": { transform: "scale(1.02)" } }}
                    >
                        Try Again
                    </Button>
                )}
            </Stack>
        </div>
    );
}
