import { TfiPencil } from "react-icons/tfi";
import { LiaHandPaper } from "react-icons/lia";
import { CiImageOn, CiText } from "react-icons/ci";
import { PiCursor, PiSquare, PiTriangle, PiCircle, PiMinus } from "react-icons/pi";

import type { Tool } from "@/types";

export const navElements: { value: Tool; name: string; icon: React.ReactNode }[] = [
    { icon: <LiaHandPaper />, name: "Panning", value: "panning" },
    { icon: <PiCursor />, name: "Select", value: "select" },
    { icon: <PiSquare />, name: "Rectangle", value: "rect" },
    { icon: <PiTriangle />, name: "Triangle", value: "triangle" },
    { icon: <PiCircle />, name: "Circle", value: "circle" },
    { icon: <PiMinus />, name: "Line", value: "line" },
    { icon: <TfiPencil />, name: "Free Drawing", value: "path" },
    { icon: <CiText />, name: "Text", value: "i-text" },
    { icon: <CiImageOn />, name: "Image", value: "image" },
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
