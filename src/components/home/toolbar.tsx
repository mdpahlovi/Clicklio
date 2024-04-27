import { useState } from "react";
import { navElements } from "@/constants";
import Separator from "@/components/ui/separator";
import IconButton from "@/components/ui/icon-button";

import { LiaHandPaper } from "react-icons/lia";
import { PiCirclesThreePlus } from "react-icons/pi";
import { CiLock, CiUnlock, CiEraser } from "react-icons/ci";

import type { ActiveElement } from "@/types";

type ToolbarProps = {
    activeElement: ActiveElement;
    handleActiveElement: (element: ActiveElement) => void;
};

export default function Toolbar({ activeElement, handleActiveElement }: ToolbarProps) {
    const [lock, setLock] = useState(false);

    return (
        <div className="mx-auto flex w-max gap-1 rounded bg-foreground p-1">
            <IconButton onChange={() => setLock(!lock)}>{!lock ? <CiUnlock /> : <CiLock />}</IconButton>
            <Separator className="h-7" vertical />
            <IconButton>
                <LiaHandPaper />
            </IconButton>
            {navElements.map((element) => {
                return (
                    <IconButton
                        key={element.value}
                        onClick={() => handleActiveElement(element)}
                        active={element.value === activeElement?.value}
                    >
                        {element.icon}
                    </IconButton>
                );
            })}
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
