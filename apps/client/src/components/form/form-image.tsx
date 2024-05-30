import { LiaUserEditSolid } from "react-icons/lia";
import { Controller, useFormContext } from "react-hook-form";
import { AspectRatio, Avatar, Box, IconButton } from "@mui/joy";

export default function FormImage({ name, disabled }: { name: string; disabled?: boolean }) {
    const { setValue } = useFormContext();

    return (
        <Controller
            name={name}
            render={({ field: { value } }) => (
                <>
                    <AspectRatio ratio="1" sx={{ width: 132, height: 132, borderRadius: "100%" }}>
                        <Avatar src={value} sx={{ "--Avatar-size": "132px" }} />
                    </AspectRatio>
                    {!disabled ? (
                        <Box sx={{ position: "absolute", zIndex: 2, left: 96, top: 192 }}>
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
                                <LiaUserEditSolid size={18} style={{ paddingLeft: 2.5 }} />
                            </IconButton>
                        </Box>
                    ) : null}
                </>
            )}
        />
    );
}
