import SchoolOnBoard from '@/core-modules/admin-module/lookups/school-onBoard/SchoolOnBoard'
import ViewSchoolOnBoard from '@/core-modules/admin-module/lookups/school-onBoard/ViewSchoolOnBoard'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const SchoolOnBoardRoutes = () => {
  return (
       <Routes>
              <Route path="/" element={<SchoolOnBoard />} />
              <Route path="view/:id" element={<ViewSchoolOnBoard />} />
    
    
          </Routes>
  )
}

export default SchoolOnBoardRoutes