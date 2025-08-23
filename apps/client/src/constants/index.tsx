import {
    ArrowToolIcon,
    CircleIcon,
    CursorIcon,
    DiamondIcon,
    EraserIcon,
    HandIcon,
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

export const navElements: {
    value?: Tool;
    name?: string;
    values?: Tool[];
    icon: React.ReactNode;
    type: "tool" | "divider" | "dropdown";
    children?: { value: Tool; name: string; icon: React.ReactNode }[];
}[] = [
    { icon: <HandIcon />, name: "Panning - V", value: "panning", type: "tool" },
    { icon: <CursorIcon />, name: "Select - V", value: "select", type: "tool" },
    { icon: <Divider orientation="horizontal" />, type: "divider" },
    {
        icon: <ShapersIcon />,
        name: "Shapes",
        values: ["rect", "diamond", "triangle", "circle", "line", "arrow"],
        type: "dropdown",
        children: [
            { icon: <SquareIcon />, name: "Rectangle - R", value: "rect" },
            { icon: <DiamondIcon />, name: "Diamond - D", value: "diamond" },
            { icon: <TriangleIcon />, name: "Triangle - T", value: "triangle" },
            { icon: <CircleIcon />, name: "Circle - C", value: "circle" },
            { icon: <MinusIcon />, name: "Line - L", value: "line" },
            { icon: <ArrowToolIcon />, name: "Arrow - Shift + L", value: "arrow" },
        ],
    },
    { icon: <PenIcon />, name: "Draw - P", value: "path", type: "tool" },
    { icon: <TextIcon />, name: "Text - A", value: "i-text", type: "tool" },
    { icon: <ImageAddIcon />, name: "Image - I", value: "image", type: "tool" },
    { icon: <Divider orientation="horizontal" />, type: "divider" },
    { icon: <EraserIcon />, name: "Eraser - E", value: "eraser", type: "tool" },
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

export const circle = (mode: "light" | "dark") =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' color='${
        mode === "light" ? "black" : "white"
    }' fill='none'%3E%3Ccircle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='1.5' stroke-linejoin='round' /%3E%3C/svg%3E"), auto`;

export const tools = [
    { name: "Hand Tool", key: "H" },
    { name: "Selection", key: "V" },
    { name: "Rectangle", key: "R" },
    { name: "Diamond", key: "D" },
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

export const presetColors = {
    fill: [
        "#60A5FA",
        "#34D399",
        "#FBBF24",
        "#F87171",
        "#A78BFA",
        "#22D3EE",
        "#FB923C",
        "#A3E635",
        "#F472B6",
        "#818CF8",
        "#2DD4BF",
        "#FB7185",
    ],
    stroke: [
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#06B6D4",
        "#F97316",
        "#84CC16",
        "#EC4899",
        "#6366F1",
        "#14B8A6",
        "#F43F5E",
    ],
};
