import IconButton from "@/components/ui/icon-button";
import { CgMenuLeft, CgClose } from "react-icons/cg";

export default function MenuButton({
    menuOpen,
    setMenuOpen,
}: {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return <IconButton onClick={() => setMenuOpen(!menuOpen)}>{!menuOpen ? <CgMenuLeft size={16} /> : <CgClose size={16} />}</IconButton>;
}
