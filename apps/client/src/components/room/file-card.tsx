import toast from "react-hot-toast";
import { db } from "@/utils/firebase";
import type { File } from "@/pages/room";
import Modal from "@/components/ui/modal";
import { useNavigate } from "react-router-dom";
import { useBasicState } from "@/hooks/useBasicState";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { RiMore2Fill, RiEdit2Fill, RiDeleteBin5Fill } from "react-icons/ri";
import { Box, Card, CardOverflow, Typography, IconButton, Dropdown, Menu, MenuButton, MenuItem, Button, Input } from "@mui/joy";

export default function FileCard({ file: { id, name, image, updatedAt }, refetch }: { file: { id: string } & File; refetch: () => void }) {
    const navigate = useNavigate();
    const { renameModal, toggleRenameModal, renameLoading, toggleRenameLoading } = useBasicState();

    // Delete File Actions
    const handleDelete = () => {
        deleteDoc(doc(db, "shapes", id))
            .then(() => refetch())
            .catch(() => toast.error("Filed To Delete File"));
    };

    // Rename File Actions
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        toggleRenameLoading();
        updateDoc(doc(db, "shapes", id), { name: new FormData(event.currentTarget).get("name") })
            .then(() => {
                refetch();
                toggleRenameModal();
            })
            .catch(() => toast.error("Failed To Rename File"))
            .finally(() => toggleRenameLoading());
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
                            <MenuItem onClick={toggleRenameModal}>
                                <RiEdit2Fill size={16} />
                                Rename file
                            </MenuItem>
                            <MenuItem color="danger" onClick={handleDelete}>
                                <RiDeleteBin5Fill size={16} />
                                Delete file
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                </Box>
                <CardOverflow onClick={() => navigate(`/room/${id}`)}>
                    <img src={image} alt={name} style={{ aspectRatio: "16 / 9" }} />
                </CardOverflow>
                <Typography level="body-xs">
                    {updatedAt.toDate().toDateString()}, {updatedAt.toDate().toLocaleTimeString()}
                </Typography>
            </Card>

            <Modal open={renameModal} onClose={toggleRenameModal} title="Rename File">
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
                    <Input name="name" placeholder="File Name" defaultValue={name} required fullWidth />
                    <Button type="submit" loading={renameLoading} sx={{ mt: 2 }}>
                        Submit
                    </Button>
                </form>
            </Modal>
        </>
    );
}
