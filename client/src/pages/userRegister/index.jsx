import { motion, AnimatePresence } from 'framer-motion'
import { SyncLoader } from 'react-spinners'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setData } from '../../redux/customerSlice'
import { toast } from 'react-toastify'

import appLogoSm from '../../assets/userSignIn/lemon-logo.svg'
import googleIcon from '../../assets/userSignIn/google-icon.svg'
import registerBanner from '../../assets/userRegister/signup-vector.svg'
import axios from '../../api/axios'
import { ModalEmailVerification } from './components/modalEmailVerification'
import { ModalError } from './components/modalError'
import { registerWithGoogle } from '../../../../server/firebase'

export const UserRegister = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [refCodeOpen, setRefCodeOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalErrorOpen, setModalErrorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const handleGoogleRegister = async () => {
    try {
      const userData = await registerWithGoogle()
      const response = await axios.post('customer/register-google', { googleUserData: userData })
      localStorage.setItem('token', response.data.token)
      dispatch(setData(response.data.result))
      toast.success(
        <>
          <div className="font-medium text-[#07BC0C]">Google Register success</div>
          <div className="text-[15px]">Welcome to Fresh Finds!</div>
        </>,
        {
          position: 'top-center'
        }
      )
      navigate('/')
    } catch (error) {
      console.log('Error from handle Google Register Front-end', error)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      await axios.post('customer/register', values)
      setIsLoading(false)
      // console.log(values);
      setRegisteredEmail(values.email)
      setModalOpen(true)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      if (error.response.data.message === 'Email is already registered') {
        setModalErrorOpen(true)
      } else {
        toast.error(error.response.data.message, {
          position: 'top-center'
        })
      }
    }
  }

  const userRegisterSchema = Yup.object().shape({
    firstname: Yup.string().required("First name can't be empty").min(2),
    lastname: Yup.string(),
    email: Yup.string().email('Must be a valid email format').required("Email can't be empty")
  })

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      referral_code: ''
    },
    validationSchema: userRegisterSchema,
    onSubmit: (values) => {
      handleSubmit(values)
      // formik.resetForm();
    }
  })

  return (
    <>
      <section className="h-screen  bg-[#EDF7F4]">
        <div className="grid h-full grid-cols-1 p-3 md:grid-cols-2">
          {/* --------------- Left Col -------------- */}
          <div className="flex h-full flex-col items-center justify-center gap-[3rem] lg:gap-0 lg:justify-between rounded-3xl bg-white py-12 lg:mr-5">
            {/* Title & Desc */}
            <div className="flex flex-col items-center gap-5 pt-5 md:pt-0">
              <img src={appLogoSm} alt="" className="h-12"></img>
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-[30px] font-bold text-[#28302A]">Create Account</h3>
                <span className="text-gray-500">Get started with our App</span>
              </div>
            </div>
            <div className="mt-0 flex w-full flex-col gap-6 px-[2.2rem] pb-8 md:mt-5 md:px-[2rem] lg:px-[8rem]">
              {/* Form Input */}
              <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col lg:flex-row gap-2.5">
                    {/* Firstname */}
                    <label className="relative block w-full rounded-full border border-[#D4D4D5] focus-within:border-[#4ECCA3] focus-within:outline-1 focus-within:outline-[#4ECCA3] focus-within:outline">
                      <input
                        name="firstname"
                        value={formik.values.firstname}
                        onChange={formik.handleChange}
                        type="text"
                        className="peer w-full border-none bg-transparent px-4 py-2.5 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                        placeholder="Event Title"
                        autoComplete="off"
                      />
                      <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 px-3 text-sm text-gray-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                        First name
                      </span>
                    </label>
                    {/* Lastname */}
                    <label className="relative block w-full rounded-full border border-[#D4D4D5] focus-within:border-[#4ECCA3] focus-within:outline-1 focus-within:outline-[#4ECCA3] focus-within:outline">
                      <input
                        name="lastname"
                        value={formik.values.lastname}
                        onChange={formik.handleChange}
                        type="text"
                        className="peer w-full border-none bg-transparent px-4 py-2.5 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                        placeholder="Event Title"
                        autoComplete="off"
                      />
                      <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 px-3 text-sm text-gray-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                        Last name
                      </span>
                    </label>
                  </div>
                  {formik.touched.firstname && formik.errors.firstname ? <span className="pl-2 pb-2 text-red-500 text-[14px]">{formik.errors.firstname}</span> : null}
                  {/* Email */}
                  <label className="relative block w-full rounded-full border border-[#D4D4D5] focus-within:border-[#4ECCA3] focus-within:outline-1 focus-within:outline-[#4ECCA3] focus-within:outline">
                    <input
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      type="email"
                      className="peer w-full border-none bg-transparent px-4 py-2.5 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder="Event Title"
                      autoComplete="off"
                    />
                    <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 px-3 text-sm text-gray-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                      Email
                    </span>
                  </label>
                  {formik.touched.email && formik.errors.email ? <span className="pl-2 pb-2 text-red-500 text-[14px]">{formik.errors.email}</span> : null}
                  {/* Referral Code */}
                  <div className="flex flex-col gap-2">
                    <div className="group flex items-center cursor-pointer gap-1 w-max " onClick={() => setRefCodeOpen(!refCodeOpen)}>
                      <span className="pl-1.5 text-gray-700 text-[15px] group-hover:underline">Have a Referral Code?</span>
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ rotate: refCodeOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}>
                        <path
                          d="M13.8106 5.65892L8.50019 10.8354L3.18981 5.65892C3.09493 5.56625 2.96757 5.51437 2.83494 5.51437C2.70231 5.51437 2.57494 5.56625 2.48006 5.65892C2.43412 5.70394 2.39763 5.75766 2.37271 5.81696C2.34779 5.87625 2.33496 5.93992 2.33496 6.00424C2.33496 6.06855 2.34779 6.13222 2.37271 6.19152C2.39763 6.25081 2.43412 6.30454 2.48006 6.34955L8.12937 11.8575C8.22858 11.9543 8.36165 12.0084 8.50019 12.0084C8.63873 12.0084 8.77179 11.9543 8.871 11.8575L14.5203 6.35061C14.5666 6.30557 14.6033 6.25171 14.6285 6.19222C14.6536 6.13273 14.6665 6.06881 14.6665 6.00424C14.6665 5.93966 14.6536 5.87575 14.6285 5.81626C14.6033 5.75677 14.5666 5.70291 14.5203 5.65786C14.4254 5.56519 14.2981 5.51331 14.1654 5.51331C14.0328 5.51331 13.9054 5.56519 13.8106 5.65786V5.65892Z"
                          fill="#616161"
                        />
                      </motion.svg>
                    </div>
                    {/* Referral Code: Open */}
                    <AnimatePresence>
                      {refCodeOpen && (
                        <motion.div
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="pt-1 w-max">
                          <label className="relative block rounded-full border border-[#D4D4D5] focus-within:border-[#4ECCA3] focus-within:outline-1 focus-within:outline-[#4ECCA3] focus-within:outline">
                            <input
                              type="text"
                              name="referral_code"
                              value={formik.values.referral_code}
                              onChange={formik.handleChange}
                              className="peer w-full border-none bg-transparent px-4 py-2 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                              placeholder="Event Title"
                              autoComplete="off"
                            />
                            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 px-3 text-sm text-gray-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                              Enter your Referral Code
                            </span>
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/*  */}
                  </div>
                  <button
                    type="submit"
                    className="mt-3 rounded-full bg-[#28302A] h-[46px] font-medium text-white hover:bg-black transition delay-100 ease-in-out"
                    disabled={isLoading}>
                    <span className="button-text">
                      {isLoading ? (
                        <div className="flex justify-center items-center">
                          <SyncLoader color="#c0cac2" size={9} />
                        </div>
                      ) : (
                        'Register'
                      )}
                    </span>
                  </button>
                </div>
              </form>
              {/* social Login */}
              <div className="inline-flex items-center justify-center">
                <hr className="mt-[0.2rem] h-px w-full border-0 bg-gray-300"></hr>
                <p className="whitespace-nowrap bg-white px-3 text-[15px] text-gray-800">or continue with</p>
                <hr className="mt-[0.2rem] h-px w-full border-0 bg-gray-300"></hr>
              </div>
              <button onClick={handleGoogleRegister} className="w-full flex justify-center items-center h-[46px] gap-2.5 bg-[#f0f0f0] rounded-full hover:bg-[#e6e6e6]">
                <img src={googleIcon} alt="" className="h-[1.1rem] w-[1.1rem] object-cover mb-[1px]"></img>
                <span className="whitespace-nowrap text-[14px] font-semibold text-gray-600">Register with Google</span>
              </button>
            </div>
            <div>
              <span className="text-[15px] text-gray-800">
                Already have an account?{' '}
                <span onClick={() => navigate('/signin')} className="cursor-pointer font-semibold text-[#41907A] hover:underline hover:decoration-1">
                  Sign In
                </span>
              </span>
            </div>
          </div>
          {/* --------------- Right Col -------------- */}
          <div className="hidden h-full flex-col items-center justify-center gap-[2.6rem] md:flex">
            <img src={registerBanner} alt="" className="h-[28vh] lg:h-[50vh]"></img>
            <h4 className="whitespace-pre text-center text-[19px] font-medium text-[#28302A]">
              Make grocery shopping easier <br></br> with <span className="font-bold"> Fresh Finds</span>
            </h4>
          </div>
        </div>
      </section>
      {/* ----- Modal Render -----  */}
      <ModalEmailVerification modalOpen={modalOpen} setModalOpen={setModalOpen} registeredEmail={registeredEmail} />
      <ModalError modalErrorOpen={modalErrorOpen} setModalErrorOpen={setModalErrorOpen} />
    </>
  )
}
