import { TfiPencil } from "react-icons/tfi";
import { LiaHandPaper } from "react-icons/lia";
import { CiImageOn, CiText } from "react-icons/ci";
import { PiCursor, PiSquare, PiTriangle, PiCircle, PiMinus } from "react-icons/pi";
import type { Shape } from "@/types";

export const navElements: { value: Shape; name: string; icon: React.ReactNode }[] = [
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
