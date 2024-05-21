import type { File } from "@/pages/room";
import { useNavigate } from "react-router-dom";
import { RiMore2Fill, RiEdit2Fill, RiDeleteBin5Fill } from "react-icons/ri";
import { AspectRatio, Box, Card, CardOverflow, Typography, IconButton, Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";

export default function FileCard({ id, name, updatedAt }: File) {
    const navigate = useNavigate();

    return (
        <Card sx={{ ":hover": { cursor: "pointer" } }} onClick={() => navigate(`/room/${id}`)}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography level="title-md">{name}</Typography>
                <Dropdown>
                    <MenuButton component={IconButton} variant="plain" style={{ padding: 0 }}>
                        <RiMore2Fill size={20} />
                    </MenuButton>
                    <Menu placement="bottom-end">
                        <MenuItem>
                            <RiEdit2Fill size={16} />
                            Rename file
                        </MenuItem>
                        <MenuItem color="danger">
                            <RiDeleteBin5Fill size={16} />
                            Delete file
                        </MenuItem>
                    </Menu>
                </Dropdown>
            </Box>
            <CardOverflow sx={{ borderBottom: "1px solid", borderTop: "1px solid", borderColor: "neutral.outlinedBorder" }}>
                <AspectRatio ratio="16/9" color="primary" sx={{ borderRadius: 0 }}>
                    <img alt="" src="https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=400&auto=format" />
                </AspectRatio>
            </CardOverflow>
            <Typography level="body-xs">{updatedAt.toDate().toDateString()}</Typography>
        </Card>
    );
}
