import { ErrorIcon } from "@/components/icons";
import { Box, Input, Typography } from "@mui/joy";
import React, { useId } from "react";
import { Controller } from "react-hook-form";

type InputProps = { type?: React.HTMLInputTypeAttribute; name: string; label?: string; disabled?: boolean };

export default function FormInput({ type = "text", name, label, disabled }: InputProps) {
    const id = useId();

    return (
        <Controller
            name={name}
            render={({ field, fieldState: { invalid, error } }) => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                    <Typography component="label" htmlFor={id} level="title-sm" sx={{ mb: 0.5 }}>
                        {label}
                    </Typography>
                    <Input id={id} type={type} placeholder={`Enter ${label}`} {...field} error={invalid} disabled={disabled} />
                    {error?.message ? (
                        <Typography component="p" id={id} startDecorator={<ErrorIcon size={14} />} level="title-sm" color="danger">
                            {error?.message}
                        </Typography>
                    ) : null}
                </Box>
            )}
        />
    );
}
