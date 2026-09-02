import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../modules/dashboard/DashboardPage";
import CasesPage from "../modules/cases/CasesPage";
import CreateCase from "../modules/cases/CreateCase";
import UsersPage from "../modules/users/UsersPage";
import LoginForm from "../modules/auth/LoginForm";
import PasswordsPage from "../modules/passwords/PasswordsPage";
import SignUp from "../modules/auth/SignUp";
import ForgotPassword from "../modules/auth/ForgotPassword";
import ResetPassword from "../modules/auth/ResetPassword";
import ReportsPage from "../modules/reports/ReportsPage";
import ServerDashboard from "../modules/dashboard/ServersDashboard";

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<DashboardLayout />}>
          <Route
              path="/server-dashboard"
              element={<ServerDashboard />}
          />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/new" element={<CreateCase />} />
        <Route path="/passwords" element={<PasswordsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
