import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import appLogo from '../../assets/logo-app-1.png'
import bannerPage from '../../assets/userResetPassword/reset-password-2.png'
import eyeIcon from '../../assets/userDashboard/eye.svg'
import eyeOffIcon from '../../assets/userDashboard/eye-off.svg'
import axios from '../../api/axios'

export const UserResetPassword = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      await axios.patch('customer/reset-password-verification', values, {
        headers: {
          Authorization: `Bearer ${params.token}`
        }
      })
      setIsLoading(false)
      toast.success('Your password has been changed!', {
        position: 'top-center'
      })
      navigate('/signin')
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error('Reset password failed', {
        position: 'top-center'
      })
    }
  }

  const userResetPasswordSchema = Yup.object().shape({
    password: Yup.string().min(4).required("Password can't be empty")
  })

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: userResetPasswordSchema,
    onSubmit: (values) => {
      handleSubmit(values)
      formik.resetForm()
    }
  })

  return (
    <>
      <section className="h-screen bg-[#F3F3F5] flex justify-center items-center ">
        <div className="flex flex-col w-[95vw] md:w-[60vw] lg:w-[35vw] px-7 pt-6 pb-7 rounded-2xl gap-6 bg-white shadow-sm">
          <img src={appLogo} alt="" className="h-[2rem] w-fit object-cover" />
          <img src={bannerPage} alt="" className="h-[12rem] w-full object-cover rounded-lg" />
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold text-[#28302A]">Secure your account</span>
            <h3 className="text-[30px] font-bold text-[#28302A]">Reset your password</h3>
            <span className="text-[15px] font-medium mt-2 text-gray-500">To complete resetting your password, type your new password below and click submit</span>
          </div>
          {/* Form Password */}
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="">
                <label className="mb-3 block text-sm font-medium text-gray-900 ">New password</label>
                <div className="relative">
                  <input
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    //
                    className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 sm:text-sm focus:outline-[#4ECCA3]"
                    placeholder="password"
                    id=""
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 transform -translate-y-1/2 right-4 focus:outline-none">
                    {showPassword ? <img src={eyeIcon} className="h-5" /> : <img src={eyeOffIcon} className="h-5" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password ? <span className="text-red-500 text-[14px]">{formik.errors.password}</span> : null}
              </div>
            </div>
            <div className="flex justify-center mt-9">
              <button
                type="submit"
                className="w-full rounded-xl bg-[#00a67c] h-[52px] text-[16px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D]">
                <span>
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <SyncLoader color="#FFFFFF" size={9} />
                    </div>
                  ) : (
                    'Submit'
                  )}
                </span>
              </button>
            </div>
          </form>

          {}
        </div>
      </section>
    </>
  )
}
