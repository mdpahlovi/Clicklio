import { Box, Card, CardContent, Skeleton, Stack } from "@mui/joy";

export const RoomSkeleton = () => {
    return (
        <Card variant="outlined" sx={{ overflow: "hidden" }}>
            <Skeleton variant="rectangular" animation="wave" sx={{ aspectRatio: "16/9" }} />
            <CardContent sx={{ p: 2, pt: 1.5 }}>
                <Stack spacing={1.5}>
                    <Skeleton variant="text" level="title-md" animation="wave" sx={{ width: "80%" }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Stack direction="row" spacing={-0.5}>
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} variant="circular" width={24} height={24} animation="wave" />
                                ))}
                            </Stack>
                            <Skeleton variant="text" level="body-xs" animation="wave" sx={{ width: "60px" }} />
                        </Stack>
                        <Skeleton variant="text" level="body-xs" animation="wave" sx={{ width: "80px" }} />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default function RoomSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 2,
                p: 2,
            }}
        >
            {[...Array(count)].map((_, index) => (
                <RoomSkeleton key={index} />
            ))}
        </Box>
    );
}
