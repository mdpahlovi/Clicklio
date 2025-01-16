import { useColorScheme, useTheme } from "@mui/joy";

export default function CanvasContainer({ children, style }: React.HTMLAttributes<HTMLDivElement>) {
    const { palette } = useTheme();
    const { mode } = useColorScheme();

    return (
        <div
            id="canvas"
            style={{
                position: "relative",
                width: "100%",
                height: "calc(100dvh - 65px)",
                backgroundColor: palette.background.body,
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3e%3ccircle fill='${
                    mode === "light" ? "rgb(0 0 0 / 0.25)" : "rgb(255 255 255 / 0.25)"
                }' cx='10' cy='10' r='1.6257413380501518'%3e%3c/circle%3e%3c/svg%3e"`,
                ...style,
            }}
        >
            {children}

            <video id="webcam" width={320} height={320} autoPlay hidden />
        </div>
    );
}
