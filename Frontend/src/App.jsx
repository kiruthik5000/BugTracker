import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./Compontents/Auth";
import ProtectedRoute from "./auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import BugsList from "./pages/BugsList";
import CreateBug from "./pages/CreateBug";
import BugDetail from "./pages/BugDetail";
import BugManagerPage from "./pages/BugManagerPage";
import ProjectsPage from "./pages/ProjectsPage";
import UsersPage from "./pages/UsersPage";

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
                <Route path="/bugs/new" element={<CreateBug />} />
                <Route path="/bugs/:id" element={<BugDetail />} />
                <Route path="/bug-manager" element={<BugManagerPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/users" element={<UsersPage />} />
            </Route>
        </Routes>
    );
};

export default App;
