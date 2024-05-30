import { useState } from "react";
import { config } from "@/components/setting/config";
import { Form, FormInput, FormImage } from "@/components/form";
import { Box, Button, Textarea, Stack, Typography, Card } from "@mui/joy";

import HtmlPlugin from "@/components/setting/html-plugin";
import ToolbarPlugin from "@/components/setting/toolbar-plugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

export default function MyProfile() {
    const [editBio, setEditBot] = useState(false);
    const [editProfile, setEditProfile] = useState(false);

    return (
        <Box sx={{ px: 3, py: 2 }}>
            <Typography level="h2">My Profile</Typography>
            <Stack spacing={2} sx={{ maxWidth: "800px", py: 2 }}>
                <Card>
                    <Form onSubmit={(value) => console.log(value)}>
                        <CardHeader
                            title="Personal info"
                            body="Customize how your profile information here."
                            toggleEdit={() => setEditProfile(true)}
                        />
                        <Stack direction="column" spacing={2}>
                            <Stack direction="row" spacing={2} sx={{ pt: 0.5 }}>
                                <FormImage />
                                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                                    <FormInput name="first_name" label="First Name" />
                                    <FormInput name="last_name" label="Last Name" />
                                </Stack>
                            </Stack>
                            <Stack spacing={1}>
                                <FormInput name="role" label="Your Role" />
                                <FormInput name="email" label="Your Email" />
                                <FormInput name="phone" label="Your Phone" />
                            </Stack>
                        </Stack>
                        {editProfile ? <CardAction toggleEdit={() => setEditProfile(false)} /> : null}
                    </Form>
                </Card>
                <Card>
                    <CardHeader
                        title="Bio"
                        body="Write a short introduction to be displayed on your profile"
                        toggleEdit={() => setEditBot(true)}
                    />

                    <LexicalComposer initialConfig={config}>
                        <ToolbarPlugin />
                        <RichTextPlugin
                            contentEditable={<Textarea component={ContentEditable} minRows={4} sx={{ minHeight: 96 }} />}
                            placeholder={
                                <Typography level="body-sm" sx={{ position: "absolute", top: 146, left: 29.5 }}>
                                    Enter some rich text...
                                </Typography>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <AutoFocusPlugin />
                        <HtmlPlugin
                            onHtmlChanged={(html) => console.log(html)}
                            initialHtml="<h1>Test</h1><p>Lorem ipsum dolor sit amet</p>"
                        />
                    </LexicalComposer>

                    {editBio ? <CardAction toggleEdit={() => setEditBot(false)} /> : null}
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

function CardAction({ toggleEdit }: { toggleEdit: () => void }) {
    return (
        <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", justifyContent: "end", gap: 2 }}>
            <Button size="sm" variant="outlined" color="neutral" onClick={toggleEdit}>
                Cancel
            </Button>
            <Button type="submit" size="sm">
                Save
            </Button>
        </Box>
    );
}
