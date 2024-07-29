const theme = {
    text: {
        bold: "editor-text-bold",
        italic: "editor-text-italic",
        underline: "editor-text-underline",
        strikethrough: "editor-text-strikethrough",
    },
};

export const config = {
    editorState: null,
    namespace: "Clicklio",
    nodes: [],

    onError(error: Error) {
        throw error;
    },

    theme,
};
