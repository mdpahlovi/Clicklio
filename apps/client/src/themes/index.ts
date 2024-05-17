import { extendTheme } from "@mui/joy";

export default extendTheme({
    fontFamily: { body: "Poppins", code: "Poppins", display: "Poppins", fallback: "Poppins" },
    components: {
        JoySheet: { defaultProps: { variant: "outlined" } },
        JoyButton: { styleOverrides: { root: { borderRadius: 9999 } } },
        JoyIconButton: { styleOverrides: { root: { borderRadius: 9999 } } },
        JoyMenu: { defaultProps: { placement: "auto" } },
        JoySnackbar: { defaultProps: { anchorOrigin: { vertical: "top", horizontal: "right" } } },
    },
});
