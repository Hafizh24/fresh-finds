import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from 'use-debounce'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import ModalAddAdmin from './components/modalAddAdmin'
import ModalDelete from '../components/modalDelete'
import AdminTable from './components/adminTable'
import ModalEditAdmin from './components/modalEditAdmin'
import AdminSidebar from '../components/sidebarAdminDashboard'
import axios from '../../../api/axios'
import { TableHeader } from '../components/tableHeader'
import { roleCheck, handleSortBy, handleReset, updateURL } from '../components/adminUtils'

export default function AdminManagement() {
  const [adminData, setAdminData] = useState([])
  const [allAdminData, setAllAdminData] = useState([])
  const [clickedData, setClickedData] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  const handleRefreshTable = () => setRefreshTable(!refreshTable)
  const adminDataRedux = useSelector((state) => state.admin.value)
  const token = localStorage.getItem('admtoken')
  const navigate = useNavigate()

  /* MODALS STATES AND HANDLES */
  const [openModalAdd, setOpenAdd] = useState(false) //Modal Add
  const [openModalEdit, setOpenEdit] = useState(false) //Modal Edit
  const [openDelete, setDelete] = useState(false) //Modal Delete
  const handleOpenAdd = () => setOpenAdd(!openModalAdd)
  const handleDelete = (item) => {
    setClickedData(item)
    setDelete(!openDelete)
  }
  const handleEdit = (item) => {
    setClickedData(item)
    setOpenEdit(!openModalEdit)
  }

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
  const handleSortByColumn = (columnName, page = 'admin') => {
    handleSortBy(columnName, setSortBy, orderChange, setSortOrder, setOrderChange, page)
  }
  const handleResetButtonClick = () => {
    handleReset(setSortBy, setOrderChange, setSortOrder, setSearchValue)
  }

  const getAdminData = async (page, sort, order, search) => {
    try {
      const response = await axios.get(`admins?page=${page}&sortBy=${sort}&sortOrder=${order}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setAdminData(response.data?.result.rows)
      setTotalPages(response.data?.totalPages)
      updateURL(navigate, page, sort, order, search)
    } catch (err) {
      console.error(err)
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

  const getAllAdminData = async () => {
    try {
      const response = await axios.get(`admins/no-pagination`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const csvData = response.data.result.map((item) => {
        const branches = item.Branches.map((branch) => branch.name).join(', ')
        return { ...item, branchName: branches }
      })
      setAllAdminData(csvData)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllAdminData()
  }, [])

  useEffect(() => {
    getAllAdminData()
  }, [])

  useEffect(() => {
    roleCheck(navigate, adminDataRedux?.isSuperAdmin)
  }, [adminDataRedux])

  useEffect(() => {
    getAdminData(currentPage, sortBy.toLowerCase(), sortOrder, debouncedSearchValue)
  }, [currentPage, sortBy, sortOrder, debouncedSearchValue, refreshTable])

  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex flex-col h-screen p-5 gap-3 items-center bg-[#edf7f4] w-full">
          <TableHeader
            title={'Admin management'}
            description={'The current list of registered admins.'}
            showAddButton={true}
            addButtonText={'admin'}
            page={'admin-management'}
            handleOpenAdd={handleOpenAdd}
            handleReset={handleResetButtonClick}
            csvData={allAdminData}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <AdminTable
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            adminData={adminData}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
            handleSortBy={handleSortByColumn}
          />
        </div>
      </div>
      <ModalAddAdmin openModalAdd={openModalAdd} handleOpenAdd={handleOpenAdd} handleRefreshTable={handleRefreshTable} />
      <ModalDelete
        api={'/admins'}
        openDelete={openDelete}
        handleDelete={handleDelete}
        getData={getAdminData}
        clickedData={clickedData}
        handleRefreshTable={handleRefreshTable}
      />
      <ModalEditAdmin openModalEdit={openModalEdit} handleEdit={handleEdit} clickedData={clickedData} handleRefreshTable={handleRefreshTable} />
    </>
  )
}
