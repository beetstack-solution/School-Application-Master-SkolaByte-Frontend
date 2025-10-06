import AddSchool from '@/core-modules/admin-module/lookups/school/AddSchool'
import EditSchool from '@/core-modules/admin-module/lookups/school/EditSchool'
import School from '@/core-modules/admin-module/lookups/school/School'
import ViewSchool from '@/core-modules/admin-module/lookups/school/ViewSchool'
import { Route, Routes } from 'react-router-dom'

const SchoolRoutes = () => {
  return (
      <Routes>
          <Route path="/" element={<School />} />
          <Route path="add/" element={<AddSchool />} />
          <Route path="view/:id" element={<ViewSchool />} />
          <Route path="edit/:id" element={<EditSchool />} />


      </Routes> 
       )
}

export default SchoolRoutes