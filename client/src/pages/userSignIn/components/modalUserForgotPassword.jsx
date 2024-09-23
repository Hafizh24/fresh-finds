import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { SyncLoader } from 'react-spinners'
import { useState } from 'react'

import axios from '../../../api/axios'

export const ModalUserForgotPassword = ({ modalOpen, handleModalOpen }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`customer/forgot-password?email=${values.email}`)
      setIsLoading(false)
      toast.success('Forgot password link has been sent to your email!', {
        position: 'top-center'
      })
      handleModalOpen()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  const userForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email format').required("Email can't be empty")
  })

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: userForgotPasswordSchema,
    onSubmit: (values) => {
      handleSubmit(values)
      formik.resetForm()
    }
  })

  return (
    <Dialog Dialog size="sm" open={modalOpen} handler={() => handleModalOpen()} className="p-3 flex flex-col items-center">
      <DialogHeader className="text-[#28302A] font-bold w-max">Forgot your password?</DialogHeader>
      <DialogBody className="flex flex-col gap-4 items-center">
        <div className="flex items-center justify-center p-6 rounded-full bg-[#F2F3F5]">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 11C18.7 11 19.37 11.1 20 11.29V10C20 8.9 19.1 8 18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H12.26C11.5275 20.9511 11.0967 19.7214 11.0144 18.4447C10.9322 17.168 11.2017 15.8932 11.7935 14.759C12.3854 13.6247 13.277 12.6746 14.3712 12.0118C15.4655 11.349 16.7206 10.9991 18 11ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6Z"
              fill="#6B7280"
            />
            <path
              d="M18 13C15.24 13 13 15.24 13 18C13 20.76 15.24 23 18 23C20.76 23 23 20.76 23 18C23 15.24 20.76 13 18 13ZM20 20C19.8 20.2 19.49 20.2 19.29 20L17.64 18.35C17.5467 18.2571 17.4929 18.1317 17.49 18V15.5C17.49 15.22 17.71 15 17.99 15C18.27 15 18.49 15.22 18.49 15.5V17.79L19.99 19.29C20.2 19.49 20.2 19.8 20 20Z"
              fill="#8b919e"
            />
          </svg>
        </div>
        <span className="text-[15px] text-gray-600 w-[80%] text-center">Enter your email address associated with your account</span>
        <form onSubmit={formik.handleSubmit} className="w-full">
          <div className="mt-2 w-full">
            <label className="relative block w-full rounded-full border border-[#D4D4D5] focus-within:border-[#4ECCA3] focus-within:outline-1 focus-within:outline-[#4ECCA3] focus-within:outline">
              <input
                name="email"
                value={formik.values.password}
                onChange={formik.handleChange}
                type="text"
                className="peer w-full border-none bg-transparent px-4 py-2.5 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                placeholder="Event Title"
                autoComplete="off"
              />
              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 px-3 text-sm text-gray-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Email
              </span>
            </label>
            {formik.touched.email && formik.errors.email ? <span className="pl-2 pb-2 text-red-500 text-[14px]">{formik.errors.email}</span> : null}
          </div>
          <div className="mt-7 flex justify-center gap-3">
            <div className="flex justify-end gap-3">
              <button
                onClick={handleModalOpen}
                className="shadow-sm rounded-full px-5 py-2 border border-[#E5E7EB] text-[15px] font-medium text-gray-600 transition delay-100 ease-in-out hover:bg-gray-100">
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#00a67c] h-[44px] w-[98.3px] text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D] ">
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <SyncLoader color="#FFFFFF" size={8} />
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  )
}

ModalUserForgotPassword.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleModalOpen: PropTypes.func.isRequired
}
