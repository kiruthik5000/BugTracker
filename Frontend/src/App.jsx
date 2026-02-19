import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Compontents/Auth";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleGuard from "./components/shared/RoleGuard";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import BugsList from "./pages/BugsList";
import CreateBug from "./pages/CreateBug";
import BugDetail from "./pages/BugDetail";
import BugManagerPage from "./pages/BugManagerPage";
import ProjectsPage from "./pages/ProjectsPage";
import UsersPage from "./pages/UsersPage";

/* 404 Page */
const NotFound = () => (
    <div className="flex flex-col items-center justify-center py-20">
        <p className="text-6xl font-bold text-gray-200">404</p>
        <p className="mt-3 text-lg font-semibold text-gray-600">Page not found</p>
        <p className="mt-1 text-sm text-gray-400">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
            Back to Dashboard
        </a>
    </div>
);

const App = () => {
    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />

            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Dashboard />} />
                <Route path="/bugs" element={<BugsList />} />
                <Route
                    path="/bugs/new"
                    element={
                        <RoleGuard allowedRoles={["TESTER"]} fallback={<Navigate to="/" replace />}>
                            <CreateBug />
                        </RoleGuard>
                    }
                />
                <Route path="/bugs/:id" element={<BugDetail />} />
                <Route
                    path="/bug-manager"
                    element={
                        <RoleGuard allowedRoles={["PROJECT_MANAGER", "ADMIN"]} fallback={<Navigate to="/" replace />}>
                            <BugManagerPage />
                        </RoleGuard>
                    }
                />
                <Route
                    path="/projects"
                    element={
                        <RoleGuard allowedRoles={["PROJECT_MANAGER", "ADMIN"]} fallback={<Navigate to="/" replace />}>
                            <ProjectsPage />
                        </RoleGuard>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <RoleGuard allowedRoles={["ADMIN"]} fallback={<Navigate to="/" replace />}>
                            <UsersPage />
                        </RoleGuard>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
    );
};

export default App;
