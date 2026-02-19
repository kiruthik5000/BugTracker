import { createContext, useContext, useState, useCallback, useMemo } from "react";

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success", duration = 3500) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
            );
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 300);
        }, duration);
    }, []);

    const toast = useMemo(() => ({
        success: (msg) => addToast(msg, "success"),
        error: (msg) => addToast(msg, "error"),
        info: (msg) => addToast(msg, "info"),
    }), [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast container */}
            <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: '380px' }}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${
                            t.exiting ? "animate-slide-out-right" : "animate-slide-in-right"
                        } ${
                            t.type === "success"
                                ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
                                : t.type === "error"
                                ? "border-red-200 bg-red-50/95 text-red-800"
                                : "border-blue-200 bg-blue-50/95 text-blue-800"
                        }`}
                    >
                        <span className="text-base">
                            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
                        </span>
                        <p className="text-sm font-medium">{t.message}</p>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
