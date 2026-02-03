import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./Compontents/Auth";
import Home from "./Compontents/Home";
import ProtectedRoute from "./auth/ProtectedRoute";
const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
