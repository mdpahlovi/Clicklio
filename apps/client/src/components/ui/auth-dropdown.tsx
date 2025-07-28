import { FolderIcon, SignoutIcon } from "@/components/icons";
import { useAuthState } from "@/stores/auth/useAuthStore";
import { Avatar, Box, Dropdown, ListDivider, Menu, MenuButton, MenuItem, Stack, Typography } from "@mui/joy";
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
                <Stack direction="row" sx={{ px: 1.5, py: 1 }}>
                    <Avatar src={user?.photo || undefined} />
                    <Box>
                        <Typography level="title-sm" textColor="text.primary">
                            {user?.name}
                        </Typography>
                        <Typography level="body-xs" textColor="text.tertiary">
                            {user?.email}
                        </Typography>
                    </Box>
                </Stack>
                <ListDivider />
                <MenuItem component={Link} to="/rooms">
                    <FolderIcon />
                    Dashboard
                </MenuItem>
                <ListDivider />
                <MenuItem color="danger" onClick={signOut}>
                    <SignoutIcon />
                    Signout
                </MenuItem>
            </Menu>
        </Dropdown>
    );
}
