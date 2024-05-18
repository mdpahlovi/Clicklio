import { useBasicState } from "@/hooks/useBasicState";
import { MdSunny, MdBedtime, MdLogout } from "react-icons/md";
import { IoMdMenu, IoMdSettings, IoIosSearch } from "react-icons/io";
import { useColorScheme, Box, Typography, IconButton, Avatar, Input, Dropdown, Menu, MenuButton, MenuItem, ListDivider } from "@mui/joy";

export default function Header() {
    const { toggleSidebar } = useBasicState();
    const { mode, setMode } = useColorScheme();

    return (
        <>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <img src={`/logo/${mode}.png`} alt="" width={128} />
            </Box>

            <IconButton onClick={toggleSidebar} sx={{ display: { md: "none" } }}>
                <IoMdMenu size={24} />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Input
                    placeholder="Search anything…"
                    startDecorator={<IoIosSearch size={20} />}
                    endDecorator={
                        <IconButton variant="outlined" color="neutral" sx={{ bgcolor: "background.level1" }}>
                            <Typography level="title-sm" textColor="text.icon">
                                ⌘ K
                            </Typography>
                        </IconButton>
                    }
                    sx={{ alignSelf: "center", display: { xs: "none", md: "flex" } }}
                />
                <IconButton variant="outlined" sx={{ display: { xs: "flex", md: "none" } }}>
                    <IoIosSearch size={22} />
                </IconButton>
                <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")}>
                    {mode === "light" ? <MdSunny size={24} /> : <MdBedtime size={24} />}
                </IconButton>
                <Dropdown>
                    <MenuButton component={Avatar} sx={{ p: 0, borderRadius: "50%" }} src="https://i.pravatar.cc/40?img=2" />
                    <Menu placement="bottom-end" style={{ zIndex: 9999 }}>
                        <MenuItem>
                            <Avatar src="https://i.pravatar.cc/40?img=2" />
                            <Box>
                                <Typography level="title-sm" textColor="text.primary">
                                    Rick Sanchez
                                </Typography>
                                <Typography level="body-xs" textColor="text.tertiary">
                                    rick@email.com
                                </Typography>
                            </Box>
                        </MenuItem>
                        <ListDivider />
                        <MenuItem>
                            <IoMdSettings size={20} />
                            Settings
                        </MenuItem>
                        <ListDivider />
                        <MenuItem color="danger">
                            <MdLogout size={20} />
                            Log out
                        </MenuItem>
                    </Menu>
                </Dropdown>
            </Box>
        </>
    );
}
