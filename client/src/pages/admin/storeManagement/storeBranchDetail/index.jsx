import { useSelector } from 'react-redux'
import { LuStore } from 'react-icons/lu'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { FaInfo } from 'react-icons/fa6'
import { FaBoxOpen } from 'react-icons/fa'

import adminIcon from '../../../../assets/storeManagement/admin.svg'
import addressIcon from '../../../../assets/storeManagement/address.svg'
import phoneIcon from '../../../../assets/storeManagement/phone.svg'
import calendarIcon from '../../../../assets/storeManagement/calendar.svg'
import axios from '../../../../api/axios'
import AdminSidebar from '../../components/sidebarAdminDashboard'
import { formatDate2 } from '../../../../functions/functions'
import { ModalBranchChangeStatus } from './modalBranchChangeStatus'
import { ModalBranchEdit } from './modalBranchEdit'
import { ModalBranchDelete } from './modalBranchDelete'

export const StoreBranchDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const adminDataRedux = useSelector((state) => state.admin.value)
  const token = localStorage.getItem('admtoken')

  const [branchDetailData, setBranchDetaildata] = useState(null)
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [modalStatusOpen, setModalStatusOpen] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)

  const fetchBranchDetailData = async () => {
    try {
      const response = await axios(`branches/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const branchData = response.data.result

      if (!branchData) {
        navigate('/404-admin')
        return
      }

      setBranchDetaildata(branchData)
    } catch (error) {
      console.log(error)
    }
  }

  const handleModalEditOpen = () => setModalEditOpen(!modalEditOpen)

  const mapUrl = `https://maps.google.com/maps?q=${branchDetailData?.latitude},${branchDetailData?.longitude}&output=embed&z=16`

  useEffect(() => {
    fetchBranchDetailData()
  }, [])

  return (
    <>
      {adminDataRedux?.isSuperAdmin === true ? (
        <div className="flex flex-col lg:flex-row">
          <AdminSidebar />
          <div className="bg-[#EDF7F4] w-full py-[20px] px-[10px] lg:px-[100px] flex flex-col gap-3">
            {/* section */}
            <div
              onClick={() => navigate('/store-management')}
              id="underline-wrapper"
              className="text-gray-500 flex items-center gap-2 w-max cursor-pointer hover:text-gray-700 relative">
              <IoMdArrowBack className="h-[1.15rem] w-[1.15rem]" />
              <span className="font-medium text-[15px] relative">
                Go back
                <span id="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700 transition-all origin-left transform scale-x-0"></span>
              </span>
            </div>
            <div className="bg-white rounded-lg py-4 md:py-5 px-4 md:px-7 flex flex-col gap-2">
              {/* BreadCrumb */}
              <div className="px-1.5 md:px-0 flex w-max items-center justify-center gap-1.5 rounded-lg bg-none text-[14px] font-medium text-[#8f8f8f]">
                <span className="">Admin</span>
                <div className="flex items-center pt-[0.1rem]">
                  <svg width="6" height="10" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 11.5L6.5 6.5L1.5 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>Store Management</span>
                <div className="flex items-center pt-[0.1rem]">
                  <svg width="6" height="10" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 11.5L6.5 6.5L1.5 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>{branchDetailData?.name}</span>
              </div>
              <div className="px-1 md:px-0 flex items-center gap-3">
                <LuStore size={24} className="text-gray-900" />
                <h1 className="text-[#28302A] text-[22px] lg:text-[26px] font-bold pt-2 pb-2">{branchDetailData?.name}</h1>
                {branchDetailData?.isSuperStore && (
                  <div className="flex items-center py-[0.2rem] bg-[#DBEFDC] w-max rounded-md px-[0.6rem]">
                    <span className="text-[14px] font-semibold text-[#1B5E20]">main store</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
                {/* Left */}
                <div className="flex flex-col lg:col-span-2 border border-gray-300 rounded-xl py-4 px-5 shadow-sm">
                  <div className="flex gap-4">
                    <div className="flex shrink-0 items-center justify-center rounded-md bg-[#F1F2F4] p-[0.5rem] h-max">
                      <img src={addressIcon} alt="" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] text-gray-500 font-medium">Address:</span>
                      <span className="text-[14px] text-[#757575] font-medium">{branchDetailData?.fullAddress}</span>
                      <div className="flex items-center">
                        <p className="text-[14px] text-[#757575] font-medium">{branchDetailData?.City?.city},</p>
                        <p className="text-[14px] text-[#757575] font-medium pl-1">{branchDetailData?.City?.Province?.province}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-4 h-[30vh] lg:h-full" id="gmap-frame">
                    <iframe className="rounded-lg" width="100%" height="100%" src={mapUrl}></iframe>
                  </div>
                </div>
                {/* right */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-4 col-span-1 border border-gray-300 rounded-xl py-4 px-5 shadow-sm h-max">
                    <div className="flex gap-4">
                      <div className="flex items-center justify-center rounded-md bg-[#F1F2F4] p-[0.5rem] h-max mt-[0.12rem]">
                        <img src={adminIcon} alt="" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-medium">Admin:</span>
                        <span className="text-[15px] text-gray-900">
                          {branchDetailData?.Admin.name}
                          <span className="text-[14px] ml-[0.2rem] text-[#757575]">({branchDetailData?.Admin.username})</span>{' '}
                        </span>
                        <span className="text-[14px] text-[#757575]">{branchDetailData?.Admin.email}</span>
                      </div>
                    </div>
                    {/*  */}
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center justify-center rounded-md bg-[#F1F2F4] p-[0.5rem] h-max">
                        <img src={phoneIcon} alt="" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-medium">Contact Number:</span>
                        <span className="text-[15px] text-[#757575] font-medium">{branchDetailData?.contactNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 col-span-1 border border-gray-300 rounded-xl py-4 px-5 shadow-sm h-max">
                    {/*  */}
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center justify-center rounded-md bg-[#F1F2F4] p-[0.5rem] h-max">
                        {/* <img src={statusIcon} alt="" /> */}
                        <FaInfo size={17} className="text-[#7d8a9c]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-medium">Status:</span>
                        <span className="text-[15px] text-[#757575] font-medium">{branchDetailData?.isActive ? 'Active' : 'Off'}</span>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center justify-center rounded-md bg-[#F1F2F4] p-[0.5rem] h-max">
                        {/* <img src={statusIcon} alt="" /> */}
                        <FaBoxOpen size={17} className="text-[#7d8a9c]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-medium">Delivery Distance:</span>
                        <span className="text-[15px] text-[#757575] font-medium whitespace-pre">
                          {branchDetailData?.maxDeliveryDistance} km <span className="text-gray-500">(max.)</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center justify-center rounded-md bg-[#F1F2F4] p-[0.5rem] h-max">
                        <img src={calendarIcon} alt="" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-medium">Created At:</span>
                        <span className="text-[15px] text-[#757575] font-medium">{formatDate2(branchDetailData?.createdAt)}</span>
                      </div>
                    </div>
                    {/*  */}

                    {/*  */}

                    {/*  */}
                  </div>
                  {/* Button Group */}
                  <div className="flex flex-col gap-[0.5rem] mt-1.5">
                    <div onClick={handleModalEditOpen} className="flex items-center gap-2.5 rounded-lg cursor-pointer bg-transition bg-transition-green py-[0.1rem]">
                      <div className="flex items-center justify-center rounded-full p-[0.5rem] h-max bg-[#eafaef] z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                          <path
                            fill="#51D669"
                            fillRule="evenodd"
                            d="M14.287.303a1 1 0 1 1 1.415 1.414l-.707.708L13.58 1.01zm0 2.829l-6.873 6.873H6V8.59l6.873-6.874zM3 13.5a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5h6.25a.75.75 0 0 0 0-1.5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6.75a.75.75 0 0 0-1.5 0V13a.5.5 0 0 1-.5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700 text-[15px] z-10">Edit</span>
                    </div>
                    <div
                      onClick={() => setModalStatusOpen(!modalStatusOpen)}
                      className="flex items-center gap-2.5 rounded-lg cursor-pointer bg-transition bg-transition-blue py-[0.1rem]">
                      <div className="flex items-center justify-center rounded-full p-[0.5rem] h-max bg-[#e7f0ff] z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 15 15">
                          <path
                            fill="#3A89FF"
                            fillRule="evenodd"
                            d="M1.903 7.297c0 3.044 2.207 5.118 4.686 5.547a.521.521 0 1 1-.178 1.027C3.5 13.367.861 10.913.861 7.297c0-1.537.699-2.745 1.515-3.663c.585-.658 1.254-1.193 1.792-1.602H2.532a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V2.686l-.001.002c-.572.43-1.27.957-1.875 1.638c-.715.804-1.253 1.776-1.253 2.97m11.108.406c0-3.012-2.16-5.073-4.607-5.533a.521.521 0 1 1 .192-1.024c2.874.54 5.457 2.98 5.457 6.557c0 1.537-.699 2.744-1.515 3.663c-.585.658-1.254 1.193-1.792 1.602h1.636a.5.5 0 1 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 1 1 1 0v1.845h.002c.571-.432 1.27-.958 1.874-1.64c.715-.803 1.253-1.775 1.253-2.97"
                            clipRule="evenodd"
                          />
                        </svg>{' '}
                      </div>
                      <span className="font-medium text-gray-700 text-[15px] z-10">Change status</span>
                    </div>
                    <div
                      onClick={() => setModalDeleteOpen(!modalDeleteOpen)}
                      className="flex items-center gap-2.5 rounded-lg cursor-pointer bg-transition bg-transition-orange py-[0.1rem]">
                      <div className="flex items-center justify-center rounded-full p-[0.5rem] h-max bg-[#fef0ea] z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 16 16">
                          <path
                            fill="#fd5f28"
                            d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75M4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15M6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-700 text-[15px] z-10">Delete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <ModalBranchEdit
        modalEditOpen={modalEditOpen}
        handleModalEditOpen={handleModalEditOpen}
        branchDetailData={branchDetailData}
        fetchBranchDetailData={fetchBranchDetailData}
      />
      <ModalBranchChangeStatus
        modalStatusOpen={modalStatusOpen}
        setModalStatusOpen={setModalStatusOpen}
        branchDetailData={branchDetailData}
        fetchBranchDetailData={fetchBranchDetailData}
      />
      <ModalBranchDelete modalDeleteOpen={modalDeleteOpen} setModalDeleteOpen={setModalDeleteOpen} branchDetailData={branchDetailData} />
    </>
  )
}

StoreBranchDetail.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    AdminId: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    contactNumber: PropTypes.string.isRequired,
    maxDeliveryDistance: PropTypes.string.isRequired
  })
}
