import { FolderIcon, SignoutIcon } from "@/components/icons";
import { useAuthState } from "@/stores/auth/useAuthStore";
import { Avatar, Box, Dropdown, Menu, MenuButton, MenuItem, Stack, Typography } from "@mui/joy";
import { Link } from "react-router-dom";

export default function AuthDropdown() {
    const { user, signOut } = useAuthState();
    if (!user || !user?.id) return null;

    return (
        <Dropdown>
            <MenuButton sx={{ p: 0, border: "none" }}>
                <Avatar src={user?.photo || undefined} sx={{ "--Avatar-size": "36px" }} />
            </MenuButton>
            <Menu placement="bottom-end" sx={{ zIndex: 99 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    sx={{
                        px: 1.5,
                        py: 1,
                        borderBottom: "1px solid",
                        borderBottomColor: "neutral.outlinedBorder",
                    }}
                >
                    <Avatar src={user?.photo || undefined} sx={{ "--Avatar-size": "36px" }} />
                    <Box>
                        <Typography level="title-sm" lineHeight={1.25}>
                            {user?.name}
                        </Typography>
                        <Typography level="body-xs" lineHeight={1.25}>
                            {user?.email}
                        </Typography>
                    </Box>
                </Stack>
                <MenuItem component={Link} to="/rooms">
                    <FolderIcon />
                    Dashboard
                </MenuItem>
                <MenuItem color="danger" onClick={signOut}>
                    <SignoutIcon />
                    Signout
                </MenuItem>
            </Menu>
        </Dropdown>
    );
}
