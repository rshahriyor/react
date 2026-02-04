import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
    return (
        <div className="bg-(--body-bg-color)">
            <Header />
            <main className="container max-w-295 mx-auto min-h-screen py-5">
                <ScrollRestoration></ScrollRestoration>
                <Outlet></Outlet>
            </main>
        </div>
    )
}

export default MainLayout;