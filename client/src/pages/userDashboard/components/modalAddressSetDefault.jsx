import { Dialog, DialogBody } from '@material-tailwind/react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { SyncLoader } from 'react-spinners'
import { useState } from 'react'

import axios from '../../../api/axios'

export const ModalAddressSetDefault = ({ modalDefaultOpen, setModalDefaultOpen, item, fetchUserAddressData, currentPage }) => {
  const token = localStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddressSetDefault = async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch(`customer-address/set-default/${item.id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchUserAddressData(currentPage)

      setIsLoading(false)
      toast.success(response.data.message, {
        position: 'top-center'
      })
      setModalDefaultOpen(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  return (
    <Dialog size="sm" open={modalDefaultOpen} handler={() => setModalDefaultOpen(!modalDefaultOpen)} className="px-3 pb-3 pt-5 flex flex-col items-center">
      <DialogBody className="flex flex-col gap-1 items-center">
        <div className="mb-3 flex items-center justify-center p-7 rounded-full bg-[#dcfce7]">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
            <g fill="none" stroke="#2bda6c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0" />
              <circle cx="12" cy="8" r="2" />
              <path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3c0 .6.4 1 1 1h18c.6 0 1-.4 1-1c0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835" />
            </g>
          </svg>
        </div>
        <h3 className="mb-1 text-[21px] md:text-[24px] text-[#28302A] font-bold text-center">Set as Default Address</h3>
        <span className="text-[15px] text-gray-600 md:w-[90%] text-center font-normal">
          Are you sure you would like to set <span className="font-semibold text-gray-600">{item.title} </span> as your default address?
        </span>
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => setModalDefaultOpen(false)}
            className="shadow-sm rounded-full px-5 py-2 border border-[#E5E7EB] text-[15px] font-medium text-gray-600 transition delay-100 ease-in-out hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleAddressSetDefault}
            className="rounded-full bg-[#00a67c] w-[98.5px] h-[44.375px] text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D] ">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <SyncLoader color="white" size={9} />
              </div>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </DialogBody>
    </Dialog>
  )
}

ModalAddressSetDefault.propTypes = {
  modalDefaultOpen: PropTypes.bool.isRequired,
  setModalDefaultOpen: PropTypes.func.isRequired,
  fetchUserAddressData: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
  })
}
