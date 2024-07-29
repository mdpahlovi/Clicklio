import { CircularProgress } from "@mui/joy";

export default function Loader() {
    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress
                sx={{
                    "--CircularProgress-trackThickness": "16px",
                    "--CircularProgress-size": "192px",
                    "--CircularProgress-progressThickness": "12px",
                }}
            />
        </div>
    );
}
