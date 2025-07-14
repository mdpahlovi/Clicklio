import { Form, FormImage, FormInput } from "@/components/form";
import { useAuthState } from "@/stores/auth/useAuthStore";
import { Box, Button, Card, Stack, Typography } from "@mui/joy";
import { useState } from "react";

export default function MyProfile() {
    const [editProfile, setEditProfile] = useState(false);
    const { user, updateProfileLoading, updateProfile } = useAuthState();

    return (
        <Box sx={{ px: 3, py: 2 }}>
            <Typography level="h2">My Profile</Typography>
            <Stack spacing={2} sx={{ maxWidth: "800px", py: 2 }}>
                <Card style={{ overflow: "hidden" }}>
                    <Form
                        defaultValues={
                            user
                                ? {
                                      first_name: user?.name?.split(" ")[0] ? user?.name?.split(" ")[0] : "",
                                      last_name: user?.name?.split(" ")[1] ? user?.name?.split(" ")[1] : "",
                                      email: user?.email ? user?.email : "",
                                      phone: user?.phone ? user?.phone : "",
                                      photo: user?.photo ? user?.photo : "",
                                      address: user?.otherInfo?.address ? user?.otherInfo?.address : "",
                                  }
                                : null
                        }
                        onSubmit={({ first_name, last_name, address, ...rest }) => {
                            updateProfile({ name: `${first_name} ${last_name}`, ...rest, otherInfo: { address } });
                            setEditProfile(false);
                        }}
                    >
                        <CardHeader
                            title="Personal info"
                            body="Customize how your profile information here."
                            toggleEdit={() => setEditProfile(true)}
                        />
                        <Stack direction="column" spacing={2}>
                            <Stack direction={{ md: "row" }}>
                                <FormImage name="photo" disabled={!editProfile} />
                                <Stack spacing={1} sx={{ flexGrow: 1, pt: { xs: 2, md: 0 }, pl: { md: 2 } }}>
                                    <FormInput name="first_name" label="First Name" disabled={!editProfile} />
                                    <FormInput name="last_name" label="Last Name" disabled={!editProfile} />
                                </Stack>
                            </Stack>
                            <Stack spacing={1} style={{ marginTop: 12 }}>
                                <FormInput name="email" label="Your Email" disabled />
                                <FormInput name="phone" label="Your Phone" disabled={!editProfile} />
                                <FormInput name="address" label="Your Address" disabled={!editProfile} />
                            </Stack>
                        </Stack>
                        {editProfile ? <CardAction loading={updateProfileLoading} toggleEdit={() => setEditProfile(false)} /> : null}
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
            <Button onClick={toggleEdit} sx={{ position: "absolute", right: 0, top: 0, borderRadius: "0 16px 0 16px" }}>
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
