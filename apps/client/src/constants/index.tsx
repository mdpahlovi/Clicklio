import {
    CircleIcon,
    CursorIcon,
    EraserIcon,
    ImageAddIcon,
    MinusIcon,
    PenIcon,
    ShapersIcon,
    SquareIcon,
    TextIcon,
    TriangleIcon,
} from "@/components/icons";
import type { Tool } from "@/types";
import { Divider } from "@mui/joy";
import { IoIosBrush, IoMdBrush } from "react-icons/io";
import { LiaHandPaper, LiaLongArrowAltRightSolid } from "react-icons/lia";

export const navElements: {
    value?: Tool;
    name?: string;
    values?: Tool[];
    icon: React.ReactNode;
    type: "tool" | "divider" | "dropdown";
    children?: { value: Tool; name: string; icon: React.ReactNode }[];
}[] = [
    { icon: <LiaHandPaper />, name: "Panning", value: "panning", type: "tool" },
    { icon: <CursorIcon />, name: "Select", value: "select", type: "tool" },
    { icon: <Divider orientation="horizontal" />, type: "divider" },
    {
        icon: <ShapersIcon />,
        name: "Shapes",
        values: ["rect", "triangle", "circle", "line", "arrow"],
        type: "dropdown",
        children: [
            { icon: <SquareIcon />, name: "Rectangle", value: "rect" },
            { icon: <TriangleIcon />, name: "Triangle", value: "triangle" },
            { icon: <CircleIcon />, name: "Circle", value: "circle" },
            { icon: <MinusIcon />, name: "Line", value: "line" },
            { icon: <LiaLongArrowAltRightSolid />, name: "Arrow", value: "arrow" },
        ],
    },
    {
        icon: <PenIcon />,
        name: "Brushes",
        values: ["path-1", "path-5", "path-10"],
        type: "dropdown",
        children: [
            { icon: <PenIcon />, name: "Brush S:01", value: "path-1" },
            { icon: <IoMdBrush />, name: "Brush S:05", value: "path-5" },
            { icon: <IoIosBrush />, name: "Brush S:10", value: "path-10" },
        ],
    },
    { icon: <TextIcon />, name: "Text", value: "i-text", type: "tool" },
    { icon: <ImageAddIcon />, name: "Image", value: "image", type: "tool" },
    { icon: <Divider orientation="horizontal" />, type: "divider" },
    { icon: <EraserIcon />, name: "Eraser", value: "eraser", type: "tool" },
];

export const fontFamilyOptions = [
    { value: "Poppins", label: "Poppins" },
    { value: "Inter", label: "Inter" },
    { value: "Lato", label: "Lato" },
    { value: "Roboto", label: "Roboto" },
    { value: "Helvetica", label: "Helvetica" },
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
    { name: "Hand Tool", key: "H" },
    { name: "Selection", key: "V" },
    { name: "Rectangle", key: "R" },
    { name: "Triangle", key: "T" },
    { name: "Circle", key: "C" },
    { name: "Line", key: "L" },
    { name: "Arrow", key: "Shift + L" },
    { name: "Draw", key: "P" },
    { name: "Text", key: "A" },
    { name: "Insert Image", key: "I" },
    { name: "Eraser", key: "E" },
];

export const views = [
    { name: "Zoom In", key: "Ctrl + +" },
    { name: "Zoom Out", key: "Ctrl + -" },
    { name: "Reset Zoom", key: "Ctrl + 0" },
    { name: "Toggle Theme", key: "Ctrl + Alt + D" },
];

export const editors = [
    { name: "Pan Canvas", key: "Space + drag" },
    { name: "Delete", key: "Delete" },
    { name: "Cut", key: "Ctrl + X" },
    { name: "Copy", key: "Ctrl + C" },
    { name: "Paste", key: "Ctrl + V" },
    { name: "Duplicate", key: "Ctrl + D" },
    { name: "Undo", key: "Ctrl + Z" },
    { name: "Redo", key: "Ctrl + Shift + Z" },
    { name: "Decrease font size", key: "Ctrl + Shift + <" },
    { name: "Increase font size", key: "Ctrl + Shift + >" },
];

export const objectCorner: { cornerStyle: "rect" | "circle" | undefined; cornerColor: string; transparentCorners: boolean } = {
    cornerStyle: "circle",
    cornerColor: "#4882ED",
    transparentCorners: false,
};
