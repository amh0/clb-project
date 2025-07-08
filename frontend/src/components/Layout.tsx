import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
    return (
        <div className="app-container">
            <div className="page-content">
                <Outlet />
            </div>
            <Navbar />
        </div>
    );
};

export default Layout;
