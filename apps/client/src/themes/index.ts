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
        JoyAvatar: { defaultProps: { sx: { width: 36, height: 36 } } },
        JoyAvatarGroup: { defaultProps: { sx: { "--AvatarGroup-gap": "-20px", alignItems: "center" } } },
        JoySheet: { defaultProps: { variant: "outlined" } },
        JoyCard: { styleOverrides: { root: { padding: 0, borderRadius: 16, gap: 0 } } },
        JoyInput: { styleOverrides: { root: { borderRadius: 8, overflow: "hidden" } } },
        JoyButton: { styleOverrides: { root: { borderRadius: 99 } } },
        JoySelect: { styleOverrides: { root: { borderRadius: 8 } } },
        JoyTextarea: { styleOverrides: { root: { borderRadius: 16 } } },
        JoyIconButton: { styleOverrides: { root: { borderRadius: 99 } } },
        JoyListItemButton: { styleOverrides: { root: { borderRadius: 16 } } },
        JoyMenu: { defaultProps: { placement: "auto" }, styleOverrides: { root: { borderRadius: 16, paddingBlock: 0 } } },
        JoyMenuItem: {
            defaultProps: {
                sx: {
                    borderBottom: "1px solid",
                    borderBottomColor: "neutral.outlinedBorder",
                    "&:last-child": { borderBottom: "none" },
                },
            },
            styleOverrides: { root: { paddingBlock: 8 } },
        },
        JoyMenuButton: { styleOverrides: { root: { borderRadius: 99 } } },
        JoySnackbar: { defaultProps: { anchorOrigin: { vertical: "top", horizontal: "right" } } },
        JoyModal: { defaultProps: { sx: { display: "flex", justifyContent: "center", alignItems: "center" } } },
        JoyModalClose: { styleOverrides: { root: { borderRadius: 99 } } },
        JoySlider: {
            styleOverrides: {
                thumb: {
                    [`&::before`]: { border: "none !important" },
                },
            },
            defaultProps: {
                sx: {
                    "--Slider-trackSize": "20px",
                    "--Slider-thumbSize": "20px",
                    "--Slider-thumbWidth": "4px",
                    "--Slider-thumbRadius": "2px",
                    [`& [style*="left:0%"], & [style*="left: 0%"]`]: {
                        [`&.${sliderClasses.markLabel}`]: {
                            transform: "none",
                        },
                        [`& .${sliderClasses.valueLabel}`]: {
                            left: 2,
                            borderBottomLeftRadius: 0,
                            "&::before": {
                                left: 0,
                                transform: "translateY(100%)",
                                borderLeftColor: "currentColor",
                            },
                        },
                    },
                    [`& [style*="left:100%"], & [style*="left: 100%"]`]: {
                        [`&.${sliderClasses.markLabel}`]: {
                            transform: "translateX(-100%)",
                        },
                        [`& .${sliderClasses.valueLabel}`]: {
                            right: 2,
                            borderBottomRightRadius: 0,
                            "&::before": {
                                left: "initial",
                                right: 0,
                                transform: "translateY(100%)",
                                borderRightColor: "currentColor",
                            },
                        },
                    },
                },
            },
        },
        JoyTooltip: {
            defaultProps: { variant: "soft", size: "sm", placement: "top", enterDelay: 300, enterNextDelay: 300, enterTouchDelay: 300 },
            styleOverrides: { root: { paddingInline: 10, borderRadius: 99 } },
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
        JoyListDivider: { styleOverrides: { root: { marginBlock: 0 } } },
        JoyTab: { styleOverrides: { root: { fontSize: 14 } } },
    },
});
