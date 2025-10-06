import React from "react";
import { Route, Routes } from "react-router-dom";
import SchoolRoutes from "./school-routes/SchoolRoutes";
import SchoolOnBoardRoutes from "./school-onBoard-routes/SchoolOnBoardRoutes";
import PtaRolesRoutes from "./pta-role-routes/PtaRolesRoutes";
import PaperSize from "@/core-modules/admin-module/lookups/paperSize/PaperSizes";
import TemplateTypes from "@/core-modules/admin-module/lookups/templateType/TemplateTypes";

const LookupsRoutes: React.FC = () => {
  return (
    <Routes>
    
      <Route path="schools/*" element={<SchoolRoutes />} />
      <Route path="school-onboard/*" element={<SchoolOnBoardRoutes />} />
      <Route path="pta-role/*" element={<PtaRolesRoutes />} />
      <Route path="paper-size/*" element={<PaperSize />} />
      <Route path="template-type/*" element={<TemplateTypes />} />

    </Routes>
  );
};

export default LookupsRoutes;
