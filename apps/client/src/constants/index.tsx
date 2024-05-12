import { Divider } from "@mui/joy";
import { LuShapes } from "react-icons/lu";
import { TfiPencil } from "react-icons/tfi";
import { LiaHandPaper } from "react-icons/lia";
import { IoIosBrush, IoMdBrush } from "react-icons/io";
import { CiEraser, CiImageOn, CiText } from "react-icons/ci";
import { PiCursor, PiSquare, PiTriangle, PiCircle, PiMinus } from "react-icons/pi";

import type { Tool } from "@/types";

export const navElements: {
    value?: Tool;
    name?: string;
    values?: Tool[];
    icon: React.ReactNode;
    type: "tool" | "divider" | "dropdown";
    children?: { value: Tool; name: string; icon: React.ReactNode }[];
}[] = [
    { icon: <LiaHandPaper />, name: "Panning", value: "panning", type: "tool" },
    { icon: <PiCursor />, name: "Select", value: "select", type: "tool" },
    { icon: <Divider orientation="horizontal" />, type: "divider" },
    {
        icon: <LuShapes />,
        name: "Shapes",
        values: ["rect", "triangle", "circle", "line"],
        type: "dropdown",
        children: [
            { icon: <PiSquare />, name: "Rectangle", value: "rect" },
            { icon: <PiTriangle />, name: "Triangle", value: "triangle" },
            { icon: <PiCircle />, name: "Circle", value: "circle" },
            { icon: <PiMinus />, name: "Line", value: "line" },
        ],
    },
    {
        icon: <TfiPencil />,
        name: "Free Drawing",
        values: ["path-1", "path-5", "path-10"],
        type: "dropdown",
        children: [
            { icon: <TfiPencil />, name: "Brush Size 01", value: "path-1" },
            { icon: <IoMdBrush />, name: "Brush Size 05", value: "path-5" },
            { icon: <IoIosBrush />, name: "Brush Size 10", value: "path-10" },
        ],
    },
    { icon: <CiText />, name: "Text", value: "i-text", type: "tool" },
    { icon: <CiImageOn />, name: "Image", value: "image", type: "tool" },
    { icon: <Divider orientation="horizontal" />, type: "divider" },
    { icon: <CiEraser />, name: "Eraser", value: "eraser", type: "tool" },
];

export const fontFamilyOptions = [
    { value: "Helvetica", label: "Helvetica" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Comic Sans MS", label: "Comic Sans MS" },
    { value: "Brush Script MT", label: "Brush Script MT" },
];

export const fontSizeOptions = [
    { value: "10", label: "10" },
    { value: "12", label: "12" },
    { value: "14", label: "14" },
    { value: "16", label: "16" },
    { value: "18", label: "18" },
    { value: "20", label: "20" },
    { value: "22", label: "22" },
    { value: "24", label: "24" },
    { value: "26", label: "26" },
    { value: "28", label: "28" },
    { value: "30", label: "30" },
    { value: "32", label: "32" },
    { value: "34", label: "34" },
    { value: "36", label: "36" },
];

export const fontWeightOptions = [
    { value: "400", label: "Normal" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semibold" },
    { value: "700", label: "Bold" },
];

export const circle = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' color='inherit' fill='none'%3E%3Ccircle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='1.5' stroke-linejoin='round' /%3E%3C/svg%3E"), auto`;

export const tools = [
    { name: "Hand (panning tool)", key: "H" },
    { name: "Selection", key: "V or 1" },
    { name: "Rectangle", key: "R or 2" },
    { name: "Diamond", key: "D or 3" },
    { name: "Ellipse", key: "O or 4" },
    { name: "Arrow", key: "A or 5" },
    { name: "Line", key: "L or 6" },
    { name: "Draw", key: "P or 7" },
    { name: "Text", key: "T or 8" },
    { name: "Insert image", key: "9" },
    { name: "Eraser", key: "E or 0" },
    { name: "Frame tool", key: "F" },
    { name: "Laser pointer", key: "K" },
    { name: "Pick color from canvas", key: "I or Shift S or Shift G" },
    { name: "Edit line/arrow points", key: "Ctrl Enter" },
    { name: "Edit text / add label", key: "Enter" },
    { name: "Add new line (text editor)", key: "Enter or Shift Enter" },
    { name: "Finish editing (text editor)", key: "Esc or Ctrl Enter" },
    { name: "Curved arrow", key: "A click click click" },
    { name: "Curved line", key: "L click click click" },
    { name: "Keep selected tool active after drawing", key: "Q" },
    { name: "Prevent arrow binding", key: "Ctrl" },
    { name: "Add / Update link for a selected shape", key: "Ctrl K" },
];

export const views = [
    { name: "Zoom in", key: "Ctrl +" },
    { name: "Zoom out", key: "Ctrl -" },
    { name: "Reset zoom", key: "Ctrl 0" },
    { name: "Zoom to fit all elements", key: "Shift 1" },
    { name: "Zoom to selection", key: "Shift 2" },
    { name: "Move page up/down", key: "PgUp/PgDn" },
    { name: "Move page left/right", key: "Shift PgUp/PgDn" },
    { name: "Zen mode", key: "Alt Z" },
    { name: "Snap to objects", key: "Alt S" },
    { name: "Toggle grid", key: "Ctrl '" },
    { name: "View mode", key: "Alt R" },
    { name: "Toggle light/dark theme", key: "Alt Shift D" },
    { name: "Stats for nerds", key: "Alt /" },
    { name: "Command palette", key: "Ctrl / or Ctrl Shift P" },
];

export const editors = [
    { name: "Move canvas", key: "Space drag or Wheel drag" },
    { name: "Reset the canvas", key: "Ctrl Delete" },
    { name: "Delete", key: "Delete" },
    { name: "Cut", key: "Ctrl X" },
    { name: "Copy", key: "Ctrl C" },
    { name: "Paste", key: "Ctrl V" },
    { name: "Paste as plaintext", key: "Ctrl Shift V" },
    { name: "Select all", key: "Ctrl A" },
    { name: "Add element to selection", key: "Shift click" },
    { name: "Deep select", key: "Ctrl click" },
    { name: "Deep select within box, and prevent dragging", key: "Ctrl drag" },
    { name: "Copy to clipboard as PNG", key: "Shift Alt C" },
    { name: "Copy styles", key: "Ctrl Alt C" },
    { name: "Paste styles", key: "Ctrl Alt V" },
    { name: "Send to back", key: "Ctrl Shift [" },
    { name: "Bring to front", key: "Ctrl Shift ]" },
    { name: "Send backward", key: "Ctrl [" },
    { name: "Bring forward", key: "Ctrl ]" },
    { name: "Align top", key: "Ctrl Shift Up" },
    { name: "Align bottom", key: "Ctrl Shift Down" },
    { name: "Align left", key: "Ctrl Shift Left" },
    { name: "Align right", key: "Ctrl Shift Right" },
    { name: "Duplicate", key: "Ctrl D or Alt drag" },
    { name: "Lock/unlock selection", key: "Ctrl Shift L" },
    { name: "Undo", key: "Ctrl Z" },
    { name: "Redo", key: "Ctrl Shift Z" },
    { name: "Group selection", key: "Ctrl G" },
    { name: "Ungroup selection", key: "Ctrl Shift G" },
    { name: "Flip horizontal", key: "Shift H" },
    { name: "Flip vertical", key: "Shift V" },
    { name: "Show stroke color picker", key: "S" },
    { name: "Show background color picker", key: "G" },
    { name: "Decrease font size", key: "Ctrl Shift <" },
    { name: "Increase font size", key: "Ctrl Shift >" },
];
