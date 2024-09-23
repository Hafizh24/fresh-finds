import { useState } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { SyncLoader } from 'react-spinners'

import axios from '../../../api/axios'
import eyeIcon from '../../../assets/userDashboard/eye.svg'
import eyeOffIcon from '../../../assets/userDashboard/eye-off.svg'
import { ChangeEmail } from './changeEmail'

export const ChangeEmailPermission = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [modalChangeEmail, setModalChangeEmail] = useState(false)
  const token = localStorage.getItem('token')

  const handleModalEmail = () => setModalChangeEmail(!modalChangeEmail)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`customer/data-check?email=${values.email}&password=${values.password}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response)
      toast.success(response.data.message, {
        position: 'top-center'
      })
      setIsLoading(false)
      // handleModalEmail()
      setModalChangeEmail(true)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  const userDataCheckSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email format').required("Email can't be empty"),
    password: Yup.string().required('Password is required')
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: userDataCheckSchema,
    onSubmit: (values) => {
      handleSubmit(values)
      // formik.resetForm();
    }
  })

  return (
    <>
      <div className="h-screen">
        <div className="flex h-max flex-1 flex-col gap-[1.6rem] rounded-2xl border border-[#E6E6E5] bg-white px-[22px] md:px-[32px] lg:px-[2.6rem] py-[2rem]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="mb-2 text-[26px] font-bold">Change Your Email</h3>
              <p className="text-[15px] text-gray-600 ">You need to enter your current email and password before changing</p>
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[1.2rem]">
            <div className="w-full md:w-[26rem] lg:w-[22rem]">
              <label className="mb-2 block text-sm font-medium text-gray-900 ">Email</label>
              <div className="relative">
                <input
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 sm:text-sm focus:outline-[#4ECCA3]"
                  placeholder="your email"
                  type="text"
                />
              </div>
              {formik.touched.email && formik.errors.email ? <span className="pl-2 pb-2 text-red-500 text-[14px]">{formik.errors.email}</span> : null}
            </div>
            {/*  */}
            <div className="w-full md:w-[26rem] lg:w-[22rem]">
              <label className="mb-2 block text-sm font-medium text-gray-900 ">Password</label>
              <div className="relative">
                <input
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 sm:text-sm focus:outline-[#4ECCA3]"
                  placeholder="your password"
                  type={showPassword ? 'text' : 'password'}
                />
                <button type="button" onClick={togglePasswordVisibility} className="absolute top-1/2 transform -translate-y-1/2 right-4 focus:outline-none">
                  {showPassword ? <img src={eyeIcon} className="h-5" /> : <img src={eyeOffIcon} className="h-5" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? <span className="pl-2 pb-2 text-red-500 text-[14px]">{formik.errors.password}</span> : null}
            </div>
            <button
              type="submit"
              className="mt-4 md:mt-3 rounded-full bg-[#00a67c] w-full md:w-[120px] h-[42.5px] text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D] ">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <SyncLoader color="#FFFFFF" size={8} />
                </div>
              ) : (
                'Confirm'
              )}
            </button>
          </form>
        </div>
      </div>
      <ChangeEmail modalChangeEmail={modalChangeEmail} handleModalEmail={handleModalEmail} />
    </>
  )
}
