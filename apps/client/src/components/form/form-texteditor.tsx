import { MdErrorOutline } from "react-icons/md";
import { config } from "@/components/setting/config";
import { Box, Textarea, Typography } from "@mui/joy";
import HtmlPlugin from "@/components/setting/html-plugin";
import { Controller, useFormContext } from "react-hook-form";
import ToolbarPlugin from "@/components/setting/toolbar-plugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

export default function FormTexteditor({ name }: { name: string; disabled?: boolean }) {
    const { setValue } = useFormContext();

    return (
        <Controller
            name={name}
            render={({ field: { value }, fieldState: { invalid, error } }) => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                    <LexicalComposer initialConfig={config}>
                        <ToolbarPlugin />
                        <RichTextPlugin
                            contentEditable={<Textarea error={invalid} component={ContentEditable} sx={{ mt: 1.75, minHeight: 96 }} />}
                            placeholder={
                                <Typography level="body-sm" sx={{ position: "absolute", top: 154, left: 29.5 }}>
                                    Enter some rich text...
                                </Typography>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <AutoFocusPlugin />
                        <HtmlPlugin onHtmlChanged={(html) => setValue(name, html)} initialHtml={value} />
                    </LexicalComposer>
                    {error?.message ? (
                        <Typography component="p" startDecorator={<MdErrorOutline />} level="title-sm" color="danger">
                            {error?.message}
                        </Typography>
                    ) : null}
                </Box>
            )}
        />
    );
}
