import { useAuth } from "../../auth/AuthContext";

const RoleGuard = ({ allowedRoles, children, fallback = null }) => {
    const { user } = useAuth();
    if (!user || !allowedRoles.includes(user.role)) return fallback;
    return children;
};

export default RoleGuard;
