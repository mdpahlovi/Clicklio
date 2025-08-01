import { Box, type BoxProps } from "@mui/joy";

export default function CanvasContainer({ children }: BoxProps) {
    return (
        <Box
            id="canvas"
            sx={({ palette: { mode, background } }) => ({
                position: "relative",
                width: "100%",
                height: "100dvh",
                backgroundColor: background.body,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='${mode === "light" ? "rgb(0 0 0 / 0.25)" : "rgb(255 255 255 / 0.25)"}' cx='10' cy='10' r='1.6257413380501518'%3E%3C/circle%3E%3C/svg%3E")`,
            })}
        >
            {children}

            <video id="webcam" width={320} height={320} autoPlay hidden />
        </Box>
    );
}
