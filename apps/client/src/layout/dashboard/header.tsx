import Logo from "@/components/ui/logo";
import { useBasicState } from "@/hooks/useBasicState";
import ThemeToggle from "@/components/ui/theme-toggle";
import { IoMdMenu, IoIosSearch } from "react-icons/io";
import AuthDropdown from "@/components/ui/auth-dropdown";
import { Box, Typography, IconButton, Input } from "@mui/joy";

export default function Header() {
    const { toggleSidebar } = useBasicState();

    return (
        <>
            <Logo sx={{ display: { xs: "none", xl: "flex" } }} />

            <IconButton onClick={toggleSidebar} sx={{ display: { xl: "none" } }}>
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
                    sx={{ alignSelf: "center", display: { xs: "none", xl: "flex" } }}
                />
                <IconButton variant="outlined" sx={{ display: { xs: "flex", xl: "none" } }}>
                    <IoIosSearch size={22} />
                </IconButton>
                <ThemeToggle />
                <AuthDropdown />
            </Box>
        </>
    );
}
