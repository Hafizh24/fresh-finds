import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import AdminSidebar from '../components/sidebarAdminDashboard'
import { TableHeader } from '../components/tableHeader'
import CategoryTable from './components/categoryTable'
import axios from '../../../api/axios'
import { handleSortBy, handleReset, updateURL } from '../components/adminUtils'
import ModalAddCategory from './components/modalAddCategory'
import ModalDelete from '../components/modalDelete'
import ModalEditCategory from './components/modalEditCategory'

export default function CategoryManagement() {
  //TAB
  const [tabValueFromChild, setTabValueFromChild] = useState(0)
  const handleTabChangeInParent = (value) => {
    setTabValueFromChild(value)
  }

  const [categoryData, setCategoryData] = useState([])
  const [subCategoryData, setSubCategoryData] = useState([])
  const [clickedData, setClickedData] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  const handleRefreshTable = () => setRefreshTable(!refreshTable)
  const adminDataRedux = useSelector((state) => state.admin.value)
  console.log('adminDataRedux', adminDataRedux)
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
  const handleSortByColumn = (columnName) => {
    handleSortBy(columnName, setSortBy, orderChange, setSortOrder, setOrderChange)
  }
  const handleResetButtonClick = () => {
    handleReset(setSortBy, setOrderChange, setSortOrder, setSearchValue, refreshTable)
  }

  /* FILTERING STATES AND HANDLES */
  const [currentPageSub, setCurrentPageSub] = useState(1)
  const [totalPagesSub, setTotalPagesSub] = useState(1)
  const [searchValueSub, setSearchValueSub] = useState('')
  const [sortOrderSub, setSortOrderSub] = useState('asc')
  const [orderChangeSub, setOrderChangeSub] = useState(false)
  const [sortBySub, setSortBySub] = useState('createdAt')
  const [debouncedSearchValueSub] = useDebounce(searchValueSub, 500)
  const handlePageChangeSub = (newPage) => {
    setCurrentPageSub(newPage)
  }
  const handleSortByColumnSub = (columnName) => {
    handleSortBy(columnName, setSortBySub, orderChangeSub, setSortOrderSub, setOrderChangeSub)
  }
  const handleResetButtonClickSub = () => {
    handleReset(setSortBySub, setOrderChangeSub, setSortOrderSub, setSearchValueSub, refreshTable)
  }

  const getCategoryData = async (page, sort, order, search) => {
    try {
      const response = await axios.get(`categories?page=${page}&sortBy=${sort}&sortOrder=${order}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('ctg', response)
      updateURL(navigate, page, sort, order, search)
      setCategoryData(response.data?.result.rows)
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

  const getSubCategoryData = async (page, sort, order, search) => {
    try {
      const response = await axios.get(`/categories/sub-category?all=${true}&page=${page}&sortBy=${sort}&sortOrder=${order}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      updateURL(navigate, page, sort, order, search)
      setSubCategoryData(response.data?.result.rows)
      setTotalPagesSub(response.data?.totalPages)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (tabValueFromChild === 1) {
      getSubCategoryData(currentPageSub, sortBy.toLowerCase(), sortOrderSub, debouncedSearchValueSub)
    }
    getSubCategoryData(currentPageSub, sortBy.toLowerCase(), sortOrderSub, debouncedSearchValueSub)
  }, [currentPageSub, debouncedSearchValueSub, sortOrderSub, sortBySub, refreshTable, tabValueFromChild])

  useEffect(() => {
    getCategoryData(currentPage, sortBy.toLowerCase(), sortOrder, debouncedSearchValue)
  }, [currentPage, debouncedSearchValue, sortOrder, sortBy, refreshTable, tabValueFromChild])

  return (
    <div className="flex flex-col lg:flex-row">
      <AdminSidebar subMenuStatus={true} />

      <div className="flex flex-col h-screen p-5 gap-3 bg-[#edf7f4] w-full items-center">
        <TableHeader
          title={tabValueFromChild === 0 ? 'Category Management' : 'Subcategory Management'}
          description={'The current list of categories.'}
          page={'category-management'}
          handleOpenAdd={handleOpenAdd}
          showAddButton={adminDataRedux?.isSuperAdmin === true ? true : false}
          addButtonText={tabValueFromChild === 0 ? 'category' : 'sub category'}
          handleReset={tabValueFromChild === 0 ? handleResetButtonClick : handleResetButtonClickSub}
          searchValue={tabValueFromChild === 0 ? searchValue : searchValueSub}
          setSearchValue={tabValueFromChild === 0 ? setSearchValue : setSearchValueSub}
          handleSortBy={handleSortBy}
          onTabChange={handleTabChangeInParent}
        />
        {tabValueFromChild === 0 ? (
          <CategoryTable
            tabValueFromChild={tabValueFromChild}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            categoryData={categoryData}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
            handleSortBy={handleSortByColumn}
          />
        ) : (
          <CategoryTable
            tabValueFromChild={tabValueFromChild}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            categoryData={subCategoryData}
            currentPage={currentPageSub}
            handlePageChange={handlePageChangeSub}
            totalPages={totalPagesSub}
            handleSortBy={handleSortByColumnSub}
          />
        )}
      </div>

      <ModalAddCategory openModalAdd={openModalAdd} handleOpenAdd={handleOpenAdd} defaultValue={tabValueFromChild} handleRefreshTable={handleRefreshTable} />
      <ModalDelete
        api={tabValueFromChild === 0 ? '/categories' : '/categories/sub-category'}
        openDelete={openDelete}
        handleDelete={handleDelete}
        getData={getCategoryData}
        clickedData={clickedData}
        handleRefreshTable={handleRefreshTable}
      />
      <ModalEditCategory
        api={tabValueFromChild === 0 ? '/categories' : '/categories/sub-category/'}
        tabValueFromChild={tabValueFromChild}
        openModalEdit={openModalEdit}
        handleEdit={handleEdit}
        handleRefreshTable={handleRefreshTable}
        clickedData={clickedData}
      />
    </div>
  )
}
