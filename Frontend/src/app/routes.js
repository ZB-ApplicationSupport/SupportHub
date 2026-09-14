import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CasesPage from "../features/cases/pages/CasesPage";
import CreateCase from "../features/cases/pages/CreateCase";
import LoginForm from "../features/auth/components/LoginForm";
import PasswordsPage from "../features/passwords/pages/PasswordsPage";
import SignUp from "../features/auth/components/SignUp";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "..//features/auth/pages/ResetPassword";
import ReportsPage from "../features/reports/pages/ReportsPage";
import ServerDashboard from "../features/monitoring/pages/ServerMonitoringPage";
import AutomationsPage from "../features/automations/pages/AutomationsPage";
import KnowledgePage from "../features/knowledge/pages/KnowledgePage";
import SettingsPage from "../features/settings/pages/SettingsPage";

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
        <Route
          path="/observability"
          element={<Navigate to="/settings?section=observability" replace />}
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/new" element={<CreateCase />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/automations" element={<AutomationsPage />} />
        <Route path="/passwords" element={<PasswordsPage />} />
        <Route
          path="/users"
          element={<Navigate to="/settings?section=users" replace />}
        />
        <Route
          path="/systems"
          element={<Navigate to="/settings?section=systems" replace />}
        />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
