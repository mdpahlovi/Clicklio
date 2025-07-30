import { MenuIcon, SearchIcon } from "@/components/icons";
import AuthDropdown from "@/components/ui/auth-dropdown";
import Logo from "@/components/ui/logo";
import { Box, IconButton, Input, Typography } from "@mui/joy";

export default function Header({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <>
            <Logo sx={{ display: { xs: "none", xl: "flex" } }} />

            <IconButton onClick={() => setIsOpen(true)} sx={{ display: { xl: "none" } }}>
                <MenuIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Input
                    placeholder="Search anything…"
                    startDecorator={<SearchIcon />}
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
                    <SearchIcon />
                </IconButton>
                <AuthDropdown />
            </Box>
        </>
    );
}
