import { extendTheme, sliderClasses } from "@mui/joy";

export default extendTheme({
    breakpoints: { values: { xs: 0, sm: 448, md: 640, lg: 768, xl: 1024 } },
    fontFamily: { body: "Poppins", code: "Poppins", display: "Poppins", fallback: "Poppins" },
    components: {
        JoySheet: { defaultProps: { variant: "outlined" } },
        JoyCard: { styleOverrides: { root: { borderRadius: 24 } } },
        JoyInput: { styleOverrides: { root: { borderRadius: 9999 } } },
        JoyButton: { styleOverrides: { root: { borderRadius: 9999 } } },
        JoySelect: { styleOverrides: { root: { borderRadius: 9999 } } },
        JoyTextarea: { styleOverrides: { root: { borderRadius: 16 } } },
        JoyIconButton: { styleOverrides: { root: { borderRadius: 9999 } } },
        JoyListItemButton: { styleOverrides: { root: { borderRadius: 9999 } } },
        JoyMenu: { defaultProps: { placement: "auto" } },
        JoySnackbar: { defaultProps: { anchorOrigin: { vertical: "top", horizontal: "right" } } },
        JoyModal: { defaultProps: { sx: { display: "flex", justifyContent: "center", alignItems: "center" } } },
        JoySlider: {
            defaultProps: {
                sx: {
                    "--Slider-trackSize": "20px",
                    [`& [style*="left:0%"], & [style*="left: 0%"]`]: {
                        [`&.${sliderClasses.markLabel}`]: { transform: "none" },
                    },
                    [`& [style*="left:100%"], & [style*="left: 100%"]`]: {
                        [`&.${sliderClasses.markLabel}`]: { transform: "translateX(-100%)" },
                    },
                },
                style: { padding: 10, marginBottom: 24 },
            },
        },
        JoyTooltip: { defaultProps: { size: "sm", placement: "top" } },
    },
});
