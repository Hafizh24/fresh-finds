import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { ModalSignOut } from './modalSignOut'
import { storeLastVisitedPage } from '../../../functions/storeLastVisitedPage'

const accountListLogin = [
  { title: 'My account', link: '/user-dashboard' },
  { title: 'Wishlist', link: '/' }
]

export const ModalAccount = ({ isOpenAccount }) => {
  const customer = useSelector((state) => state.customer.value)
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRedirectToLogin = () => {
    storeLastVisitedPage()
    navigate('/signin')
  }

  const renderAccountLinks = () => {
    if (customer.firstname) {
      const loggedInLinks = accountListLogin.map((item) => (
        <Link key={item.title} to={item.link}>
          <div className="cursor-pointer group border-l-2 border-white py-1 hover:border-[#3A826E] hover:bg-[#F0FAF7]">
            <span className="px-4 text-[15px] font-medium text-gray-600 group-hover:text-[#3A826E]">{item.title}</span>
          </div>
        </Link>
      ))

      const logOutLink = (
        <div
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="z-[500] border-t border-t-[#EEEEEE] cursor-pointer group border-l-2 border-white pb-1 pt-1.5 hover:border-l-[#3A826E] hover:bg-[#F0FAF7]">
          <div className="flex justify-start items-center gap-1 pl-4">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.99644 1H2C1.44772 1 1 1.44772 1 2V16C1 16.5523 1.44772 17 2 17H9M13 13L17 9L13 5M6.5 8.99644H17"
                stroke="#586474"
                strokeWidth="1.77778"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="px-2 text-[15px] font-medium text-[#586474] group-hover:text-[#3A826E]">Log out</span>
          </div>
        </div>
      )

      return [...loggedInLinks, logOutLink]
    } else {
      return (
        <div className="">
          <div onClick={handleRedirectToLogin} className="px-4 w-full cursor-pointer group border-l-2 border-white py-1 hover:border-[#3A826E] hover:bg-[#F0FAF7]">
            <span className="whitespace-nowrap text-[15px] font-medium text-gray-600 group-hover:text-[#3A826E]">Sign in</span>
          </div>
          <Link to={'/register'}>
            <div className="px-4 w-full cursor-pointer group border-l-2 border-white py-1 hover:border-[#3A826E] hover:bg-[#F0FAF7]">
              <span className="whitespace-nowrap text-[15px] font-medium text-gray-600 group-hover:text-[#3A826E]">Create Account</span>
            </div>
          </Link>
        </div>
      )
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpenAccount && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white z-[100] w-[9rem] absolute top-[102px] rounded-lg pb-2 pt-1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
            <div className="flex flex-col gap-0.5">
              <div className="px-4 font-semibold text-[15px] text-[#343538] py-1.5 border-b border-gray-200">Account</div>
              {renderAccountLinks()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ModalSignOut isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  )
}

ModalAccount.propTypes = {
  isOpenAccount: PropTypes.bool.isRequired
}
