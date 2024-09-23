import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react'
import { FaPlus } from 'react-icons/fa6'
import { IoIosArrowForward } from 'react-icons/io'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import axios from '../../../api/axios'
import { AddressDeliveryMap } from './addressDeliveryMap'
import notFoundImg from '../../../assets/userDashboard/address_illu.svg'
import { ModalUserCreateAddress } from '../../userDashboard/components/modalUserCreateAddress'

export const ModalChangeAddress = ({ modalChangeAddressOpen, setModalChangeAddressOpen, fetchDeliveryAddress }) => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const [modalAddOpen, setModalAddOpen] = useState(false)
  const [allAddress, setAllAddress] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handleModalAddOpen = () => setModalAddOpen(!modalAddOpen)

  const fetchAllAddress = async (page) => {
    try {
      const response = await axios.get(`customer-address/checkout?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setAllAddress(response.data.result.rows)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleGoToAddressList = () => {
    navigate('/user-dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // window.scrollTo(0, 0)
  }

  useEffect(() => {
    fetchAllAddress(currentPage)
  }, [currentPage])

  return (
    <>
      <Dialog Dialog size="md" open={modalChangeAddressOpen} handler={() => setModalChangeAddressOpen}>
        <DialogHeader className="font-bold flex w-full h-max">
          <div className="flex items-center justify-between w-full border-b border-gray-300 pb-[0.7rem]">
            <div></div>
            <div className="flex text-[#28302A] text-[20px] md:text-[21px] gap-3 items-center">
              <span>Choose Delivery Address</span>
            </div>
            <div onClick={() => setModalChangeAddressOpen(false)} className="cursor-pointer rounded-md hover:bg-gray-100 p-[0.1rem]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#657385" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="flex flex-col pt-0">
          {allAddress?.length > 0 ? (
            <div id="modal-scroll" className="flex flex-col gap-2 h-[60vh] md:h-[66vh] overflow-auto">
              {allAddress?.map((item) => (
                <AddressDeliveryMap key={item.id} item={item} fetchAllAddress={fetchAllAddress} fetchDeliveryAddress={fetchDeliveryAddress} currentPage={currentPage} />
              ))}
              <div className="flex items-center justify-between pr-1 mt-auto">
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
                <div className="text-[#989D9E] text-[14px] font-medium mx-1.5">
                  Page {currentPage} of {totalPages}
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
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 my-5">
              <div>
                <img src={notFoundImg} alt="" className="h-[8rem] w-[8rem] opacity-60" />
              </div>
              <h3 className="text-[19px] text-[#666666] font-semibold opacity-80 mt-[1rem]">Your Address List is empty!</h3>
              <p className="text-[14px] font-medium text-gray-500 w-[60%] text-center opacity-90 mt-[0.1rem]">
                Looks like you haven&apos;t added your address, please add a new one.
              </p>
            </div>
          )}
          <div
            onClick={handleGoToAddressList}
            id="underline-wrapper"
            className="text-gray-500 flex self-end w-full mt-[0.7rem] items-center gap-1 cursor-pointer hover:text-gray-700 relative">
            <span className="font-medium text-[14.5px] relative">
              Go to your Address List
              <span id="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700 transition-all origin-left transform scale-x-0"></span>
            </span>
            <IoIosArrowForward size={15} className="mt-[0.8px]" />
          </div>
          <button
            onClick={handleModalAddOpen}
            className="flex items-center justify-center gap-2 w-full mt-[0.5rem] px-4 py-[0.5rem] font-medium rounded-full bg-[#00A67C] text-white text-[15px] hover:bg-[#00916D] transition ease-in-out delay-100">
            <span>Add New</span>
            <FaPlus size={14} />
          </button>
          {/*  */}
        </DialogBody>
      </Dialog>
      <ModalUserCreateAddress modalAddOpen={modalAddOpen} handleModalAddOpen={handleModalAddOpen} fetchAllAddress={fetchAllAddress} currentPage={currentPage} />
    </>
  )
}

ModalChangeAddress.propTypes = {
  modalChangeAddressOpen: PropTypes.bool.isRequired,
  setModalChangeAddressOpen: PropTypes.func.isRequired,
  fetchDeliveryAddress: PropTypes.func.isRequired
}
