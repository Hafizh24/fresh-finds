import { useState } from 'react'
import { SyncLoader } from 'react-spinners'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react'

import axios from '../../../api/axios'
import { ModalUserDataUpdate } from './modalUserDataUpdate'

export const ChangeEmail = ({ modalChangeEmail, handleModalEmail }) => {
  const [isLoading, setIsLoading] = useState(false)
  const token = localStorage.getItem('token')
  const customer = useSelector((state) => state.customer.value)

  const [modalUpdateOpen, setModalUpdateOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await axios.patch(`customer/email-update?email=${values.email}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsLoading(false)
      setResponseMessage(response.data.message)
      localStorage.removeItem('token')
      setModalUpdateOpen(true)
    } catch (error) {
      console.log(`Error handle change email`, error)
      setIsLoading(false)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  const userChangeEmailSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email format').required("Email can't be empty")
  })

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: userChangeEmailSchema,
    onSubmit: (values) => {
      handleSubmit(values)
      formik.resetForm()
    }
  })

  return (
    <>
      <Dialog size="sm" open={modalChangeEmail} handler={handleModalEmail} className="p-3 flex flex-col items-center">
        <DialogHeader className="text-[#28302A] font-bold w-max">Change Your Email</DialogHeader>
        <DialogBody className="flex flex-col gap-4 items-center w-full">
          <div className="flex items-center justify-center p-6 rounded-full bg-[#F2F3F5]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8B919E" className="w-[4rem] h-[4rem]">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
            </svg>
          </div>
          <span className="text-[15px] text-gray-700 text-center">Enter your new email address</span>
          <form onSubmit={formik.handleSubmit} className="w-full lg:px-[2rem]">
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-900 ">New Email</label>
              <div className="relative">
                <input
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 sm:text-sm focus:outline-[#4ECCA3]"
                  placeholder={customer.email}
                  id="email"
                  type="text"
                />
              </div>
              {formik.touched.email && formik.errors.email ? <span className="pl-2 pb-2 text-red-500 text-[14px]">{formik.errors.email}</span> : null}
            </div>
            <div className="mt-7 flex justify-center gap-3">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleModalEmail}
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
      <ModalUserDataUpdate modalUpdateOpen={modalUpdateOpen} setModalUpdateOpen={setModalUpdateOpen} responseMessage={responseMessage} />
    </>
  )
}
