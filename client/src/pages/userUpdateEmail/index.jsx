import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import appLogo from '../../assets/logo-app-1.png'
import bannerPage from '../../assets/email-update.png'
import axios from '../../api/axios'

export const UserUpdateEmail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      await axios.patch('customer/email-update-verification', null, {
        headers: {
          Authorization: `Bearer ${params.token}`
        }
      })
      setIsLoading(false)
      toast.success('Your new email has been verified!', {
        position: 'top-center'
      })
      navigate('/signin')
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  return (
    <>
      <section className="h-screen bg-[#F3F3F5] flex justify-center items-center ">
        <div className="flex flex-col w-[95vw] md:w-[60vw] lg:w-[35vw] px-7 pt-6 pb-7 rounded-2xl gap-6 bg-white shadow-sm">
          <img src={appLogo} alt="" className="h-[2rem] w-fit object-cover" />
          <img src={bannerPage} alt="" className="h-[16rem] w-full object-cover rounded-lg" />
          <div className="flex flex-col pt-4 pb-2">
            <span className="text-[16px] font-semibold text-[#28302A]">Secure your account</span>
            <h3 className="text-[30px] font-bold text-[#28302A]">Verify your new email</h3>
            <span className="text-[15px] font-medium mt-2 text-gray-500">To complete updating your personal data, click the button below to verify your new email</span>
          </div>
          <div className="flex justify-center mt-3 w-full">
            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-[#00a67c] h-[52px] text-[16px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D]">
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
        </div>
      </section>
    </>
  )
}
