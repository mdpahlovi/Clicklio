import { extendTheme } from "@mui/joy";

export default extendTheme({
    fontFamily: { body: "Poppins", code: "Poppins", display: "Poppins", fallback: "Poppins" },
    components: { JoySheet: { defaultProps: { variant: "outlined" } } },
});
