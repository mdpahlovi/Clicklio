import { Box, type BoxProps } from "@mui/joy";

export default function Logo({ style, ...props }: BoxProps) {
    return (
        <Box style={{ ...style }} {...props}>
            <img src={`/logo/dark.png`} alt="" width={128} />
        </Box>
    );
}
