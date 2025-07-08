import { Home, Search, Map, MapPin , Route  } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="nav-bar flex justify-around items-center fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
            <Link
                to="/main"
                className={`flex flex-col items-center ${
                    isActive("/main") ? "text-primary" : "text-gray-400"
                }`}
            >
                <Home size={24} />
            </Link>
            <Link
                to="/search"
                className={`flex flex-col items-center ${
                    isActive("/search") ? "text-primary" : "text-gray-400"
                }`}
            >
                <Search size={24} />
            </Link>
            <Link
                to="/lines"
                className={`flex flex-col items-center ${
                    isActive("/lines") ? "text-primary" : "text-gray-400"
                }`}
            >
                <MapPin size={24} />
            </Link>
            <Link
                to="/route"
                className={`flex flex-col items-center ${
                    isActive("/route") ? "text-primary" : "text-gray-400"
                }`}
            >
                <Route size={24} />
            </Link>
        </div>
    );
};

export default Navbar;
