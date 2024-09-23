/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography, Select, Option } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { updateURL } from '../../components/adminUtils'
import axios from '../../../../api/axios'
import StockHistoryTable from './stockHistoryTable'

export default function ModalStockHistory({ openModalHistory, handleHistory, clickedData }) {
  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1)
  const [productBranchHistory, setProductBranchHistory] = useState([])
  const [totalDataChanges, setTotalDataChanges] = useState()
  const [totalIncrement, setTotalIncrement] = useState()
  const [totalDecrement, setTotalDecrement] = useState()
  const [finalStock, setFinalStock] = useState()
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
  const handleSortByColumn = (columnName) => {
    handleSortBy(columnName, setSortBy, orderChange, setSortOrder, setOrderChange)
  }
  const handleResetButtonClick = () => {
    handleReset(setSortBy, setOrderChange, setSortOrder, setSearchValue)
  }

  const getBranchProductHistory = async (page, sort, order, search) => {
    try {
      const response = await axios.get(
        `products/history?page=${page}&sortBy=${sort}&sortOrder=${order}&search=${search}&id=${clickedData?.id}&month=${parseInt(currentMonth)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setProductBranchHistory(response.data?.result.rows)
      setTotalDataChanges(response.data?.result.count)
      setTotalIncrement(response.data?.total_increment)
      setTotalDecrement(response.data?.total_decrement)
      setFinalStock(response.data?.final_stock)
      setTotalPages(response.data?.totalPages)
      updateURL(navigate, page, sort, order, search)
    } catch (err) {
      console.log(err)
      setProductBranchHistory([])
      setTotalDataChanges(0)
      setTotalIncrement(0)
      setTotalDecrement(0)
      setFinalStock(0)
      setTotalPages(1)
    }
  }

  useEffect(() => {
    if (clickedData?.id) {
      getBranchProductHistory(currentPage, sortBy.toLowerCase(), sortOrder, debouncedSearchValue)
    }
  }, [currentMonth, clickedData?.id, currentPage, sortBy, sortOrder, debouncedSearchValue])

  const monthData = [
    { month: 'January', value: 1 },
    { month: 'February', value: 2 },
    { month: 'March', value: 3 },
    { month: 'April', value: 4 },
    { month: 'May', value: 5 },
    { month: 'June', value: 6 },
    { month: 'July', value: 7 },
    { month: 'August', value: 8 },
    { month: 'September', value: 9 },
    { month: 'October', value: 10 },
    { month: 'November', value: 11 },
    { month: 'December', value: 12 }
  ]

  return (
    <Dialog size="xxl" open={openModalHistory} handler={handleHistory} className="p-5">
      <DialogHeader>Stock report</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-2">
          <Typography color="black">Product name: {clickedData?.Product?.name}</Typography>
          <Typography color="black">Branch: {clickedData?.Branch?.name}</Typography>
          <Typography color="black">Current stock: {clickedData?.stock}</Typography>
        </div>
        <div className="flex flex-col items-center justify-center mt-2">
          <Select color="green" label="Select Month" onChange={(value) => setCurrentMonth(value)}>
            {monthData.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.month}
              </Option>
            ))}
          </Select>
          <StockHistoryTable
            productBranchHistory={productBranchHistory}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
            handleSortBy={handleSortByColumn}
          />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <Typography color="black" variant="h5">
            Summary in month {currentMonth}
          </Typography>
          <Typography color="black">There are {totalDataChanges} data changes</Typography>
          <Typography color="black">Total increment: {totalIncrement}</Typography>
          <Typography color="black">Total decrement: {totalDecrement}</Typography>
          <Typography color="black">Final stock: {finalStock}</Typography>
        </div>
      </DialogBody>
      <DialogFooter>
        {/* <Button
                    variant="text"
                    color="red"
                    onClick={handleHistory}
                    className="mr-1"
                >
                    <span>Back</span>
                </Button> */}
        <Button variant="gradient" color="green" onClick={handleHistory}>
          <span>Back</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
