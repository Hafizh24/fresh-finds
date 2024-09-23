import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Option, Select } from '@material-tailwind/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { SyncLoader } from 'react-spinners'
import { CgGenderFemale } from 'react-icons/cg'
import { CgGenderMale } from 'react-icons/cg'
import { MdEmail } from 'react-icons/md'

import avaDummy from '../../../assets/userDashboard/ava-dummy.png'
import googleIcon from '../../../assets/userDashboard/google.svg'
import { ModalUpdateImage } from './modalUpdateImg'
import phoneIcon from '../../../assets/storeManagement/phone.svg'
import axios from '../../../api/axios'

export const PersonalInformation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modalImgOpen, setModalImgOpen] = useState(false)

  const customer = useSelector((state) => state.customer.value)
  const token = localStorage.getItem('token')

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Referral code copied!', {
      position: 'top-center'
    })
  }

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await axios.patch('customer/data-update', values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsLoading(false)
      toast.success(response.data.message, {
        position: 'top-center'
      })
      location.reload()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  const userDataUpdateSchema = Yup.object().shape({
    firstname: Yup.string(),
    lastname: Yup.string(),
    gender: Yup.string(),
    phoneNumber: Yup.number()
  })

  const formik = useFormik({
    initialValues: {
      firstname: customer.firstname || undefined,
      lastname: customer.lastname || undefined,
      gender: customer.gender || undefined,
      phoneNumber: customer.phoneNumber || undefined
    },
    validationSchema: userDataUpdateSchema,
    onSubmit: (values) => {
      handleSubmit(values)
      formik.resetForm()
    }
  })

  useEffect(() => {
    customer
  }, [customer.profile_picture])

  return (
    <>
      <div className="pb-[20vh]">
        <div className="flex flex-1 flex-col gap-6 rounded-2xl border border-[#E6E6E5] bg-white px-[22px] md:px-[32px] lg:px-[2.6rem] py-[2rem]">
          <div className="mb-2 flex flex-col">
            <h3 className="mb-2 text-[22px] lg:text-[26px] font-bold">
              Welcome to Your Account,
              <span className="text-[#00A67C]"> {customer.firstname}!</span>
            </h3>
            <p className="text-[15px] text-gray-600">{customer.socialRegister ? 'See' : 'Update'} your personal details</p>
          </div>
          {/* Edit Image */}
          <div className={`${customer.socialRegister ? '' : 'border-b border-gray-300 pb-5'} flex flex-col gap-[2rem] md:gap-0 md:flex-row w-full justify-between`}>
            <div
              className={`${
                customer.socialRegister ? 'py-4 pl-4 md:pr-6 w-full md:w-max flex flex-row border border-gray-300 bg-[#fafafa]' : ''
              } rounded-xl flex items-center gap-4`}>
              <img
                src={customer.profile_picture ? new URL(customer.profile_picture).toString() : avaDummy}
                alt=""
                className="h-[6.2rem] w-[6.2rem] lg:h-[7rem] lg:w-[7rem] rounded-full object-cover"></img>
              {customer.socialRegister ? (
                <div className="flex flex-col gap-[0.4rem]">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {customer.firstname} {customer?.lastname}
                    </span>
                    <span className="text-[15px] text-gray-600">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-[0.4rem]">
                    <img src={googleIcon} alt="" className="h-4" />
                    <span className="text-[14px] md:text-[15px] font-medium text-gray-600">
                      Registered using <span className="font-semibold">Google</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-[0.4rem]">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-[0.6rem]">
                      <span className="font-semibold">
                        {customer.firstname} {customer?.lastname}
                      </span>
                      {customer.gender == 'male' && (
                        <>
                          <div className="bg-[#E7F0FF] rounded-xl py-[0.1rem] px-[0.5rem]">
                            <CgGenderMale className="h-[1.2rem] w-[1.2rem] text-[#3A89FF]" />
                          </div>
                        </>
                      )}
                      {customer.gender == 'female' && (
                        <>
                          <div className="bg-[#fdedf2] rounded-xl py-[0.1rem] px-[0.5rem]">
                            <CgGenderFemale className="h-[1.15rem] w-[1.2rem] text-[#f16997]" />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-[0.6rem] mt-[0.3rem]">
                      <MdEmail className="h-[0.9rem] w-[0.9rem] text-[#7D8A9C]" />
                      <span className="text-[15px] text-[#7D8A9C]">{customer.email}</span>
                    </div>
                    {customer.phoneNumber && (
                      <div className="flex items-center gap-[0.6rem]">
                        <img src={phoneIcon} alt="" className="h-[0.9rem] w-[0.9rem]" />
                        <span className="text-[14px] text-[#7D8A9C]">{customer.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setModalImgOpen(!modalImgOpen)}
                    className="bg-[#E1F5EF] text-[14px] text-[#3A826E] font-medium rounded-full py-[3.5px] px-[16px] w-max mt-1 hover:bg-[#ceefe5] transition ease-in-out delay-100">
                    Update Picture
                  </button>
                </div>
              )}
            </div>
            {/* Referral code */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border-[2px] border-dashed border-[#00A67C] bg-[#F0FAF7] px-5 py-2 cursor-pointer hover:scale-105 transition delay-100 ease-in-out hover:bg-[#ddf4ed]"
              onClick={() => copyToClipboard(customer.referral_code)}>
              <span className="text-[15px] font-medium text-green-500">Your referral code</span>
              <span className="text-[18px] font-bold text-[#00916D]">{customer.referral_code}</span>
              <span className="text-[14px] text-green-500">tap to copy</span>
            </div>
          </div>
          {/* Form */}
          {customer.socialRegister ? (
            <></>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-1 flex-col gap-[1.8rem]">
                {/* Firstname & Lastname */}
                <div className="flex flex-col md:flex-row w-full justify-between gap-[1rem] md:gap-[1.2rem] lg:gap-[4rem]">
                  <div className="w-full">
                    <label className="mb-2 block text-sm font-medium text-gray-900">First name</label>
                    <input
                      id="firstname"
                      name="firstname"
                      value={formik.values.firstname}
                      onChange={formik.handleChange}
                      className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                      placeholder={customer.firstname}
                      type="text"
                    />
                  </div>
                  <div className="w-full">
                    <label className="mb-2 block text-sm font-medium text-gray-900">Last name</label>
                    <input
                      name="lastname"
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                      className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                      placeholder={customer.lastname}
                      id="lastname"
                      type="text"
                    />
                  </div>
                </div>
                {/* phone number */}
                <div className="md:flex-row flex flex-col w-full justify-between gap-[1rem] md:gap-[1.4rem] lg:gap-[4rem]">
                  <div className="w-full">
                    <label className="mb-2 block text-sm font-medium text-gray-900">Phone Number</label>
                    <div className="relative mt-2 text-gray-500">
                      <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                        <select className="text-sm text-gray-500 outline-none rounded-lg h-full bg-transparent">
                          <option>IDN</option>
                        </select>
                      </div>
                      <input
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        type="number"
                        placeholder={customer.phoneNumber}
                        className="focus:outline-[#4ECCA3] block w-full pl-[4.5rem] pr-3 py-2.5 text-sm border border-gray-300 bg-[#FCFCFC] rounded-lg text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="mb-2 block text-sm font-medium text-gray-900">Gender</label>
                    <Select
                      color="teal"
                      label={customer.gender ? customer.gender : 'Gender'}
                      id="gender"
                      name="gender"
                      value={formik.values.gender}
                      onChange={(value) => formik.setFieldValue('gender', value)}
                      className="h-[43px] bg-[#FCFCFC] border-gray-300">
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                    </Select>
                  </div>
                </div>
              </div>
              {/* Button Group */}
              <div className="mt-10 flex w-full md:w-max md:justify-end gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-[#00a67c] w-full md:w-[144px] h-[42.5px] text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D] ">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <SyncLoader color="white" size={9} />
                    </div>
                  ) : (
                    'Save changes'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <ModalUpdateImage modalImgOpen={modalImgOpen} setModalImgOpen={setModalImgOpen} />
    </>
  )
}
