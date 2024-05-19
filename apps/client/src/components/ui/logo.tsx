import { Box, BoxProps, useColorScheme } from "@mui/joy";

export default function Logo(props: BoxProps) {
    const { mode } = useColorScheme();

    return (
        <Box {...props}>
            <img src={`/logo/${mode}.png`} alt="" width={128} />
        </Box>
    );
}
