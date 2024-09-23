import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { handleReset, handleSortBy, updateURL } from '../components/adminUtils'
import AdminSidebar from '../components/sidebarAdminDashboard'
import axios from '../../../api/axios'
import { TableHeader } from '../components/tableHeader'
import StockTable from './components/stockTable'
import ModalEditStock from './components/modalEditStock'
import ModalStockHistory from './components/modalStockHistory'
import ModalDelete from '../components/modalDelete'

export default function StockManagement() {
  const [productBranchData, setProductBranchData] = useState([])
  const [clickedData, setClickedData] = useState([])
  const [branchId, setBranchId] = useState('')
  const handleFilterByBranch = (value) => {
    setBranchId(value)
    setCurrentPage(1)
  }
  const [refreshTable, setRefreshTable] = useState(false)
  const handleRefreshTable = () => setRefreshTable(!refreshTable)
  const adminDataRedux = useSelector((state) => state.admin.value)
  const token = localStorage.getItem('admtoken')
  const navigate = useNavigate()

  /* MODALS STATES AND HANDLES */
  const [openModalEdit, setOpenEdit] = useState(false) //Modal Edit
  const handleEdit = (item) => {
    setClickedData(item)
    setOpenEdit(!openModalEdit)
  }
  const [openModalHistory, setOpenHistory] = useState(false) //Modal History
  const handleHistory = (item) => {
    setClickedData(item)
    setOpenHistory(!openModalHistory)
  }
  const [openDelete, setDelete] = useState(false) //Modal Delete
  const handleDelete = (item) => {
    setClickedData(item)
    setDelete(!openDelete)
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
  const handleSortByColumn = (columnName, page = 'stock') => {
    handleSortBy(columnName, setSortBy, orderChange, setSortOrder, setOrderChange, page)
  }
  const handleResetButtonClick = () => {
    handleReset(setSortBy, setOrderChange, setSortOrder, setSearchValue, setBranchId)
  }

  const getBranchProductData = async (page, sort, order, search) => {
    try {
      const response = await axios.get(
        `products/branch-product?page=${page}&sortBy=${sort}&sortOrder=${order}&search=${search}&admid=${adminDataRedux.id}&branch_id=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('response', response)
      updateURL(navigate, page, sort, order, search)
      setProductBranchData(response.data?.result.rows)
      setTotalPages(response.data?.totalPages)
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
    if (adminDataRedux.id) {
      getBranchProductData(currentPage, sortBy.toLowerCase(), sortOrder, debouncedSearchValue)
    }
  }, [adminDataRedux.id, currentPage, sortBy, sortOrder, debouncedSearchValue, branchId, refreshTable])

  return (
    <div className="flex flex-col lg:flex-row">
      <AdminSidebar subMenuStatus={true} />
      <div className="flex flex-col h-screen p-5 gap-3 bg-[#edf7f4] w-full items-center">
        <TableHeader
          title={'Stock Management'}
          description={'Manage stock of products'}
          showAddButton={false}
          searchValue={searchValue}
          handleReset={handleResetButtonClick}
          setSearchValue={setSearchValue}
          page={'stock'}
          handleFilterByBranch={handleFilterByBranch}
          csvData={productBranchData}
        />
        <StockTable
          handleEdit={handleEdit}
          handleHistory={handleHistory}
          handleDelete={handleDelete}
          productBranchData={productBranchData}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          handleSortBy={handleSortByColumn}
        />
      </div>
      <ModalEditStock
        api={'/products/branch-product/stock'}
        openModalEdit={openModalEdit}
        handleEdit={handleEdit}
        handleRefreshTable={handleRefreshTable}
        clickedData={clickedData}
      />
      <ModalStockHistory openModalHistory={openModalHistory} handleHistory={handleHistory} clickedData={clickedData} />
      <ModalDelete
        api={'/products/branch-product'}
        openDelete={openDelete}
        handleDelete={handleDelete}
        getData={getBranchProductData}
        clickedData={clickedData}
        handleRefreshTable={handleRefreshTable}
      />
    </div>
  )
}
