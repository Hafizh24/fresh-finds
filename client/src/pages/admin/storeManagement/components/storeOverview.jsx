/* eslint-disable no-unused-vars */
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Input } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { SyncLoader } from 'react-spinners'

import { StoreTable } from './storeTable'
import { ModalAddBranch2 } from './modalAddBranch2'
import axios from '../../../../api/axios'

export const StoreOverview = () => {
  const token = localStorage.getItem('admtoken')

  const [modalAddOpen, setModalAddOpen] = useState(false)
  const [branchData, setBranchData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleModalAddOpen = () => setModalAddOpen(!modalAddOpen)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchBranchData = async (page, search = '') => {
    try {
      const response = await axios.get(`branches?page=${page}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setBranchData(response.data.result.rows)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo(0, 0)
  }

  const handleSearch = () => {
    fetchBranchData(1, searchQuery)
  }

  useEffect(() => {
    fetchBranchData(currentPage, searchQuery)
  }, [currentPage, searchQuery])

  return (
    <>
      <div className="my-[20px] lg:mx-[100px] flex flex-col gap-[0.6rem] lg:gap-[1.4rem]">
        {/* Top Bar */}
        <div className="bg-white py-4 lg:py-5 px-5 lg:px-7 rounded-lg shadow-sm gap-3 lg:gap-6 flex flex-col">
          <div className="flex flex-col gap-2">
            <h3 className="text-[21px] lg:text-[23px] font-bold text-[#28302A]">Store Management</h3>
            <p className="text-[14px] lg:text-[15px] text-gray-600">Manage your store branches data, product, admin, and others</p>
          </div>
          {/*  */}
          <div className="lg:items-center flex flex-col lg:flex-row justify-between gap-3 lg:gap-0">
            <button
              onClick={handleModalAddOpen}
              className="w-max shadow-sm items-center flex gap-2 rounded-lg bg-[#41907A] px-4 py-2.5 text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#3c8571] hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="mb-[0.2rem]">
                <path
                  fill="white"
                  d="M16.53 11.16c1.23-.26 2.4-.18 3.47.14V10c0-.63-.3-1.22-.8-1.6l-6-4.5a2.01 2.01 0 0 0-2.4 0l-6 4.5c-.5.38-.8.97-.8 1.6v9c0 1.1.9 2 2 2h5.68a6.915 6.915 0 0 1-.55-4.35c.52-2.72 2.69-4.91 5.4-5.49"
                />
                <path fill="white" d="M18 13c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m3 5.5h-2.5V21h-1v-2.5H15v-1h2.5V15h1v2.5H21z" />
              </svg>{' '}
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <SyncLoader color="#FFFFFF" size={8} />
                </div>
              ) : (
                'Add New Branch'
              )}
            </button>
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" onClick={handleSearch} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Table Section */}
        <StoreTable branchData={branchData} handlePageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} />
      </div>
      <ModalAddBranch2 modalAddOpen={modalAddOpen} handleModalAddOpen={handleModalAddOpen} fetchBranchData={fetchBranchData} currentPage={currentPage} />
    </>
  )
}
