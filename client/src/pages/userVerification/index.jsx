import { useState } from 'react'

import banner1 from '../../assets/userVerification/email-verify-2.svg'
import eyeIcon from '../../assets/userDashboard/eye.svg'
import eyeOffIcon from '../../assets/userDashboard/eye-off.svg'

export const UserVerification = () => {
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1)
  }

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2)
  }

  return (
    <section className="h-screen bg-[#EDF7F4] flex flex-col items-center justify-center gap-[1.5rem]">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-[24px]">
            Hi <span className="font-bold text-[#00A67C]">Jordan</span>,
          </h3>
          <h3 className="font-semibold text-[24px]">Your account is almost ready!</h3>
        </div>
      </div>
      <div className="bg-white py-7 px-[3rem] rounded-xl flex flex-col items-center gap-[2rem]">
        <div className="flex flex-col gap-4">
          <img src={banner1} alt="" className="h-[9rem]"></img>
          <span className="text-gray-600 text-[15px]">Enter a password and verify your account</span>
        </div>
        {/* Password Inputs */}
        <div className="w-full flex flex-col gap-[1.4rem]">
          <div className="w-full">
            <label className="mb-2 block text-sm font-medium text-gray-900 ">Your password</label>
            <div className="relative">
              <input
                className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                placeholder="Password"
                id=""
                type={showPassword1 ? 'text' : 'password'}
              />
              <button type="button" onClick={togglePasswordVisibility1} className="absolute top-1/2 transform -translate-y-1/2 right-4 focus:outline-none">
                {showPassword1 ? <img src={eyeIcon} className="h-5" /> : <img src={eyeOffIcon} className="h-5" />}
              </button>
            </div>
          </div>
          <div className="w-full">
            <label className="mb-2 block text-sm font-medium text-gray-900 ">Confirm password</label>
            <div className="relative">
              <input
                className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                placeholder="Password"
                id=""
                type={showPassword2 ? 'text' : 'password'}
              />
              <button type="button" onClick={togglePasswordVisibility2} className="absolute top-1/2 transform -translate-y-1/2 right-4 focus:outline-none">
                {showPassword2 ? <img src={eyeIcon} className="h-5" /> : <img src={eyeOffIcon} className="h-5" />}
              </button>
            </div>
          </div>
        </div>
        <button className="w-max rounded-full bg-[#00a67c] px-5 py-2.5 text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D]">
          Verify Account
        </button>
      </div>
      {/* <img src={appLogo} alt="" className="h-[2rem]"></img> */}
    </section>
  )
}
