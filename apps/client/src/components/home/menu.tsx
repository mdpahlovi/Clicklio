import { IconButton } from "@mui/joy";
import { useBasicState } from "@/hooks/useBasicState";
import { CgMenuLeft, CgClose } from "react-icons/cg";

export default function MenuButton() {
    const { menu, toggleMenu } = useBasicState();

    return (
        <IconButton variant="solid" onClick={toggleMenu}>
            {!menu ? <CgMenuLeft size={16} /> : <CgClose size={16} />}
        </IconButton>
    );
}
