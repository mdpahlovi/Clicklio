import LogoToggle from "@/components/logo-toggle";
import ModeToggle from "@/components/mode-toggle";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="border-b">
            <section className="h-16 my-0 flex justify-between items-center gap-6">
                <LogoToggle />
                <div className="flex gap-4">
                    <Link to="/">Home</Link>
                    <Link to="/create-room">Create Room</Link>
                </div>
                <ModeToggle />
            </section>
        </nav>
    );
}
