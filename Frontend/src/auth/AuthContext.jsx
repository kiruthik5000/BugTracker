import { createContext, useContext, useState, useEffect } from "react";
import { decodeToken, getStoredUserId, logoutUser } from "../services/authService";
import { getAllUsers } from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const resolveUser = async () => {
        const decoded = decodeToken();
        if (!decoded) {
            setUser(null);
            setLoading(false);
            return;
        }
        const fallbackId = decoded.id ?? getStoredUserId();
        try {
            const res = await getAllUsers();
            const match = res.data.find((u) => u.username === decoded.username);
            if (match) {
                localStorage.setItem("userId", String(match.id));
                setUser({ id: match.id, username: match.username, role: match.role });
            } else {
                setUser({ ...decoded, id: fallbackId });
            }
        } catch {
            setUser({ ...decoded, id: fallbackId });
        }
        setLoading(false);
    };

    useEffect(() => {
        resolveUser();
    }, []);

    const login = () => resolveUser();

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);