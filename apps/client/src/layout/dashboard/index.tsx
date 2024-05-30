import { Outlet } from "react-router-dom";
import Layout from "@/layout/dashboard/layout";
import Header from "@/layout/dashboard/header";
import Navigation from "@/layout/dashboard/navigation";

export default function DashboardLayout() {
    return (
        <Layout.Root>
            <Layout.Header>
                <Header />
            </Layout.Header>
            <Layout.SideNav>
                <Navigation />
            </Layout.SideNav>
            <Outlet />
        </Layout.Root>
    );
}
