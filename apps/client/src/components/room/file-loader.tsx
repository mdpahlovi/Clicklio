import { Box, Card, CardOverflow, CardProps, Skeleton } from "@mui/joy";

export default function FileLoader(props: CardProps) {
    return (
        <Card {...props}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Skeleton variant="text" level="title-md" width={128} />
                <Skeleton variant="rectangular" width={36} height={36} />
            </Box>
            <CardOverflow>
                <Skeleton variant="overlay" style={{ aspectRatio: "16 / 9" }} />
            </CardOverflow>
            <Skeleton variant="text" level="body-xs" width={176} />
        </Card>
    );
}
