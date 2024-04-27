import { TfiPencil } from "react-icons/tfi";
import { LiaHandPaper } from "react-icons/lia";
import { CiImageOn, CiText } from "react-icons/ci";
import { PiCursor, PiSquare, PiTriangle, PiCircle, PiMinus } from "react-icons/pi";

export const defaultAttributes = {
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#000000",
    stroke: "#000000",
};

export const navElements = [
    {
        icon: <LiaHandPaper />,
        name: "Panning",
        value: "panning",
    },
    {
        icon: <PiCursor />,
        name: "Select",
        value: "select",
    },
    {
        icon: <PiSquare />,
        name: "Rectangle",
        value: "rectangle",
    },
    {
        icon: <PiTriangle />,
        name: "Triangle",
        value: "triangle",
    },
    {
        icon: <PiCircle />,
        name: "Circle",
        value: "circle",
    },
    {
        icon: <PiMinus />,
        name: "Line",
        value: "line",
    },
    {
        icon: <TfiPencil />,
        name: "Free Drawing",
        value: "freeform",
    },
    {
        icon: <CiText />,
        value: "text",
        name: "Text",
    },
    {
        icon: <CiImageOn />,
        name: "Image",
        value: "image",
    },
];

export const defaultNavElement = {
    icon: <PiCursor />,
    name: "Select",
    value: "select",
};
