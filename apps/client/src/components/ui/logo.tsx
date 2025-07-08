import { Box, type BoxProps, useColorScheme } from "@mui/joy";

export default function Logo({ style, ...props }: BoxProps) {
    const { mode } = useColorScheme();

    return (
        <Box style={{ height: 40, ...style }} {...props}>
            <img src={`/logo/${mode}.png`} alt="" width={128} />
        </Box>
    );
}
