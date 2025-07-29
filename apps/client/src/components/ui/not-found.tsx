import { PlusIcon } from "@/components/icons";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { BiSearchAlt } from "react-icons/bi";

export default function NotFound({ onClick }: { onClick?: () => void }) {
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Stack spacing={2} alignItems="center">
                <Box
                    sx={{
                        color: "neutral.500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        bgcolor: "neutral.50",
                        border: "2px solid",
                        borderColor: "neutral.200",
                    }}
                >
                    <BiSearchAlt size={48} />
                </Box>

                <div>
                    <Typography level="title-lg" textAlign="center" sx={{ fontWeight: "bold", color: "neutral.700" }}>
                        Room Not Found
                    </Typography>
                    <Typography level="body-sm" textAlign="center" sx={{ maxWidth: 320, lineHeight: 1.35, mt: 1 }}>
                        No content found on this page. Please create a new room.
                    </Typography>
                </div>
                <Button
                    variant="solid"
                    color="primary"
                    startDecorator={<PlusIcon />}
                    onClick={onClick}
                    sx={{ mt: 1, transition: "transform 0.15s ease-in-out", "&:hover": { transform: "scale(1.02)" } }}
                >
                    Create Room
                </Button>
            </Stack>
        </div>
    );
}
