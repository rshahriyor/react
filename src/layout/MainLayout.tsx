import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
    return (
        <>
            <Header title='Hello, World!' subtitle='How are you?' />
            <Outlet></Outlet>
        </>
    )
}

export default MainLayout;