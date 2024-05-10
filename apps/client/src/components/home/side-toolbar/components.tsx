import { Stack, Typography } from "@mui/joy";

export function Section({ title, children }: { title: string } & React.PropsWithChildren) {
    return (
        <Stack spacing={1.25} p={2}>
            <Typography level="title-sm">{title}</Typography>
            {children}
        </Stack>
    );
}

export function DoubleColumn({ children }: React.PropsWithChildren) {
    return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{children}</div>;
}
