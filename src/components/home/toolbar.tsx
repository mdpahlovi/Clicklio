import { useState } from "react";
import { TfiPencil } from "react-icons/tfi";
import Separator from "@/components/ui/separator";
import { IoSquareOutline } from "react-icons/io5";
import IconButton from "@/components/ui/icon-button";
import { GoDiamond, GoCircle } from "react-icons/go";
import { PiCursor, PiMinus, PiCirclesThreePlus } from "react-icons/pi";
import { LiaHandPaper, LiaLongArrowAltRightSolid } from "react-icons/lia";
import { CiLock, CiUnlock, CiText, CiImageOn, CiEraser } from "react-icons/ci";

export default function Toolbar() {
    const [lock, setLock] = useState(false);

    return (
        <div className="mx-auto flex w-max gap-1 rounded bg-foreground p-1">
            <IconButton onChange={() => setLock(!lock)}>{!lock ? <CiUnlock /> : <CiLock />}</IconButton>
            <Separator className="h-7" vertical />
            <IconButton active>
                <LiaHandPaper />
            </IconButton>
            <IconButton>
                <PiCursor />
            </IconButton>
            <IconButton>
                <IoSquareOutline />
            </IconButton>
            <IconButton>
                <GoDiamond />
            </IconButton>
            <IconButton>
                <GoCircle />
            </IconButton>
            <IconButton>
                <LiaLongArrowAltRightSolid />
            </IconButton>
            <IconButton>
                <PiMinus />
            </IconButton>
            <IconButton>
                <TfiPencil />
            </IconButton>
            <IconButton>
                <CiText />
            </IconButton>
            <IconButton>
                <CiImageOn />
            </IconButton>
            <IconButton>
                <CiEraser />
            </IconButton>
            <Separator className="h-7" vertical />
            <IconButton>
                <PiCirclesThreePlus />
            </IconButton>
        </div>
    );
}
