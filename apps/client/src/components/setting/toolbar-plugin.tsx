import { mergeRegister } from "@lexical/utils";
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { CiUndo, CiRedo } from "react-icons/ci";
import { GoStrikethrough } from "react-icons/go";
import { Box, BoxProps, Divider, IconButtonProps, IconButton as JoyIconButton } from "@mui/joy";
import { FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify } from "react-icons/fi";

const LowPriority = 1;

export default function ToolbarPlugin({ sx, ...props }: BoxProps) {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority
            )
        );
    }, [editor, $updateToolbar]);

    return (
        <Box ref={toolbarRef} sx={[{ display: "flex", flexWrap: "wrap", gap: 0.5 }, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
            <IconButton disabled={!canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
                <CiUndo />
            </IconButton>
            <IconButton disabled={!canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
                <CiRedo />
            </IconButton>
            <Divider orientation="vertical" />
            <IconButton
                variant={isBold ? "solid" : "plain"}
                color={isBold ? "primary" : "neutral"}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
            >
                <FiBold />
            </IconButton>
            <IconButton
                variant={isItalic ? "solid" : "plain"}
                color={isItalic ? "primary" : "neutral"}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
            >
                <FiItalic />
            </IconButton>
            <IconButton
                variant={isUnderline ? "solid" : "plain"}
                color={isUnderline ? "primary" : "neutral"}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
            >
                <FiUnderline />
            </IconButton>
            <IconButton
                variant={isStrikethrough ? "solid" : "plain"}
                color={isStrikethrough ? "primary" : "neutral"}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
            >
                <GoStrikethrough />
            </IconButton>
            <Divider orientation="vertical" />
            <IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}>
                <FiAlignLeft />
            </IconButton>
            <IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}>
                <FiAlignCenter />
            </IconButton>
            <IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}>
                <FiAlignRight />
            </IconButton>
            <IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}>
                <FiAlignJustify />
            </IconButton>{" "}
        </Box>
    );
}

function IconButton({ children, ...props }: IconButtonProps) {
    return (
        <JoyIconButton sx={{ borderRadius: 10 }} {...props}>
            {children}
        </JoyIconButton>
    );
}
