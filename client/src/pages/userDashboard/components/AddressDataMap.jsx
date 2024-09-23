import PropTypes from 'prop-types'
import { useState } from 'react'
import { BiTrash } from 'react-icons/bi'
import { HiArrowPathRoundedSquare } from 'react-icons/hi2'
import { MdOutlineModeEdit } from 'react-icons/md'

import { ModalAddressSetDefault } from './modalAddressSetDefault'
import { ModalAddressDelete } from './modalAddressDelete'
import { ModalAddressEdit } from './modalAddressEdit'

export const AddressDataMap = ({ item, fetchUserAddressData, currentPage }) => {
  const [modalDefaultOpen, setModalDefaultOpen] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [modalEditOpen, setModalEditOpen] = useState(false)

  return (
    <>
      <div
        key={item?.id}
        className={`${
          item.isDefault ? 'border border-[#209978] bg-[#f8fdfd]' : 'border-gray-300 bg-transparent hover:border-[#71e1c3]'
        } flex flex-col gap-1 rounded-xl border px-[1.1rem] py-[1rem] md:px-6 md:py-4 shadow-sm`}>
        <div className="flex items-center gap-[0.6rem]">
          <h4 className="text-[16.5px] text-[#474747] font-semibold">{item?.title}</h4>
          {item?.isDefault && (
            <div className="flex items-center py-[0.1rem] bg-[#DBEFDC] w-max rounded-md px-[0.5rem] mt-[0.1rem]">
              <span className="text-[13px] font-medium text-[#1e6a24] tracking-tight">Default</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-[#989d9e]">
          <span className="font-medium text-[15px]">{item?.customerAddressName}</span>
          <span className=" font-medium text-[14px]">({item?.phoneNumber})</span>
        </div>
        <div className="flex gap-1 rounded-xl bg-[#f5f6f6] p-3 mt-[0.7rem]">
          <div className="w-max h-max flex items-center justify-center mt-[3px]">
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
        <div className="mt-2 lg:mt-4 flex flex-col gap-4 md:gap-0 md:flex-row md:items-center justify-between">
          <div className="flex gap-2 divide-x-2 divide-[#e9e9e9] pl-1">
            <button
              onClick={() => setModalEditOpen(!modalEditOpen)}
              className="text-[14px] font-semibold flex gap-1 items-center text-[#209978] opacity-90 hover:underline">
              <MdOutlineModeEdit size={13} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setModalDeleteOpen(!modalDeleteOpen)}
              className="pl-2 text-[14px] font-semibold flex gap-1 items-center text-[#209978] opacity-90 hover:underline">
              <BiTrash />
              <span>Delete</span>
            </button>
            {!item.isDefault && (
              <button
                onClick={() => setModalDefaultOpen(!modalDefaultOpen)}
                className="pl-2 text-[14px] font-semibold flex gap-1 items-center text-[#209978] opacity-90 hover:underline">
                <HiArrowPathRoundedSquare size={16} />
                <span>Set Default</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* ----- Modal ----- */}
      <ModalAddressSetDefault
        modalDefaultOpen={modalDefaultOpen}
        setModalDefaultOpen={setModalDefaultOpen}
        item={item}
        fetchUserAddressData={fetchUserAddressData}
        currentPage={currentPage}
      />
      <ModalAddressDelete
        modalDeleteOpen={modalDeleteOpen}
        setModalDeleteOpen={setModalDeleteOpen}
        item={item}
        fetchUserAddressData={fetchUserAddressData}
        currentPage={currentPage}
      />
      <ModalAddressEdit
        modalEditOpen={modalEditOpen}
        setModalEditOpen={setModalEditOpen}
        item={item}
        fetchUserAddressData={fetchUserAddressData}
        currentPage={currentPage}
      />
    </>
  )
}

AddressDataMap.propTypes = {
  fetchUserAddressData: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    customerAddressName: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    isDefault: PropTypes.bool.isRequired
    //
  }).isRequired
}
