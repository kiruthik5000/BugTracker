import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { logoutUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const navItems = [
    { to: "/",            label: "Dashboard",   icon: "📊", roles: null },
    { to: "/bugs",        label: "All Bugs",    icon: "🐛", roles: null },
    { to: "/bugs/new",    label: "Report Bug",  icon: "➕", roles: ["TESTER"] },
    { to: "/projects",    label: "Projects",    icon: "📁", roles: ["PROJECT_MANAGER", "ADMIN"] },
    { to: "/bug-manager", label: "Bug Manager", icon: "⚙️", roles: ["PROJECT_MANAGER", "ADMIN"] },
    { to: "/users",       label: "Users",       icon: "👥", roles: ["ADMIN"] },
];

const roleBadgeColors = {
    ADMIN: "bg-purple-100 text-purple-700",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700",
    DEVELOPER: "bg-emerald-100 text-emerald-700",
    TESTER: "bg-amber-100 text-amber-700",
};

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const visibleItems = navItems.filter(
        (item) => !item.roles || item.roles.includes(user?.role)
    );

    const handleLogout = () => {
        logoutUser();
        logout();
        navigate("/auth");
    };

    const roleLabel = user?.role?.replace("_", " ") || "";

    return (
        <aside className="flex h-full w-64 flex-col border-r border-gray-200/80 bg-white">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-base shadow-sm">
                    🪲
                </span>
                <span className="text-lg font-bold tracking-tight text-gray-800">
                    BugTracker
                </span>
            </div>

            {/* Nav */}
            <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-3">
                {visibleItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? "bg-blue-50 text-blue-700 shadow-sm"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
                                )}
                                <span className="text-base transition-transform duration-200 group-hover:scale-110">
                                    {item.icon}
                                </span>
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User section */}
            <div className="border-t border-gray-100 px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-xs font-bold text-white shadow-sm">
                        {user?.username?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">
                            {user?.username}
                        </p>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${roleBadgeColors[user?.role] || "bg-gray-100 text-gray-600"}`}>
                            {roleLabel}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
