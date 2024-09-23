import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { SyncLoader } from 'react-spinners'
import { useState } from 'react'

import axios from '../../../api/axios'

export const ModalUserReverify = ({ modalOpen2, handleModalOpen2 }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`customer/email-reverification?email=${values.email}`)
      console.log(response)
      setIsLoading(false)
      toast.success(response.data.message, {
        position: 'top-center'
      })
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
    <Dialog Dialog size="sm" open={modalOpen2} handler={() => handleModalOpen2()} className="p-3 flex flex-col items-center">
      <DialogHeader className="text-[#28302A] font-bold w-max">Account not verified?</DialogHeader>
      <DialogBody className="flex flex-col gap-4 items-center">
        <div className="flex items-center justify-center p-6 rounded-full bg-[#F2F3F5]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8B919E" className="w-[3.2rem] h-[3.2rem]">
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
        </div>
        <span className="text-[15px] text-gray-700 w-[80%] text-center">We&apos;ll resend the verification link to your email address</span>
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
                onClick={handleModalOpen2}
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

ModalUserReverify.propTypes = {
  modalOpen2: PropTypes.bool.isRequired,
  handleModalOpen2: PropTypes.func.isRequired
}
