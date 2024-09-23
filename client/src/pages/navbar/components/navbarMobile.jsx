import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import appLogoSm from '../../../assets/lemon-logo.svg'
import crossIcon from '../../../assets/navbar/cross.svg'
import personIcon from '../../../assets/userDashboard/person.svg'
import { storeLastVisitedPage } from '../../../functions/storeLastVisitedPage'

export const NavbarMobile = ({ isOpen, toggleMenu, isOpenCategory, toggleMenuCategory, categoryList }) => {
  const customer = useSelector((state) => state.customer.value)
  const navigate = useNavigate()

  const handleRedirectToLogin = () => {
    storeLastVisitedPage()
    navigate('/signin')
  }

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="z-50 fixed top-0 w-[100vw] items-start bg-[#347563] px-[18px] py-5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={appLogoSm} alt="" className="h-8"></img>
              <h3 className="text-[20px] font-medium text-white">Menu</h3>
            </div>
            <button onClick={toggleMenu}>
              <img src={crossIcon} alt="" className="h-4 cursor-pointer"></img>
            </button>
          </div>
          <div className="mb-5 mt-7 flex w-full flex-col gap-4">
            <div>
              {/* All Category Button */}
              <button onClick={toggleMenuCategory} className="cursor-pointer">
                <div className="flex items-center gap-3">
                  {/* <img src={categoryIcon2} alt="" className="h-8"></img> */}
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[17px] font-medium text-white">All Category</h3>
                    <motion.svg
                      width="19"
                      height="19"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-[0.2rem]"
                      animate={{ rotate: isOpenCategory ? 180 : 0 }}
                      transition={{ duration: 0.3 }}>
                      <path
                        d="M13.8106 5.65892L8.50019 10.8354L3.18981 5.65892C3.09493 5.56625 2.96757 5.51437 2.83494 5.51437C2.70231 5.51437 2.57494 5.56625 2.48006 5.65892C2.43412 5.70394 2.39763 5.75766 2.37271 5.81696C2.34779 5.87625 2.33496 5.93992 2.33496 6.00424C2.33496 6.06855 2.34779 6.13222 2.37271 6.19152C2.39763 6.25081 2.43412 6.30454 2.48006 6.34955L8.12937 11.8575C8.22858 11.9543 8.36165 12.0084 8.50019 12.0084C8.63873 12.0084 8.77179 11.9543 8.871 11.8575L14.5203 6.35061C14.5666 6.30557 14.6033 6.25171 14.6285 6.19222C14.6536 6.13273 14.6665 6.06881 14.6665 6.00424C14.6665 5.93966 14.6536 5.87575 14.6285 5.81626C14.6033 5.75677 14.5666 5.70291 14.5203 5.65786C14.4254 5.56519 14.2981 5.51331 14.1654 5.51331C14.0328 5.51331 13.9054 5.56519 13.8106 5.65786V5.65892Z"
                        fill="white"
                      />
                    </motion.svg>
                  </div>
                </div>
              </button>
              {/* Category List */}
              <AnimatePresence>
                {isOpenCategory && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1 flex flex-col gap-2 py-2 pl-[2rem]">
                    {categoryList.map((item, index) => (
                      <motion.span
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }} // Adjust the delay duration
                        className="text-white"
                        onClick={() => navigate(`/catalogue/${item.id}`)}>
                        {item.name}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to={`/catalogue/0/`} onClick={handleLinkClick}>
              <h3 className="text-[17px] font-medium text-white">Catalogue</h3>
            </Link>
            <Link to={'/'} onClick={handleLinkClick}>
              <h3 className="text-[17px] font-medium text-white">Home</h3>
            </Link>
            <Link to={'/about'} onClick={handleLinkClick}>
              <h3 className="text-[17px] font-medium text-white">About Us</h3>
            </Link>
            <Link to={'/store-locator'} onClick={handleLinkClick}>
              <h3 className="text-[17px] font-medium text-white">Find a Store</h3>
            </Link>
          </div>
          {/* account */}
          <div className="mt-3 flex w-full items-center gap-4 border-t pt-4">
            {!customer.id && (
              <>
                <svg
                  // width="26"
                  // height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[1.2rem] w-[1.2rem] mb-[0.1rem]">
                  <path
                    d="M4.1665 21.875V20.8334C4.1665 17.3816 6.96472 14.5834 10.4165 14.5834H14.5832C18.0349 14.5834 20.8332 17.3816 20.8332 20.8334V21.875"
                    stroke="white"
                    strokeWidth="2.08333"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12.5002 11.4583C10.199 11.4583 8.3335 9.59285 8.3335 7.29167C8.3335 4.99048 10.199 3.125 12.5002 3.125C14.8013 3.125 16.6668 4.99048 16.6668 7.29167C16.6668 9.59285 14.8013 11.4583 12.5002 11.4583Z"
                    stroke="white"
                    strokeWidth="2.08333"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="flex gap-2">
                  <span onClick={handleRedirectToLogin} className="cursor-pointer text-white underline underline-offset-2">
                    Sign in
                  </span>
                  <span className="text-white">or</span>
                  <Link to={'/register'} className="cursor-pointer text-white underline underline-offset-2">
                    Create account
                  </Link>
                </div>
              </>
            )}

            {customer.id && (
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  {customer.profile_picture ? (
                    <img src={customer.profile_picture} alt="" className="h-9 w-9 object-cover rounded-full" />
                  ) : (
                    <div className="flex items-center justify-center rounded-full bg-[#E4E6E7] h-9 w-9">
                      <img src={personIcon} alt="" className="ml-[1px]" />
                    </div>
                  )}
                  <span className="text-white text-[17px] font-medium">{customer.firstname}</span>
                </div>
                <Link to={'/user-dashboard'} onClick={handleLinkClick} className="flex">
                  <span className="text-white text-[16px] cursor-pointer underline underline-offset-2">My Account</span>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

NavbarMobile.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  isOpenCategory: PropTypes.bool.isRequired,
  toggleMenuCategory: PropTypes.func.isRequired,
  categoryList: PropTypes.array.isRequired
}
