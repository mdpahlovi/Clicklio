import { useState } from "react";
import MenuButton from "@/components/home/menu";
import Toolbar from "@/components/home/toolbar";
import { Button } from "@/components/ui/button";
import BottomToolbar from "@/components/home/buttom-toolbar";

export default function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <div className="flex h-screen flex-col gap-6 p-6">
                <div className="grid grid-cols-[4.25rem_1fr_4.25rem] items-center">
                    <MenuButton {...{ menuOpen, setMenuOpen }} />
                    <Toolbar />
                    <Button>Share</Button>
                </div>
                <div className="bg-red-500">Middle</div>
                <div className="mt-auto">
                    <BottomToolbar />
                </div>
            </div>
        </>
    );
}
