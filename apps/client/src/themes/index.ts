import { extendTheme, sliderClasses } from "@mui/joy";

export default extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    "50": "#f0f6fe",
                    "100": "#dde9fc",
                    "200": "#c2d9fb",
                    "300": "#98c2f8",
                    "400": "#68a2f2",
                    "500": "#4882ed",
                    "600": "#2f62e1",
                    "700": "#264dcf",
                    "800": "#2540a8",
                    "900": "#233a85",
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    "50": "#f0f6fe",
                    "100": "#dde9fc",
                    "200": "#c2d9fb",
                    "300": "#98c2f8",
                    "400": "#68a2f2",
                    "500": "#4882ed",
                    "600": "#2f62e1",
                    "700": "#264dcf",
                    "800": "#2540a8",
                    "900": "#233a85",
                },
            },
        },
    },
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
        JoyMenu: { defaultProps: { placement: "auto" }, styleOverrides: { root: { borderRadius: 24 } } },
        JoyMenuButton: { styleOverrides: { root: { borderRadius: 9999 } } },
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
        JoyTooltip: {
            defaultProps: { variant: "soft", size: "sm", placement: "top", enterDelay: 300, enterNextDelay: 300, enterTouchDelay: 300 },
            styleOverrides: { root: { borderRadius: 9999 } },
        },
        JoyCardOverflow: {
            defaultProps: {
                sx: {
                    borderBottom: "1px solid",
                    borderTop: "1px solid",
                    borderColor: "neutral.outlinedBorder",
                    ":hover": { cursor: "pointer" },
                },
            },
        },
    },
});
