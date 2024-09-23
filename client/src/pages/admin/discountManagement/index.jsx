import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from '../../../api/axios'
import { toast } from 'react-toastify'

import AdminSidebar from '../components/sidebarAdminDashboard'
import { TableHeader } from '../components/tableHeader'
import { handleSortBy, handleReset, updateURL } from '../components/adminUtils'
import ModalAddDiscount from './components/modalAddDiscount'
import DiscountTable from './components/discountTable'
import ModalDelete from '../components/modalDelete'
import VoucherTable from './components/voucherTable'

export default function DiscountManagement() {
  //TAB
  const [tabValueFromChild, setTabValueFromChild] = useState(0)
  const handleTabChangeInParent = (value) => {
    setTabValueFromChild(value)
    setSortBy('createdAt')
    setSortByVoucher('createdAt')
  }

  const [discountData, setDiscountData] = useState([])
  const [voucherData, setVoucherData] = useState([])
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
  const handleSortByColumn = (columnName, page = 'discount') => {
    handleSortBy(columnName, setSortBy, orderChange, setSortOrder, setOrderChange, page)
  }
  const handleResetButtonClick = () => {
    handleReset(setSortBy, setOrderChange, setSortOrder, setSearchValue, refreshTable)
  }

  /* FILTERING STATES AND HANDLES */
  const [currentPageVoucher, setCurrentPageVoucher] = useState(1)
  const [totalPagesVoucher, setTotalPagesVoucher] = useState(1)
  const [searchValueVoucher, setSearchValueVoucher] = useState('')
  const [sortOrderVoucher, setSortOrderVoucher] = useState('asc')
  const [orderChangeVoucher, setOrderChangeVoucher] = useState(false)
  const [sortByVoucher, setSortByVoucher] = useState('createdAt')
  const [debouncedSearchValueVoucher] = useDebounce(searchValueVoucher, 500)
  const handlePageChangeVoucher = (newPage) => {
    setCurrentPageVoucher(newPage)
  }
  const handleSortByColumnVoucher = (columnName, page = 'voucher') => {
    handleSortBy(columnName, setSortByVoucher, orderChangeVoucher, setSortOrderVoucher, setOrderChangeVoucher, page)
  }
  const handleResetButtonClickVoucher = () => {
    handleReset(setSortByVoucher, setOrderChangeVoucher, setSortOrderVoucher, setSearchValueVoucher, refreshTable)
  }

  const getDiscountData = async (page, sort, order, search) => {
    try {
      const response = await axios.get(`products/discount?page=${page}&sortBy=${sort}&sortOrder=${order}&search=${search}&admid=${adminDataRedux?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      updateURL(navigate, page, sort, order, search)
      setDiscountData(response.data?.result.rows)
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

  const getVoucherData = async (page, sort, order, search) => {
    try {
      const response = await axios.get(`vouchers/?page=${page}&sortBy=${sort}&sortOrder=${order}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      updateURL(navigate, page, sort, order, search)
      setVoucherData(response.data?.result.rows)
      setTotalPagesVoucher(response.data?.totalPages)
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
    }
  }

  useEffect(() => {
    if (tabValueFromChild === 1) {
      getVoucherData(currentPageVoucher, sortByVoucher.toLowerCase(), sortOrderVoucher, debouncedSearchValueVoucher)
    }
    getVoucherData(currentPageVoucher, sortByVoucher.toLowerCase(), sortOrderVoucher, debouncedSearchValueVoucher)
  }, [currentPageVoucher, debouncedSearchValueVoucher, sortOrderVoucher, sortByVoucher, refreshTable, tabValueFromChild])

  useEffect(() => {
    getDiscountData(currentPage, sortBy.toLowerCase(), sortOrder, debouncedSearchValue)
  }, [currentPage, debouncedSearchValue, sortOrder, sortBy, refreshTable, tabValueFromChild])

  return (
    <div className="flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex flex-col h-screen p-5 gap-3 bg-[#edf7f4] w-full items-center">
        <TableHeader
          title={tabValueFromChild === 0 ? 'Discount Management' : 'Voucher Management'}
          description={'Manage discounts and vouchers.'}
          handleOpenAdd={handleOpenAdd}
          showAddButton={true}
          addButtonText={tabValueFromChild === 0 ? 'discount' : 'voucher'}
          handleReset={tabValueFromChild === 0 ? handleResetButtonClick : handleResetButtonClickVoucher}
          searchValue={tabValueFromChild === 0 ? searchValue : searchValueVoucher}
          setSearchValue={tabValueFromChild === 0 ? setSearchValue : setSearchValueVoucher}
          handleSortBy={handleSortBy}
          onTabChange={handleTabChangeInParent}
        />
        {tabValueFromChild === 0 ? (
          <DiscountTable
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            discountData={discountData}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
            handleSortBy={handleSortByColumn}
          />
        ) : (
          <VoucherTable
            handleDelete={handleDelete}
            voucherData={voucherData}
            currentPage={currentPageVoucher}
            handlePageChange={handlePageChangeVoucher}
            totalPages={totalPagesVoucher}
            handleSortBy={handleSortByColumnVoucher}
          />
        )}
      </div>
      <ModalAddDiscount openModalAdd={openModalAdd} handleOpenAdd={handleOpenAdd} defaultValue={tabValueFromChild} handleRefreshTable={handleRefreshTable} />
      <ModalDelete
        api={tabValueFromChild === 0 ? '/products/discount' : '/vouchers'}
        openDelete={openDelete}
        handleDelete={handleDelete}
        getData={getDiscountData}
        clickedData={clickedData}
        handleRefreshTable={handleRefreshTable}
      />
    </div>
  )
}
