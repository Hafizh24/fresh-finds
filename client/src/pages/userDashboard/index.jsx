import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { UserAddress } from './components/userAddress'
import { ResetPassword } from './components/resetPassword'
import { AnimationWrapper } from './components/animationWrapper'
import { ModalSignOut } from '../navbar/components/modalSignOut'
import { Footer } from '../footer'
import { MyVoucher } from './components/myVoucher'
import { ChangeEmailPermission } from './components/changeEmailPermission'
import { PersonalInformation } from './components/personalInfo'
import avaDummy from '../../assets/userDashboard/ava-dummy.png'
import appLogoWhite from '../../assets/userDashboard/app-logo-white.svg'
import personIcon from '../../assets/userDashboard/person.svg'
import addressIcon from '../../assets/userDashboard/address.svg'
import passwordIcon from '../../assets/userDashboard/password.svg'
import orderIcon from '../../assets/userDashboard/order.svg'
import wishlistIcon from '../../assets/userDashboard/wishlist.svg'
import logoutIcon from '../../assets/userDashboard/logout.svg'
import toHomeIcon from '../../assets/userDashboard/toHome.svg'
import emailIcon from '../../assets/userDashboard/email.svg'
import voucherIcon from '../../assets/userDashboard/voucherIcon.svg'

const menuList = [
  { title: 'Personal Information', icon: personIcon },
  { title: 'Address List', icon: addressIcon },
  { title: 'My Voucher', icon: voucherIcon },
  { title: 'Reset Password', icon: passwordIcon },
  { title: 'Change Email', icon: emailIcon },
  { title: 'Order History', icon: orderIcon },
  { title: 'Wishlist', icon: wishlistIcon }
]

export const UserDashboard = () => {
  const navigate = useNavigate()
  const customer = useSelector((state) => state.customer.value)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(0)
  const [navMenuOpen, setNavMenuOpen] = useState(false)
  const [currentOption, setCurrentOption] = useState('Personal Information')

  const filteredMenuList = customer.socialRegister ? menuList.filter((item) => item.title !== 'Reset Password' && item.title !== 'Change Email') : menuList

  const handleMenuClick = (index) => {
    setSelectedOption(index)
    setCurrentOption(filteredMenuList[index].title)
  }

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth

      if (screenWidth < 768) {
        setNavMenuOpen(false)
      } else {
        setNavMenuOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <section className=" bg-[#FAFAFC]">
        {/* Navbar */}
        <div className="bg-[#71C1AB] flex justify-between items-center px-[18px] lg:px-[160px] py-2 mb-4 border-b border-[#E4E4E4]">
          <img src={appLogoWhite} alt="" className="h-[28px] lg:h-[35px] "></img>
        </div>
        <div className="mx-[16px] lg:mx-[160px] pb-7 lg:pt-1">
          {/* Breadcrumb */}
          <div className="flex w-max items-center justify-center gap-1.5 rounded-lg bg-none pl-1.5 text-[14px] font-medium text-gray-500">
            <Link to={'/'} className="cursor-pointer hover:underline hover:text-[#858585] underline-offset-2">
              Home
            </Link>
            <div className="flex items-center pt-[0.1rem]">
              <svg width="6" height="10" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 11.5L6.5 6.5L1.5 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>My Account</span>
            <div className="flex items-center pt-[0.1rem]">
              <svg width="6" height="10" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 11.5L6.5 6.5L1.5 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>{currentOption}</span>
          </div>
          {/*  */}
          <div className="mt-4 flex flex-col lg:flex-row justify-start gap-[0.6rem] lg:gap-[2rem]">
            {/* Left Col: Menu */}
            <div className="flex h-max flex-col gap-[0.2rem] rounded-2xl border border-[#E6E6E5] bg-white py-3.5 lg:pt-5">
              {/* profile & hamburger */}
              <div className="flex justify-between lg:justify-start items-center lg:border-b lg:border-[#E6E6E5] px-5 lg:pb-4">
                <div className="flex gap-3 items-center">
                  <img src={customer.profile_picture ? customer.profile_picture : avaDummy} alt="" className="h-10 w-10 rounded-full object-cover"></img>
                  <div className="flex flex-col gap-[0.2rem]">
                    <span className="text-[15px] font-semibold text-gray-800">
                      {customer.firstname} {customer?.lastname}
                    </span>
                    <span className="text-[13px] text-gray-600">{customer.email}</span>
                  </div>
                </div>
                <div
                  className="block lg:hidden rounded-lg bg-gray-100 hover:bg-gray-200 transition ease-in-out delay-100 p-1.5 cursor-pointer"
                  onClick={() => setNavMenuOpen(!navMenuOpen)}>
                  {!navMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
              <AnimatePresence>
                {navMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 0, height: 0 }}
                    transition={{
                      type: 'spring',
                      bounce: 0,
                      duration: 0.7
                    }}>
                    {filteredMenuList.map((item, index) => (
                      <div
                        // className="group flex gap-4 px-7 cursor-pointer hover:bg-[#F0FAF7] py-3 border-l-[2px] border-white hover:border-[#41907A]"
                        className={`${
                          selectedOption === index ? 'border-[#00A67C] bg-[#F0FAF7] text-[#00A67C]' : 'text-gray-600 border-white'
                        } group flex cursor-pointer gap-4 border-l-[2px] px-7 py-3 hover:bg-[#F0FAF7] first:mt-3 lg:first:mt-0`}
                        key={index}
                        id={item.id}
                        onClick={() => handleMenuClick(index)}>
                        <img src={item.icon} alt="" className="fill-red-500"></img>
                        <span className="text-[15px] font-medium">{item.title}</span>
                      </div>
                    ))}
                    <div className="flex flex-col border-t border-[#E6E6E5] pt-2">
                      <div onClick={() => navigate('/')} className="cursor-pointer flex gap-4 py-3  px-7 group hover:bg-[#F0FAF7]">
                        <img src={toHomeIcon} alt=""></img>
                        <span className="group-hover:text-[#00A67C] text-[15px] font-medium text-gray-600">Back to Home</span>
                      </div>
                      <div onClick={() => setIsModalOpen(true)} className="cursor-pointer flex gap-4 py-3  px-7 group hover:bg-[#F0FAF7]">
                        <img src={logoutIcon} alt=""></img>
                        <span className="group-hover:text-[#00A67C] text-[15px] font-medium text-gray-600">Log Out</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Right Col */}
            <div className="flex flex-1 flex-col">
              <AnimationWrapper selectedOption={selectedOption} index={0}>
                <PersonalInformation />
              </AnimationWrapper>
              <AnimationWrapper selectedOption={selectedOption} index={1}>
                <UserAddress />
              </AnimationWrapper>
              <AnimationWrapper selectedOption={selectedOption} index={2}>
                <MyVoucher />
              </AnimationWrapper>

              {!customer.socialRegister && (
                <>
                  <AnimationWrapper selectedOption={selectedOption} index={3}>
                    <ResetPassword />
                  </AnimationWrapper>
                  <AnimationWrapper selectedOption={selectedOption} index={4}>
                    <ChangeEmailPermission />
                  </AnimationWrapper>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ModalSignOut isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  )
}
