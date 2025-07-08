import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $insertNodes } from "lexical";
import { useEffect, useState } from "react";

export default function HtmlPlugin({ initialHtml, onHtmlChanged }: { initialHtml?: string; onHtmlChanged: (html: string) => void }) {
    const [editor] = useLexicalComposerContext();

    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (!initialHtml || !isFirstRender) return;

        setIsFirstRender(false);

        editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(initialHtml, "text/html");
            const nodes = $generateNodesFromDOM(editor, dom);
            $insertNodes(nodes);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <OnChangePlugin
            onChange={(editorState) => {
                editorState.read(() => {
                    onHtmlChanged($generateHtmlFromNodes(editor));
                });
            }}
        />
    );
}
