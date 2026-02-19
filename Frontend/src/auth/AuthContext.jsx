import { createContext, useContext, useState, useEffect } from "react";
import { decodeToken } from "../services/authService";
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
        try {
            const res = await getAllUsers();
            const match = res.data.find((u) => u.username === decoded.username);
            setUser(match ? { id: match.id, username: match.username, role: match.role } : decoded);
        } catch {
            setUser(decoded);
        }
        setLoading(false);
    };

    useEffect(() => {
        resolveUser();
    }, []);

    const login = () => resolveUser();

    const logout = () => {
        localStorage.removeItem("token");
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