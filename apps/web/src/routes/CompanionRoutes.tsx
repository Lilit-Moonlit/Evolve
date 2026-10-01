import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import WelcomeScreen from "@/components/Companion/WelcomeScreen";
import UserAuthScreen from "@/components/Companion/UserAuthScreen";
import LabAuthScreen from "@/components/Companion/LabAuthScreen";
import UploadTest from "@/components/Companion/UploadTest";
import Result from "@/components/Companion/Result";
import Profile from "@/components/Companion/Profile";
import VerifyPartner from "@/components/Companion/VerifyPartner";
import LabRegister from "@/components/Companion/LabRegister";
import LabProfile from "@/components/Companion/LabProfile";
import LabDashboard from "@/components/Companion/LabDashboard";
import LabScanQR from "@/components/Companion/LabScanQR";
import LabVerifyPatient from "@/components/Companion/LabVerifyPatient";
import LabAddResult from "@/components/Companion/LabAddResult";
import Search from "@/components/Companion/Search";
import Chat from "@/components/Companion/Chat";

/**
 * Companion-mode routes with RELATIVE paths, designed to be mounted under
 * `companion/*` in a parent router:
 *
 *   <Route path="companion/*" element={<CompanionRoutes />} />
 *
 * (see App.tsx — it mounts them both in the main app and standalone).
 */
export const CompanionRoutes: React.FC = () => (
  <Routes>
    <Route index element={<WelcomeScreen />} />
    <Route path="auth" element={<UserAuthScreen />} />
    <Route path="lab/auth" element={<LabAuthScreen />} />
    <Route path="upload" element={<UploadTest />} />
    <Route path="result" element={<Result />} />
    <Route path="profile" element={<Profile />} />
    <Route path="verify/:userId" element={<VerifyPartner />} />
    <Route path="lab/register" element={<LabRegister />} />
    <Route path="lab/profile" element={<LabProfile />} />
    <Route path="lab/dashboard" element={<LabDashboard />} />
    <Route path="lab/scan" element={<LabScanQR />} />
    <Route path="lab/verify/:userId" element={<LabVerifyPatient />} />
    <Route path="lab/add-result/:userId" element={<LabAddResult />} />
    <Route path="search" element={<Search />} />
    <Route path="chat/:userId" element={<Chat />} />
    <Route path="*" element={<Navigate to="/companion" replace />} />
  </Routes>
);

export default CompanionRoutes;
