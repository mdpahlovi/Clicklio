import { useState } from "react";
import toast from "react-hot-toast";
import { db } from "@/utils/firebase";
import type { File } from "@/pages/room";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { RiMore2Fill, RiEdit2Fill, RiDeleteBin5Fill } from "react-icons/ri";
import {
    AspectRatio,
    Box,
    Card,
    CardOverflow,
    Typography,
    IconButton,
    Dropdown,
    Menu,
    MenuButton,
    MenuItem,
    Modal,
    Sheet,
    ModalClose,
    Button,
    Input,
} from "@mui/joy";

export default function FileCard({
    id,
    name,
    image,
    updatedAt,
    refresh,
    setRefresh,
}: File & { refresh: boolean; setRefresh: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // @ts-ignore
        const formData = new FormData(event.target);
        const formProps = Object.fromEntries(formData);

        setLoading(true);
        updateDoc(doc(db, "shapes", id), { ...formProps })
            .then(() => {
                setRefresh(!refresh);
                setLoading(false);
                setOpen(false);
            })
            .catch(() => toast.error("Failed To Rename File"));
    };

    return (
        <>
            <Card>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography level="title-md" sx={{ ":hover": { cursor: "pointer" } }} onClick={() => navigate(`/room/${id}`)}>
                        {name}
                    </Typography>
                    <Dropdown>
                        <MenuButton component={IconButton} variant="plain" style={{ padding: 0 }}>
                            <RiMore2Fill size={20} />
                        </MenuButton>
                        <Menu placement="bottom-end">
                            <MenuItem onClick={() => setOpen(true)}>
                                <RiEdit2Fill size={16} />
                                Rename file
                            </MenuItem>
                            <MenuItem
                                color="danger"
                                onClick={() =>
                                    deleteDoc(doc(db, "shapes", id))
                                        .then(() => setRefresh(!refresh))
                                        .catch(() => toast.error("Filed To Delete File"))
                                }
                            >
                                <RiDeleteBin5Fill size={16} />
                                Delete file
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                </Box>
                <CardOverflow
                    sx={{
                        borderBottom: "1px solid",
                        borderTop: "1px solid",
                        borderColor: "neutral.outlinedBorder",
                        ":hover": { cursor: "pointer" },
                    }}
                    onClick={() => navigate(`/room/${id}`)}
                >
                    <AspectRatio ratio="16/9" color="primary" sx={{ borderRadius: 0 }}>
                        <img src={image} alt={name} />
                    </AspectRatio>
                </CardOverflow>
                <Typography level="body-xs">{updatedAt.toDate().toDateString()}</Typography>
            </Card>
            <Modal open={open} onClose={() => setOpen(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Sheet variant="outlined" sx={{ maxWidth: 512, borderRadius: "md", p: 3, boxShadow: "lg" }}>
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography level="h4" fontWeight="lg" mb={1}>
                        Rename File
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
                        <Input name="name" placeholder="File Name" defaultValue={name} required fullWidth />
                        <Button type="submit" loading={loading} sx={{ mt: 2 }}>
                            Submit
                        </Button>
                    </form>
                </Sheet>
            </Modal>
        </>
    );
}
