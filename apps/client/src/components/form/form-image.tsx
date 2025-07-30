import { UserEditIcon } from "@/components/icons";
import { AspectRatio, Avatar, Box, IconButton } from "@mui/joy";
import { Controller, useFormContext } from "react-hook-form";

export default function FormImage({ name, disabled }: { name: string; disabled?: boolean }) {
    const { setValue } = useFormContext();

    return (
        <Controller
            name={name}
            render={({ field: { value } }) => (
                <Box sx={{ position: "relative" }}>
                    <AspectRatio ratio="1" sx={{ width: 140, height: 140, borderRadius: "100%" }}>
                        <Avatar src={value} sx={{ "--Avatar-size": "132px" }} />
                    </AspectRatio>
                    {!disabled ? (
                        <Box sx={{ position: "absolute", bottom: 0, right: 0, zIndex: 2 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const fileReader = new FileReader();
                                    fileReader.onload = () => {
                                        if (fileReader.readyState === 2) setValue(name, fileReader.result);
                                    };
                                    fileReader.readAsDataURL(e.target.files![0]);
                                }}
                                style={{ position: "absolute", zIndex: 3, width: 32, height: 32, opacity: 0 }}
                                disabled={disabled}
                            />
                            <IconButton size="sm" sx={{ bgcolor: "background.body", boxShadow: "sm" }}>
                                <UserEditIcon />
                            </IconButton>
                        </Box>
                    ) : null}
                </Box>
            )}
        />
    );
}
