/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useDebounce } from 'use-debounce'
import { useNavigate } from 'react-router-dom'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Button, Option, Select, Typography } from '@material-tailwind/react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import AdminSidebar from '../components/sidebarAdminDashboard'
import { TableHeader } from '../components/tableHeader'
import ModalAddProduct from './components/modalAddProduct'
import ProductCard from '../components/productCard'
import axios from '../../../api/axios'
import { handleSortBy, handleReset, updateURL } from '../components/adminUtils'

const filterItems = [
  { title: 'All', sort: 'createdAt', order: 'asc' },
  { title: 'Price: Lowest first', sort: 'price', order: 'asc' },
  { title: 'Price: Highest first', sort: 'price', order: 'desc' },
  { title: 'Name: A - Z', sort: 'name', order: 'asc' },
  { title: 'Name: Z - A', sort: 'name', order: 'desc' },
  { title: 'Weight: A - Z', sort: 'weight', order: 'asc' },
  { title: 'Weight: Z - A', sort: 'weight', order: 'desc' },
  { title: 'Latest', sort: 'createdAt', order: 'desc' },
  { title: 'Oldest', sort: 'createdAt', order: 'asc' },
  { title: 'Active', sort: 'active', order: 'desc' },
  { title: 'Disabled', sort: 'disabled', order: 'desc' }
]

export default function ProductManagement() {
  const navigate = useNavigate()
  const adminDataRedux = useSelector((state) => state.admin.value)
  const [productData, setProductData] = useState([])
  const [allProductData, setAllProductData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  const handleRefreshTable = () => setRefreshTable(!refreshTable)
  const token = localStorage.getItem('admtoken')

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
  const [filterByCategory, setFilterByCategory] = useState(0)
  const handleFilterByCategory = (item) => {
    setFilterByCategory(item)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }
  const handleSort = (sort, order) => {
    setSortBy(sort)
    setSortOrder(order)
  }
  const handleResetButtonClick = () => {
    setSearchValue('')
    setFilterByCategory(0)
    setCurrentPage(1)
  }

  const getProductData = async (page, sort, order, search) => {
    try {
      const response = await axios.get(`products?page=${page}&sortBy=${sort}&sortOrder=${order}&category=${filterByCategory}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const response_all = await axios.get(`products?all=${true}&page=${page}&sortBy=${sort}&sortOrder=${order}&category=${filterByCategory}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      updateURL(navigate, page, sort, order, search)
      setAllProductData(response_all.data?.result)
      setProductData(response.data?.result.rows)
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

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(`/categories?all=true}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCategoryData(response.data.result.rows)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getProductData(currentPage, sortBy.toLowerCase(), sortOrder, debouncedSearchValue)
  }, [currentPage, debouncedSearchValue, sortOrder, sortBy, filterByCategory, refreshTable])

  useEffect(() => {
    fetchCategoryData()
  }, [])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  })

  return (
    <div className="flex flex-col lg:flex-row">
      <AdminSidebar subMenuStatus={true} />
      <div className="flex flex-col p-5 gap-7 bg-[#edf7f4] w-full items-center">
        <TableHeader
          title={'Product Management'}
          page={'product-management'}
          description={'The current list of products.'}
          handleOpenAdd={handleOpenAdd}
          handleReset={handleResetButtonClick}
          showAddButton={adminDataRedux.isSuperAdmin === true ? true : false}
          addButtonText={'product'}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleFilterByCategory={handleFilterByCategory}
          csvData={allProductData}
        />
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
          {/* <Select size="lg" label="Filter by category" onChange={(value) => handleFilterByCategory(value)} className="bg-white">
            {categoryData?.map((item, index) => (
              <Option key={index} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select> */}
          {/* <Select size="lg" label="Sort by" className="bg-white">
            {filterItems.map((item, index) => (
              <Option
                key={index}
                className="text-gray-600 text-[15px] font-medium py-1 px-5 hover:bg-[#F0FAF7] cursor-pointer transition ease-in-out delay-100 hover:text-[#3A826E]"
                onClick={() => {
                  handleSort(item.sort, item.order)
                }}>
                {item.title}
              </Option>
            ))}
          </Select> */}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {productData?.map(
            (item, index) => !item.isDeleted && <ProductCard key={index} productData={item} adminDataRedux={adminDataRedux} handleRefreshTable={handleRefreshTable} />
          )}
        </div>
        <div className="flex flex-row gap-2 items-center justify-center bg-white p-4 rounded-lg shadow-sm">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {totalPages}
          </Typography>
          <div className="flex gap-2">
            <Button onClick={() => handlePageChange(currentPage - 1)} variant="text" size="sm" disabled={currentPage === 1}>
              Previous
            </Button>
            <Button onClick={() => handlePageChange(currentPage + 1)} variant="text" size="sm" disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </div>
      <ModalAddProduct openModalAdd={openModalAdd} handleOpenAdd={handleOpenAdd} handleRefreshTable={handleRefreshTable} />
    </div>
  )
}
