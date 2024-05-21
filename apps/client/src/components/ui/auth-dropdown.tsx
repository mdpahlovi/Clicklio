import { Link } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { MdSettings, MdLogout } from "react-icons/md";
import { Avatar, Box, Dropdown, ListDivider, Menu, MenuButton, MenuItem, Typography } from "@mui/joy";

export default function AuthDropdown() {
    const { user, signOut } = useAuthState();
    if (!user || !user?.id) return null;

    return (
        <Dropdown>
            <MenuButton sx={{ p: 0, border: "none" }}>
                <Avatar src={user?.image} sx={{ "--Avatar-size": "36px" }} />
            </MenuButton>
            <Menu placement="bottom-end" style={{ zIndex: 9999 }}>
                <MenuItem>
                    <Avatar src={user?.image} />
                    <Box>
                        <Typography level="title-sm" textColor="text.primary">
                            {user?.name}
                        </Typography>
                        <Typography level="body-xs" textColor="text.tertiary">
                            {user?.email}
                        </Typography>
                    </Box>
                </MenuItem>
                <ListDivider />
                <MenuItem component={Link} to="setting">
                    <MdSettings size={20} />
                    Settings
                </MenuItem>
                <ListDivider />
                <MenuItem color="danger" onClick={signOut}>
                    <MdLogout size={20} />
                    Log out
                </MenuItem>
            </Menu>
        </Dropdown>
    );
}
