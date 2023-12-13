import { Link } from "react-router-dom";
import useThemeStore from "@/hooks/useThemeStore";

export default function LogoToggle({ className }: { className?: string }) {
    const { mode } = useThemeStore();

    return (
        <Link to="/" className={className}>
            <img src={`/logo/${mode}.png`} alt="" className="w-32" />
        </Link>
    );
}
