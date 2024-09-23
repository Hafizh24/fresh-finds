import { useSelector } from 'react-redux'

import AdminSidebar from '../components/sidebarAdminDashboard'
import { AdminProfileCard } from './components/profileCard'
import AdminProfileForm from './components/profileForm'

export default function AdminProfile() {
  const adminData = useSelector((state) => state.admin.value)

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <AdminSidebar />
      <div className="flex flex-row items-center justify-center w-full bg-[#edf7f4] gap-5">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
          <AdminProfileCard adminData={adminData} />
          <AdminProfileForm adminData={adminData} />
        </div>
      </div>
    </div>
  )
}
