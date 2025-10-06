// src/routes/moduleRoutes/ProfileRoutes.tsx

import React from "react";
import { Route, Routes } from "react-router-dom";
import Profile from "@/core-modules/admin-module/base-module/profile/Profile";
import EditProfile from "@/core-modules/admin-module/base-module/profile/EditProfile";
import CertificateTemplate from "@/core-modules/admin-module/certificate/CertificateTemplate";
import AddCertificateTemplate from "@/core-modules/admin-module/certificate/AddCertificateTemplate";

const CertificateRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CertificateTemplate />} />
      <Route path="/add" element={<AddCertificateTemplate />} />
      <Route path="/edit-profile/:id" element={<EditProfile />} />
    </Routes>
  );
};

export default CertificateRoute;
