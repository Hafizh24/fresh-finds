import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminSidebar from '../components/sidebarAdminDashboard'
import { StoreOverview } from './components/storeOverview'
import { roleCheck } from '../components/adminUtils'

export const StoreManagement = () => {
  const adminDataRedux = useSelector((state) => state.admin.value)
  const navigate = useNavigate()
  console.log('adminDataRedux', adminDataRedux)

  useEffect(() => {
    roleCheck(navigate, adminDataRedux?.isSuperAdmin)
  }, [adminDataRedux])

  return (
    <>
      {adminDataRedux?.isSuperAdmin === true ? (
        <>
          <div className="flex flex-col lg:flex-row">
            <AdminSidebar />
            <div className="flex flex-col px-[10px] lg:p-5 gap-3 bg-[#edf7f4] w-full h-screen">
              <StoreOverview />
            </div>
          </div>
        </>
      ) : (
        ''
      )}
    </>
  )
}
