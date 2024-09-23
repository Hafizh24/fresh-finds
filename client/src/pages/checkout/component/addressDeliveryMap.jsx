import { FiCheck } from 'react-icons/fi'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { SyncLoader } from 'react-spinners'

import axios from '../../../api/axios'

export const AddressDeliveryMap = ({ item, fetchAllAddress, fetchDeliveryAddress, currentPage }) => {
  const token = localStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(false)

  const handleSetDeliveryAddress = async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch(`customer-address/set-delivery-address/${item.id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsLoading(false)
      fetchAllAddress(currentPage)
      fetchDeliveryAddress()
      toast.success(response.data.message, {
        position: 'top-center'
      })
    } catch (error) {
      setIsLoading(false)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  return (
    <div className="mr-1.5">
      <div
        className={`${
          item?.isDeliveryAddress ? 'border border-[#209978] bg-[#f8fdfd]' : 'border border-gray-300 bg-transparent hover:border-[#71e1c3]'
        } flex flex-col gap-1 p-4 shadow-sm rounded-xl cursor-pointer transition ease-in-out delay-100`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[0.15rem]">
            <div className="flex items-center gap-[0.6rem]">
              <h4 className="text-[16.5px] text-[#474747] font-medium">{item?.title}</h4>
              {item?.isDefault && (
                <div className="flex items-center py-[0.1rem] bg-[#DBEFDC] w-max rounded-md px-[0.5rem] mt-[0.1rem]">
                  <span className="text-[13px] font-medium text-[#1e6a24] tracking-tight">default</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[#989d9e] text-[15px] ">
              <span className="font-medium">{item?.customerAddressName}</span>
              <span className=" font-medium text-[14px]">({item?.phoneNumber})</span>
            </div>
          </div>
          {item?.isDeliveryAddress ? (
            <FiCheck size={28} className="text-[#209978] mr-[0.3rem]" />
          ) : (
            <button
              onClick={handleSetDeliveryAddress}
              className="mt-[0.35rem] w-[75.2px] h-[35.5px] font-normal rounded-full bg-[#00A67C] text-white text-[14px] hover:bg-[#00916D] transition ease-in-out delay-100">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <SyncLoader color="white" size={9} />
                </div>
              ) : (
                'Select'
              )}
            </button>
          )}
        </div>
        <div className="flex gap-1.5 rounded-xl bg-[#f5f6f6] p-3 mt-[0.3rem]">
          <div className="w-max h-max flex items-center justify-center mt-[4px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15 15">
              <g fill="none" fillRule="evenodd" stroke="#696969" strokeLinecap="square" clipRule="evenodd">
                <path d="M7.5 8.495a2 2 0 0 0 2-1.999a2 2 0 0 0-4 0a2 2 0 0 0 2 1.999Z" />
                <path d="M13.5 6.496c0 4.997-5 7.995-6 7.995s-6-2.998-6-7.995A5.999 5.999 0 0 1 7.5.5c3.313 0 6 2.685 6 5.996Z" />
              </g>
            </svg>
          </div>
          <div className="flex flex-col">
            <p className="text-[14px] font-medium text-[#696969] px-1">{item?.fullAddress}</p>
            <div className="flex items-center">
              <p className="text-[14px] font-medium text-[#696969] pl-1">{item?.City.city},</p>
              <p className="text-[14px] font-medium text-[#696969] pl-1">{item?.City.Province.province}</p>
            </div>
          </div>
        </div>
        {/* {!item?.isDeliveryAddress && (
                    <button
                        onClick={handleSetDeliveryAddress}
                        className="mt-[0.35rem] w-[75.2px] h-[35.5px] font-normal rounded-full bg-[#00A67C] text-white text-[14px] hover:bg-[#00916D] transition ease-in-out delay-100"
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <SyncLoader color="white" size={9} />
                            </div>
                        ) : (
                            'Select'
                        )}
                    </button>
                )} */}
      </div>
      {/* pagination */}
    </div>
  )
}

AddressDeliveryMap.propTypes = {
  fetchAllAddress: PropTypes.func.isRequired,
  fetchDeliveryAddress: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isDeliveryAddress: PropTypes.bool.isRequired,
    fullAddress: PropTypes.string.isRequired,
    customerAddressName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    isDefault: PropTypes.bool.isRequired
  })
}
