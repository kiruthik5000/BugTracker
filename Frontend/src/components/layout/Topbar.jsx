import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

const roleBadgeColors = {
    ADMIN: "bg-purple-100 text-purple-700",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700",
    DEVELOPER: "bg-emerald-100 text-emerald-700",
    TESTER: "bg-amber-100 text-amber-700",
};

const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        logout();
        navigate("/auth");
    };

    const roleLabel = user?.role?.replace("_", " ") || "";

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <h2 className="text-sm font-medium text-gray-500">
                Welcome back, <span className="text-gray-800 font-semibold">{user?.username}</span>
            </h2>

            <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleBadgeColors[user?.role] || "bg-gray-100 text-gray-600"}`}>
                    {roleLabel}
                </span>
                <button
                    onClick={handleLogout}
                    className="rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Topbar;
