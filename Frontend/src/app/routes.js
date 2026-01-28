import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardPage from "../modules/dashboard/DashboardPage";
import CasesPage from "../modules/cases/CasesPage";
import CreateCase from "../modules/cases/CreateCase";
import EditCase from "../modules/cases/EditCase";
import UsersPage from "../modules/users/UsersPage";
import ReportsPage from "../modules/reports/ReportsPage";
import LoginForm from "../modules/auth/LoginForm";
import KnowledgeBasePage from "../modules/knowledge/KnowledgeBasePage";
import KnowledgeBaseArticlePage from "../modules/knowledge/KnowledgeBaseArticlePage";
import SystemsPage from "../modules/systems/SystemsPage";

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<LoginForm />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/new" element={<CreateCase />} />
        <Route path="/cases/:caseId/edit" element={<EditCase />} />
        <Route path="/knowledge" element={<KnowledgeBasePage />} />
        <Route path="/knowledge/:articleId" element={<KnowledgeBaseArticlePage />} />
        <Route path="/systems" element={<SystemsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
