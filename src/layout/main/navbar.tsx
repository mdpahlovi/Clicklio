import LogoToggle from "@/components/logo-toggle";
import ModeToggle from "@/components/mode-toggle";

export default function Navbar() {
    return (
        <nav className="border-b">
            <section className="h-16 my-0 flex justify-between items-center gap-6">
                <LogoToggle />
                <ModeToggle />
            </section>
        </nav>
    );
}
