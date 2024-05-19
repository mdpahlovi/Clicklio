import Logo from "@/components/ui/logo";
import { Box, Sheet, Stack, Typography } from "@mui/joy";

export default function AuthLayout({ children }: React.PropsWithChildren) {
    return (
        <>
            <Sheet sx={{ width: { xs: "100%", md: "50vw" }, px: 2 }} style={{ zIndex: 1, borderWidth: 0 }}>
                <Stack minHeight="100dvh" width="100%">
                    <Logo sx={{ py: 2 }} />
                    <Box
                        sx={{ pt: 2, pb: 5, mx: "auto", gap: 2 }}
                        style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column" }}
                    >
                        {children}
                    </Box>
                    <Box sx={{ py: 3 }}>
                        <Typography level="body-xs" textAlign="center">
                            © {new Date().getFullYear()} Clicklio. All Rights Reserved.
                        </Typography>
                    </Box>
                </Stack>
            </Sheet>
            <Box
                sx={(theme) => ({
                    height: "100%",
                    position: "fixed",
                    inset: 0,
                    left: { xs: 0, md: "50vw" },
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "background.level1",
                    backgroundImage: "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
                    [theme.getColorSchemeSelector("dark")]: {
                        backgroundImage: "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
                    },
                })}
            />
        </>
    );
}
