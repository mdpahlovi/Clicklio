import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Main() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}
