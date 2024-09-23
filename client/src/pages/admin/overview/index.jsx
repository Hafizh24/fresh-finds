import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import AdminSidebar from '../components/sidebarAdminDashboard'
import { getCardData } from './components/cardData'
import CardOverview from './components/cardOverview'

export default function Overview() {
  const [cards, setCards] = useState([])
  const adminDataRedux = useSelector((state) => state.admin.value)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCardData(adminDataRedux)
        setCards(data)
      } catch (err) {
        console.error('Error fetching data:', err)
        toast.error(err.response.data.message, {
          position: 'top-center',
          hideProgressBar: true,
          theme: 'colored'
        })
        if (err.response.data.relogin === true) {
          localStorage.removeItem('admtoken')
          navigate('/login-admin')
        }
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <AdminSidebar />
      <div className="flex flex-col p-1 md:p-9 w-full bg-[#edf7f4]">
        <p className="font-bold text-lg">Overview</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-9 items-center text-center text-white">
          {cards
            .filter((item) => adminDataRedux.isSuperAdmin || item.admin)
            .map((item, index) => (
              <CardOverview key={index} title={item.title} desc={item.desc} path={item.path} icon={item.icon} data={item.data} latest_data={item.latest_data} />
            ))}
        </div>
      </div>
    </div>
  )
}
