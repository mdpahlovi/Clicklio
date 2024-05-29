import Layout from "@/components/room/layout";
import Header from "@/components/room/header";
import Navigation from "@/components/room/navigation";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <Layout.Root>
            <Layout.Header>
                <Header />
            </Layout.Header>
            <Layout.SideNav>
                <Navigation />
            </Layout.SideNav>
            <Layout.Main>
                <Outlet />
            </Layout.Main>
        </Layout.Root>
    );
}
