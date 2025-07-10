import { useAuthState } from "@/hooks/zustand/useAuthState";
import { Avatar, Box, Dropdown, ListDivider, Menu, MenuButton, MenuItem, Typography } from "@mui/joy";
import { RiArtboardFill, RiFolder5Fill, RiLogoutBoxRLine, RiSettings3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

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
                <MenuItem component={Link} to="/rooms">
                    <RiFolder5Fill size={20} />
                    My Files
                </MenuItem>
                <ListDivider />
                <MenuItem component={Link} to="/setting">
                    <RiSettings3Fill size={20} />
                    Settings
                </MenuItem>
                <ListDivider />
                <MenuItem component={Link} to="/">
                    <RiArtboardFill size={20} />
                    Canvas
                </MenuItem>
                <ListDivider />
                <MenuItem color="danger" onClick={signOut}>
                    <RiLogoutBoxRLine size={20} />
                    Log out
                </MenuItem>
            </Menu>
        </Dropdown>
    );
}
