import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const navItems = [
    { to: "/",            label: "Dashboard",   icon: "📊", roles: null },
    { to: "/bugs",        label: "All Bugs",    icon: "🐛", roles: null },
    { to: "/bugs/new",    label: "Create Bug",  icon: "➕", roles: ["TESTER"] },
    { to: "/projects",    label: "Projects",    icon: "📁", roles: ["PROJECT_MANAGER", "ADMIN"] },
    { to: "/bug-manager", label: "Bug Manager", icon: "⚙️", roles: ["PROJECT_MANAGER", "ADMIN"] },
    { to: "/users",       label: "Users",       icon: "👥", roles: ["ADMIN"] },
];

const Sidebar = () => {
    const { user } = useAuth();

    const visibleItems = navItems.filter(
        (item) => !item.roles || item.roles.includes(user?.role)
    );

    return (
        <aside className="flex h-full w-60 flex-col border-r border-gray-200 bg-white">
            {/* Logo */}
            <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-base">
                    🪲
                </span>
                <span className="text-base font-bold tracking-tight text-gray-800">
                    BugTracker
                </span>
            </div>

            {/* Nav */}
            <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
                {visibleItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                            }`
                        }
                    >
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
