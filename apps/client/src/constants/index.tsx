import { Divider } from "@mui/joy";
import { LuShapes } from "react-icons/lu";
import { TfiPencil } from "react-icons/tfi";
import { LiaHandPaper } from "react-icons/lia";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoDuplicateOutline } from "react-icons/io5";
import { IoIosBrush, IoMdBrush } from "react-icons/io";
import { CiEraser, CiImageOn, CiText } from "react-icons/ci";
import { PiCursor, PiSquare, PiTriangle, PiCircle, PiMinus } from "react-icons/pi";

import type { Tool } from "@/types";

export const navElements: {
    value?: Tool;
    name?: string;
    values?: Tool[];
    icon: React.ReactNode;
    type: "tool" | "divider" | "dropdown" | "duplicate" | "delete";
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
    { icon: <CiEraser />, name: "Eraser", value: "eraser", type: "tool" },
    { icon: <Divider orientation="horizontal" />, type: "divider" },
    { icon: <IoDuplicateOutline />, name: "Duplicate", type: "duplicate" },
    { icon: <RiDeleteBin5Line />, name: "Delete", type: "delete" },
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

type Mode = "light" | "dark" | "system";

export const circle = (mode: Mode | undefined) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' color='${
        mode === "light" ? "black" : "white"
    }' fill='none'%3E%3Ccircle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='1.5' stroke-linejoin='round' /%3E%3C/svg%3E"), auto`;

export const tools = [
    { name: "Panning tool", key: "1" },
    { name: "Selection", key: "2" },
    { name: "Rectangle", key: "3" },
    { name: "Triangle", key: "4" },
    { name: "Circle", key: "5" },
    { name: "Line", key: "6" },
    { name: "Draw", key: "7" },
    { name: "Text", key: "8" },
    { name: "Insert Image", key: "9" },
    { name: "Eraser", key: "0" },
];

export const views = [
    { name: "Zoom in", key: "Ctrl + +" },
    { name: "Zoom out", key: "Ctrl + -" },
    { name: "Reset zoom", key: "Ctrl + R" },
    { name: "Toggle Theme", key: "Ctrl + D" },
];

export const editors = [
    { name: "Move canvas", key: "Space + drag" },
    { name: "Delete", key: "Delete" },
    { name: "Cut", key: "Ctrl + X" },
    { name: "Copy", key: "Ctrl + C" },
    { name: "Paste", key: "Ctrl + V" },
    { name: "Duplicate", key: "Ctrl + D" },
    { name: "Undo", key: "Ctrl + Z" },
    { name: "Redo", key: "Ctrl + Y" },
    { name: "Decrease font size", key: "Ctrl + <" },
    { name: "Increase font size", key: "Ctrl + >" },
];
