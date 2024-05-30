import { AspectRatio, IconButton } from "@mui/joy";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

export default function FormImage() {
    return (
        <>
            <AspectRatio ratio="1" sx={{ width: 132, height: 132, borderRadius: "100%" }}>
                <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                    srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                    loading="lazy"
                    alt=""
                />
            </AspectRatio>
            <IconButton
                size="sm"
                sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 96,
                    top: 192,
                    boxShadow: "sm",
                }}
            >
                <EditRoundedIcon />
            </IconButton>
        </>
    );
}
