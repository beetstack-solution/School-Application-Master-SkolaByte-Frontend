// src/routes/AdminRoutes.tsx

import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "@/assets/css/index.css"; // Import the consolidated CSS file

// Lazy load components
const Dashboard = lazy(
  () => import("@/core-modules/admin-module/main-pages/Dashboard")
);
const Login = lazy(() => import("@/core-modules/auth-module/auth/login/Login"));
const Layout = lazy(() => import("@/layouts/Layout"));
const UserRoutes = lazy(() => import("@/routes/module-routes/UserRoutes"));
const ProfileRoutes = lazy(
  () => import("@/routes/module-routes/ProfileRoutes")
);
const SchoolCodeLogin = lazy(
  () => import("@/core-modules/auth-module/auth/login/SchoolCodeLogin")
);
import { PrivateRoute } from "./PrivateRoute";
import RoleRoutes from "./module-routes/RoleRoutes";
import LookupsRoutes from "./lookups-routes/LookupsRoutes";
import SpinnerLoader from "@/components/SpinnerLoader";
import CertificateTemplate from "@/core-modules/admin-module/certificate/CertificateTemplate";
import CertificateRoute from "./module-routes/CertificateRoute";
const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={
         <Suspense fallback={<SpinnerLoader />}>
        <Login />
        </Suspense>
      } />
      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={  <Suspense fallback={<SpinnerLoader />}><Layout /></Suspense>}>
          <Route index element={<Suspense fallback={<SpinnerLoader />}><Dashboard /></Suspense>} />
          {/* Include the UserRoutes */}
          <Route path="users/*" element={  <Suspense fallback={<SpinnerLoader />}><UserRoutes /></Suspense>} />
          <Route path="profile/*" element={<ProfileRoutes />} />
          <Route path="roles/*" element={<RoleRoutes />} />
          <Route path="lookups/*" element={<LookupsRoutes />} />
          <Route path="certificate-template/*" element={<CertificateRoute />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
