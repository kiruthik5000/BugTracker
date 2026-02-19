import { useAuth } from "../../auth/AuthContext";
import { useLocation } from "react-router-dom";

const pageNames = {
    "/": "Dashboard",
    "/bugs": "All Bugs",
    "/bugs/new": "Report a Bug",
    "/bug-manager": "Bug Manager",
    "/projects": "Projects",
    "/users": "User Management",
};

const Topbar = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Build page title from route
    let pageTitle = pageNames[location.pathname] || "";
    if (!pageTitle && location.pathname.startsWith("/bugs/")) {
        pageTitle = "Bug Details";
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/80 px-6 backdrop-blur-sm">
            <div>
                {pageTitle && (
                    <h2 className="text-base font-bold text-gray-800">{pageTitle}</h2>
                )}
                <p className="text-xs text-gray-400">
                    {getGreeting()}, {user?.username}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
                    {user?.username?.charAt(0)?.toUpperCase() || "?"}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
