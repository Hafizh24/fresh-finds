import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'

import { ModalUserCreateAddress } from './modalUserCreateAddress'
import { AddressDataMap } from './AddressDataMap'
import axios from '../../../api/axios'
import notFoundImg from '../../../assets/userDashboard/address_illu.svg'

export const UserAddress = () => {
  const token = localStorage.getItem('token')

  const [userAddressData, setUserAddressData] = useState(null)
  const [modalAddOpen, setModalAddOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUserAddressData = async (page) => {
    try {
      const response = await axios.get(`customer-address/list?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUserAddressData(response.data.result.rows)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.log('this')
      console.log(error)
    }
  }

  const handleModalAddOpen = () => setModalAddOpen(!modalAddOpen)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    fetchUserAddressData(currentPage)
  }, [currentPage])

  return (
    <div className="">
      <div className="flex flex-1 flex-col gap-[0.9rem] lg:gap-[1.6rem] rounded-2xl border border-[#E6E6E5] bg-white px-[22px] md:px-[32px] lg:px-[2.6rem] py-[2rem]">
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center justify-between">
          <div className="flex flex-col">
            <h3 className="mb-2 text-[26px] font-bold">Your Address</h3>
            <p className="text-[15px] text-gray-600 ">Edit, Delete and Add a new Address for your account</p>
          </div>
          {/* Button */}
          <button
            onClick={handleModalAddOpen}
            className="rounded-full bg-[#00A67C] px-6 py-2 flex items-center justify-center gap-2 transition delay-100 ease-in-out hover:bg-[#00916D]"
            type="button">
            <span className="text-[16px] font-semibold text-white">Add New</span>
            <FaPlus size={16} className="text-white mt-[1px]" />
          </button>
        </div>
        {/* Address list */}
        {userAddressData?.length > 0 ? (
          <>
            <div className="flex flex-col gap-3">
              {userAddressData?.map((item, index) => (
                <AddressDataMap item={item} key={index} fetchUserAddressData={fetchUserAddressData} currentPage={currentPage} />
              ))}
            </div>
            {/* pagination */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-[#E0E0E0] p-1.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-[0.65] transition ease-in-out delay-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#7a7a7a"
                  className="h-[1.2rem] w-[1.2rem] rtl:rotate-180">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <div className="text-[#898989] text-[15px] font-medium mx-1.5">
                {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#E0E0E0] p-1.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-[0.65] transition ease-in-out delay-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#7a7a7a" className="h-[1.2rem] w-[1.2rem] rotate-180">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 mt-8 mb-4">
            <div>
              <img src={notFoundImg} alt="" className="h-[12rem] w-[12rem] opacity-60" />
            </div>
            <h3 className="text-[20px] md:text-[23px] text-[#666666] font-semibold opacity-80 mt-[1rem]">Your Address List is empty!</h3>
            <p className="text-[14.5px] font-medium text-gray-500 w-[250px] text-center opacity-90 mt-[0.5rem]">
              Looks like you haven&apos;t added your address, please add a new one.
            </p>
          </div>
        )}
      </div>
      {/* Modal */}
      <ModalUserCreateAddress modalAddOpen={modalAddOpen} handleModalAddOpen={handleModalAddOpen} fetchUserAddressData={fetchUserAddressData} currentPage={currentPage} />
    </div>
  )
}
