import { Divider } from "@mui/joy";
import { TfiPencil } from "react-icons/tfi";
import { LiaHandPaper } from "react-icons/lia";
import { CiEraser, CiImageOn, CiText } from "react-icons/ci";
import { PiCursor, PiSquare, PiTriangle, PiCircle, PiMinus } from "react-icons/pi";

import type { Tool } from "@/types";

export const navElements: { value: Tool | ""; name: string; icon: React.ReactNode; type: "tool" | "divider" }[] = [
    { icon: <LiaHandPaper />, name: "Panning", value: "panning", type: "tool" },
    { icon: <PiCursor />, name: "Select", value: "select", type: "tool" },
    { icon: <Divider orientation="horizontal" />, name: "", value: "", type: "divider" },
    { icon: <PiSquare />, name: "Rectangle", value: "rect", type: "tool" },
    { icon: <PiTriangle />, name: "Triangle", value: "triangle", type: "tool" },
    { icon: <PiCircle />, name: "Circle", value: "circle", type: "tool" },
    { icon: <PiMinus />, name: "Line", value: "line", type: "tool" },
    { icon: <TfiPencil />, name: "Free Drawing", value: "path", type: "tool" },
    { icon: <CiText />, name: "Text", value: "i-text", type: "tool" },
    { icon: <CiImageOn />, name: "Image", value: "image", type: "tool" },
    { icon: <Divider orientation="horizontal" />, name: "", value: "", type: "divider" },
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
