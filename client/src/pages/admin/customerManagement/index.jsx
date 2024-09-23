/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import AdminSidebar from '../components/sidebarAdminDashboard'
import { TableHeader } from '../components/tableHeader'
import CustomerTable from './components/customerTable'
import { handleReset, handleSortBy, updateURL } from '../components/adminUtils'
import axios from '../../../api/axios'

export default function CustomerManagement() {
  const [customerData, setCustomerData] = useState([])
  const [allCustomerData, setAllCustomerData] = useState([])
  const [clickedData, setClickedData] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  const handleRefreshTable = () => setRefreshTable(!refreshTable)
  const token = localStorage.getItem('admtoken')
  const navigate = useNavigate()

  /* FILTERING STATES AND HANDLES */
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [orderChange, setOrderChange] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt')
  const [debouncedSearchValue] = useDebounce(searchValue, 500)
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }
  const handleSortByColumn = (columnName, page = 'customer-management') => {
    handleSortBy(columnName, setSortBy, orderChange, setSortOrder, setOrderChange, page)
  }
  const handleResetButtonClick = () => {
    handleReset(setSortBy, setOrderChange, setSortOrder, setSearchValue)
  }

  const getCustomerData = async (page, sort, order, search) => {
    try {
      const response = await axios.get(`customer/all?page=${page}&sortBy=${sort}&sortOrder=${order}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const response_all = await axios.get(`customer/all?all=${true}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setAllCustomerData(response_all.data?.result)
      setCustomerData(response.data?.result.rows)
      setTotalPages(response.data?.totalPages)
      updateURL(navigate, page, sort, order, search)
    } catch (err) {
      console.log(err)
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

  useEffect(() => {
    getCustomerData(currentPage, sortBy.toLowerCase(), sortOrder, debouncedSearchValue)
  }, [currentPage, sortBy, sortOrder, debouncedSearchValue, refreshTable])

  return (
    <div className="flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex flex-col  h-screen p-5 gap-3 items-center bg-[#edf7f4] w-full">
        <TableHeader
          title={'Customer Management'}
          description={'The current list of registered customers.'}
          showAddButton={false}
          handleReset={handleResetButtonClick}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          page={'customer-management'}
          csvData={allCustomerData}
        />
        <CustomerTable
          customerData={customerData}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          handleSortBy={handleSortByColumn}
        />
      </div>
    </div>
  )
}
