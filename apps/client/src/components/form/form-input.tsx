import React, { useId } from "react";
import { Controller } from "react-hook-form";
import { Box, Input, Typography } from "@mui/joy";

type InputProps = { type?: React.HTMLInputTypeAttribute; name: string; label?: string; disabled?: boolean };

export default function FormInput({ type = "text", name, label, disabled }: InputProps) {
    const id = useId();

    return (
        <Controller
            name={name}
            render={({ field }) => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    <Typography component="label" id={id} level="title-sm">
                        {label}
                    </Typography>
                    <Input id={id} type={type} {...field} disabled={disabled} />
                </Box>
            )}
        />
    );
}
