import { Stack, useTheme } from "@mui/joy";

export default function Navbar() {
    const { palette } = useTheme();

    return (
        <Stack height={64} px={3} direction="row" alignItems="center" borderBottom={1} borderColor={({ palette }) => palette.divider}>
            <img src={`/logo/${palette.mode}.png`} alt="" width={128} />
        </Stack>
    );
}
