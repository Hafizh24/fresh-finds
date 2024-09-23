import { SyncLoader } from 'react-spinners'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

import appLogoSm from '../../assets/userSignIn/lemon-logo.svg'
import googleIcon from '../../assets/userSignIn/google-icon.svg'
import loginBanner from '../../assets/userSignIn/login-vector.svg'
import axios from '../../api/axios'
import eyeIcon from '../../assets/userDashboard/eye.svg'
import eyeOffIcon from '../../assets/userDashboard/eye-off.svg'
import { setData } from '../../redux/customerSlice'
import { ModalUserForgotPassword } from './components/modalUserForgotPassword'
import { ModalUserReverify } from './components/modalUserReverify'
import { registerWithGoogle } from '../../../../server/firebase'

export const UserSignIn = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpen2, setModalOpen2] = useState(false)
  const handleModalOpen = () => setModalOpen(!modalOpen)
  const handleModalOpen2 = () => setModalOpen2(!modalOpen2)
  const dispatch = useDispatch()

  const handleGoogleSignin = async () => {
    try {
      const userData = await registerWithGoogle()

      const response = await axios.post('customer/signin-google', { googleUserData: userData })
      localStorage.setItem('token', response.data.token)
      dispatch(setData(response.data.result))

      const lastVisitedPage = localStorage.getItem('lastVisitedPage')

      toast.success(
        <>
          <div className="font-medium text-[#07BC0C]">Google Sign in success</div>
          <div className="text-[15px]">Welcome back!</div>
        </>,
        {
          position: 'top-center'
        }
      )
      navigate(lastVisitedPage || '/')
      localStorage.removeItem('lastVisitedPage')
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
      const response = await axios.get(`customer/user-signin?email=${values.email}&password=${values.password}`, values)
      console.log(response)
      setIsLoading(false)
      navigate('/')
      localStorage.setItem('token', response.data.token)
      dispatch(setData(response.data.result))

      const lastVisitedPage = localStorage.getItem('lastVisitedPage')

      toast.success(
        <>
          <div className="font-medium text-[#07BC0C]">Sign in success</div>
          <div className="text-[15px]">Welcome back!</div>
        </>,
        {
          position: 'top-center'
        }
      )

      navigate(lastVisitedPage || '/')
      localStorage.removeItem('lastVisitedPage')
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  const userSignInSchema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string().required()
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: userSignInSchema,
    onSubmit: (values) => {
      handleSubmit(values)
      // formik.resetForm();
    }
  })

  return (
    <>
      <section className="h-screen bg-[#EDF7F4]">
        <div className="grid h-full grid-cols-1 p-3 md:grid-cols-2">
          {/* --------------- Left Col -------------- */}
          <div className="flex h-full flex-col items-center justify-center gap-[3rem] lg:gap-0 lg:justify-between rounded-3xl bg-white py-12 lg:mr-5">
            {/* Title & Desc */}
            <div className="flex flex-col items-center gap-5 pt-4 md:pt-0">
              <img src={appLogoSm} alt="" className="h-12"></img>
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-[30px] font-bold text-[#28302A]">Welcome Back!</h3>
                <span className="text-gray-500">Please enter your details</span>
              </div>
            </div>
            <div className="mt-0 flex w-full flex-col gap-5 px-[2.2rem] pb-8 md:mt-5 md:px-[2rem] lg:px-[8rem]">
              {/* Input email, Password */}
              <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                {/* email */}
                <label className="relative block w-full rounded-full border border-[#D4D4D5] focus-within:border-[#4ECCA3] focus-within:outline-1 focus-within:outline-[#4ECCA3] focus-within:outline">
                  <input
                    name="email"
                    value={formik.values.email}
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
                {formik.touched.email && formik.errors.email ? <span className="text-red-500 text-[14px]">{formik.errors.email}</span> : null}
                {/* Password */}
                <label className="relative block w-full rounded-full border border-[#D4D4D5] focus-within:border-[#4ECCA3] focus-within:outline-1 focus-within:outline-[#4ECCA3] focus-within:outline">
                  <input
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    type={showPassword ? 'text' : 'password'}
                    className="peer w-full border-none bg-transparent px-4 py-2.5 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                    placeholder="Password"
                    autoComplete="off"
                  />
                  <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 px-3 text-sm text-gray-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                    Password
                  </span>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 transform -translate-y-1/2 right-4 focus:outline-none">
                    {showPassword ? <img src={eyeIcon} className="h-5" /> : <img src={eyeOffIcon} className="h-5" />}
                  </button>
                </label>
                {formik.touched.password && formik.errors.password ? <span className="text-red-500 text-[14px]">{formik.errors.password}</span> : null}
                <div className="flex gap-1 justify-end items-center">
                  <div className="flex justify-end" onClick={handleModalOpen}>
                    <span className="w-full cursor-pointer text-end text-[14px] text-gray-600 hover:text-gray-700 hover:underline hover:decoration-1">
                      Forgot password
                    </span>
                  </div>
                  <span className="text-gray-500 text-[14px]"> or</span>
                  <div className="flex justify-end" onClick={handleModalOpen2}>
                    <span className="w-full cursor-pointer text-end text-[14px] text-gray-600 hover:text-gray-700 hover:underline hover:decoration-1">
                      Account not verified?
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-2 rounded-full bg-[#28302A] h-[46px] font-medium text-white hover:bg-black transition delay-100 ease-in-out"
                  disabled={isLoading}>
                  <span className="button-text">
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <SyncLoader color="#c0cac2" size={9} />
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </span>
                </button>
              </form>
              {/* social Login */}
              <div className="inline-flex items-center justify-center">
                <hr className="mt-[0.2rem] h-px w-full border-0 bg-gray-300"></hr>
                <p className="whitespace-nowrap bg-white px-3 text-[15px] text-gray-800">or continue with</p>
                <hr className="mt-[0.2rem] h-px w-full border-0 bg-gray-300"></hr>
              </div>
              {/* <div className="flex items-center justify-center gap-5">
                                <motion.div
                                    onClick={handleGoogleSignin}
                                    className="flex h-12 cursor-pointer gap-3 rounded-full bg-[#f0f0f0] p-3 hover:bg-[#e6e6e6]"
                                    onHoverStart={() => setSocialHover1(true)}
                                    onHoverEnd={() => setSocialHover1(false)}
                                    initial={{ opacity: 1, x: 0 }}
                                    animate={{ opacity: 1, x: socialHover1 ? 10 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img src={googleIcon} alt="" className=""></img>
                                    <AnimatePresence>
                                        {socialHover1 && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -50 }}
                                                transition={{ duration: 0.3 }}
                                                className="mr-0 whitespace-nowrap text-[14px] font-semibold text-gray-500 md:mr-1.5"
                                            >
                                                Log in with Google
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                <motion.div
                                    className="flex h-12 cursor-pointer gap-3 rounded-full bg-[#1977F3] p-3"
                                    onHoverStart={() => setSocialHover2(true)}
                                    onHoverEnd={() => setSocialHover2(false)}
                                    initial={{ opacity: 1, x: 0 }}
                                    animate={{ opacity: 1, x: socialHover1 ? 10 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img src={facebookIcon} alt="" className=""></img>
                                    <AnimatePresence>
                                        {socialHover2 && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -50 }}
                                                transition={{ duration: 0.3 }}
                                                className="mr-0 whitespace-nowrap text-[14px] font-semibold text-white md:mr-1.5"
                                            >
                                                Log in with Facebook
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div> */}
              <button onClick={handleGoogleSignin} className="w-full flex justify-center items-center h-[46px] gap-2.5 bg-[#f0f0f0] rounded-full hover:bg-[#e6e6e6]">
                <img src={googleIcon} alt="" className="h-[1.1rem] w-[1.1rem] object-cover mb-[1px]"></img>
                <span className="whitespace-nowrap text-[14px] font-semibold text-gray-600">Sign In with Google</span>
              </button>
            </div>
            <div>
              <span className="text-[15px] text-gray-800">
                Don&apos;t have an account?
                <span onClick={() => navigate('/register')} className="cursor-pointer font-semibold text-[#41907A] hover:underline hover:decoration-1">
                  {' '}
                  Register
                </span>
              </span>
            </div>
          </div>
          {/* --------------- Right Col -------------- */}
          <div className="hidden h-full flex-col items-center justify-center gap-[2.6rem] md:flex">
            <img src={loginBanner} alt="" className="h-[28vh] lg:h-[58vh]"></img>
            <h4 className="whitespace-pre text-center text-[19px] font-medium text-[#28302A]">
              Make grocery shopping easier <br></br> with <span className="font-bold"> Fresh Finds</span>
            </h4>
          </div>
        </div>
      </section>
      {/* Forgot Password & Account not verified*/}
      <ModalUserForgotPassword modalOpen={modalOpen} handleModalOpen={handleModalOpen} />
      <ModalUserReverify modalOpen2={modalOpen2} handleModalOpen2={handleModalOpen2} />
    </>
  )
}
