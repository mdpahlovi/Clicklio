import { useState } from "react";
import { Box, Button, Stack, Typography, Card } from "@mui/joy";
import { Form, FormInput, FormImage, FormTexteditor } from "@/components/form";
import { useAuthState } from "@/hooks/useAuthState";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import toast from "react-hot-toast";

export default function MyProfile() {
    const { user, setUser } = useAuthState();
    const [editBio, setEditBot] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [editBioLoading, setEditBotLoading] = useState(false);
    const [editProfileLoading, setEditProfileLoading] = useState(false);

    return (
        <Box sx={{ px: 3, py: 2 }}>
            <Typography level="h2">My Profile</Typography>
            <Stack spacing={2} sx={{ maxWidth: "800px", py: 2 }}>
                <Card>
                    <Form
                        defaultValues={
                            user
                                ? {
                                      first_name: user?.name?.split(" ")[0] ? user?.name?.split(" ")[0] : "",
                                      last_name: user?.name?.split(" ")[1] ? user?.name?.split(" ")[1] : "",
                                      role: user?.role ? user?.role : "",
                                      email: user?.email ? user?.email : "",
                                      phone: user?.phone ? user?.phone : "",
                                      image: user?.image ? user?.image : "",
                                  }
                                : undefined
                        }
                        onSubmit={({ first_name, last_name, ...rest }) => {
                            const value = { name: `${first_name} ${last_name}`, ...rest };

                            if (user) {
                                setEditProfileLoading(true);
                                updateDoc(doc(db, "users", user?.id), value)
                                    .then(() => {
                                        setEditProfile(false);
                                        setEditProfileLoading(false);
                                        setUser({ ...user, ...value });
                                    })
                                    .catch(() => {
                                        setEditProfileLoading(false);
                                        toast.error("Failed To Update Profile");
                                    });
                            }
                        }}
                    >
                        <CardHeader
                            title="Personal info"
                            body="Customize how your profile information here."
                            toggleEdit={() => setEditProfile(true)}
                        />
                        <Stack direction="column" spacing={2}>
                            <Stack direction="row" spacing={2} sx={{ pt: 0.5 }}>
                                <FormImage name="image" disabled={!editProfile} />
                                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                                    <FormInput name="first_name" label="First Name" disabled={!editProfile} />
                                    <FormInput name="last_name" label="Last Name" disabled={!editProfile} />
                                </Stack>
                            </Stack>
                            <Stack spacing={1}>
                                <FormInput name="role" label="Your Role" disabled={!editProfile} />
                                <FormInput name="email" label="Your Email" disabled />
                                <FormInput name="phone" label="Your Phone" disabled={!editProfile} />
                            </Stack>
                        </Stack>
                        {editProfile ? <CardAction loading={editProfileLoading} toggleEdit={() => setEditProfile(false)} /> : null}
                    </Form>
                </Card>
                <Card>
                    <Form
                        defaultValues={user ? { biography: user?.biography ? user?.biography : "" } : undefined}
                        onSubmit={(value) => {
                            if (user) {
                                setEditBotLoading(true);
                                updateDoc(doc(db, "users", user?.id), value)
                                    .then(() => {
                                        setEditBot(false);
                                        setEditBotLoading(false);
                                        setUser({ ...user, ...value });
                                    })
                                    .catch(() => {
                                        setEditBotLoading(false);
                                        toast.error("Failed To Update Biography");
                                    });
                            }
                        }}
                    >
                        <CardHeader
                            title="Bio"
                            body="Write a short introduction to be displayed on your profile"
                            toggleEdit={() => setEditBot(true)}
                        />
                        <FormTexteditor name="biography" />
                        {editBio ? <CardAction loading={editBioLoading} toggleEdit={() => setEditBot(false)} /> : null}
                    </Form>
                </Card>
            </Stack>
        </Box>
    );
}

function CardHeader({ title, body, toggleEdit }: { title: string; body: string; toggleEdit: () => void }) {
    return (
        <>
            <Box sx={{ pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography level="title-md">{title}</Typography>
                <Typography level="body-sm">{body}</Typography>
            </Box>
            <Button onClick={toggleEdit} sx={{ position: "absolute", right: 0, top: 0, borderRadius: "0 8px 0 8px" }}>
                Edit
            </Button>
        </>
    );
}

function CardAction({ loading, toggleEdit }: { loading: boolean; toggleEdit: () => void }) {
    return (
        <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "end", gap: 2 }}>
            <Button size="sm" variant="outlined" color="neutral" onClick={toggleEdit}>
                Cancel
            </Button>
            <Button type="submit" size="sm" loading={loading}>
                Save
            </Button>
        </Box>
    );
}
