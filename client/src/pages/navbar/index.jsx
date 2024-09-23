import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Tooltip } from '@material-tailwind/react'
import { Link, useNavigate } from 'react-router-dom'
import Headroom from 'react-headroom'
import axios from '../../api/axios'
import { MdLocationOn } from 'react-icons/md'

import appLogo from '../../assets/logo-app-1.png'
import appLogoSm from '../../assets/lemon-logo.svg'
import categoryIcon from '../../assets/navbar/category.svg'
import searchIcon from '../../assets/navbar/search.svg'
import { NavbarMobile } from './components/navbarMobile'
import { ModalCategory } from './components/modalCategory'
import { ModalAccount } from './components/modalAccount'
import { ShoppingCart } from './components/shoppingCart'
import { fetchAddressFromCoordinates } from '../../api/fetchAddressFromCoordinates'
import { truncateString } from '../../functions/functions'
import { useGeoLocation } from '../../hooks/useGeoLocation'

export const Navbar = () => {
  const customer = useSelector((state) => state.customer.value)
  const totalProduct = useSelector((state) => state.cart.totalProduct)

  // const { coordinates, loaded } = useSelector((state) => state.geolocation);
  const { loaded, coordinates } = useGeoLocation()
  const [formattedAddress, setFormattedAddress] = useState('')

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenCategory, setIsOpenCategory] = useState(false)
  const [isOpenAccount, setIsOpenAccount] = useState(false)
  const [isOpenCart, setIsOpenCart] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleMenuCategory = () => {
    setIsOpenCategory(!isOpenCategory)
  }

  const toggleMenuAccount = () => {
    setIsOpenAccount(!isOpenAccount)
  }

  const toggleOpenCart = () => {
    setIsOpenCart(!isOpenCart)
  }

  const [categoryList, setCategoryList] = useState([])
  const [searchValue, setSearchValue] = useState([])
  const navigate = useNavigate()

  const getCategory = async () => {
    try {
      const response = await axios.get(`/categories/all?all=true}`)
      setCategoryList(response.data.result.rows)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (loaded) {
      const getAddress = async () => {
        const address = await fetchAddressFromCoordinates(coordinates?.lat, coordinates?.lng)
        // console.log(address);

        setFormattedAddress(address)
      }
      getAddress()
    }
  }, [coordinates?.lat, coordinates?.lng])

  useEffect(() => {
    getCategory()
  }, [])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      navigate(`/catalogue/0/${searchValue}`)
    }
  }

  return (
    <div className="relative z-[200]">
      {/* Top Navbar */}
      {/* {isNavbarVisible && ()} */}
      <div className="w-full fixed flex items-center justify-between bg-[#72C1AC] px-[16px] h-[34px] lg:px-[160px] z-50">
        <div className="flex items-center gap-2 w-max">
          <div className="flex items-center gap- w-max">
            <MdLocationOn size={17} className="text-white" />
            {/* <span className="text-[15px] text-white whitespace-nowrap">
              Delivery to
            </span> */}
          </div>
          <span className="text-[15px] font-normal text-white underline underline-offset-2 line-clamp-1 w-max cursor-pointer">
            {loaded && formattedAddress ? (
              <Tooltip
                content={formattedAddress}
                className="bg-white text-gray-600 border border-blue-gray-50 shadow-xl shadow-black/10 py-[0.4rem] px-[0.6rem]"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: -15 }
                }}>
                <div>
                  <p className="hidden md:block">{truncateString(formattedAddress, 75)}</p>
                  <p className="md:hidden">{truncateString(formattedAddress, 42)}</p>
                </div>
              </Tooltip>
            ) : (
              <Tooltip
                content="Please allow the browser to access your location"
                className="bg-white text-gray-600 border border-blue-gray-50 shadow-xl shadow-black/10 py-[0.4rem] px-[0.6rem]"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: -15 }
                }}>
                <p>Location not available</p>
              </Tooltip>
            )}
          </span>
        </div>
        <Link to={'/store-locator'}>
          <span className="font-normal mr-1 hidden text-[15px] text-white md:block whitespace-nowrap w-max hover:underline underline-offset-2 cursor-pointer transition ease-in-out delay-100">
            Find Our store
          </span>
        </Link>
      </div>
      {/* Bottom Navbar */}
      <Headroom>
        <div className="pt-[44px] flex items-center justify-between border-b border-[#E4E4E4] px-[16px] py-2.5 lg:px-[160px] bg-white">
          {/* Logo & Category */}
          <div className="flex items-center gap-[1rem]">
            <Link to={'/'}>
              <div className="flex shrink-0">
                <img src={appLogo} alt="" className="hidden h-[35px] object-cover md:block"></img>
                <img src={appLogoSm} alt="" className="block h-[35px] object-cover md:hidden"></img>
              </div>
            </Link>
            <div className="hidden items-center gap-2.5 md:flex h-[41px] px-4 rounded-full hover:bg-[#F6F7F8] cursor-pointer transition ease-in-out delay-150">
              {/* -- Category Modal -- */}
              <ModalCategory isOpenCategory={isOpenCategory} categoryList={categoryList} />
              <img src={categoryIcon}></img>
              <div className="flex cursor-pointer gap-1.5 items-center" onClick={toggleMenuCategory}>
                <span className="font-medium text-[#343538]">Category</span>
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-[0.2rem]"
                  animate={{ rotate: isOpenCategory ? 180 : 0 }}
                  transition={{ duration: 0.3 }}>
                  <path
                    d="M13.8106 5.65892L8.50019 10.8354L3.18981 5.65892C3.09493 5.56625 2.96757 5.51437 2.83494 5.51437C2.70231 5.51437 2.57494 5.56625 2.48006 5.65892C2.43412 5.70394 2.39763 5.75766 2.37271 5.81696C2.34779 5.87625 2.33496 5.93992 2.33496 6.00424C2.33496 6.06855 2.34779 6.13222 2.37271 6.19152C2.39763 6.25081 2.43412 6.30454 2.48006 6.34955L8.12937 11.8575C8.22858 11.9543 8.36165 12.0084 8.50019 12.0084C8.63873 12.0084 8.77179 11.9543 8.871 11.8575L14.5203 6.35061C14.5666 6.30557 14.6033 6.25171 14.6285 6.19222C14.6536 6.13273 14.6665 6.06881 14.6665 6.00424C14.6665 5.93966 14.6536 5.87575 14.6285 5.81626C14.6033 5.75677 14.5666 5.70291 14.5203 5.65786C14.4254 5.56519 14.2981 5.51331 14.1654 5.51331C14.0328 5.51331 13.9054 5.56519 13.8106 5.65786V5.65892Z"
                    fill="#343538"
                  />
                </motion.svg>
              </div>
            </div>
          </div>
          {/* Search Bar */}
          <div className="flex grow ml-3 rounded-lg md:ml-0 px-0 md:pl-1 md:pr-3 lg:pl-2">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div onClick={() => navigate(`/catalogue/0/${searchValue}`)} className="absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3">
                <img src={searchIcon}></img>
              </div>
              <input
                type="text"
                id="table-search"
                className="block w-full rounded-full border border-[#F6F7F8] bg-[#F6F7F8] p-2.5 pl-10 text-sm text-gray-900 transition-colors  duration-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 "
                placeholder="Search a product..."
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>
          {/* Sign in & cart */}
          <div className="flex items-center gap-[0.7rem]">
            <div
              className={`${
                customer.profile_picture ? 'pl-[0.125rem] pr-4 border border-transparent hover:border-[#94d1c0]' : 'px-4'
              } hidden cursor-pointer h-[41px] items-center gap-2 md:flex hover:bg-[#f6f7f8] rounded-full transition ease-in-out delay-150`}
              onClick={toggleMenuAccount}>
              {' '}
              {customer.profile_picture ? (
                <img src={customer.profile_picture} className="object-cover h-9 w-9 rounded-full mr-1"></img>
              ) : (
                <svg className="mb-[0.1rem]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.1665 21.875V20.8334C4.1665 17.3816 6.96472 14.5834 10.4165 14.5834H14.5832C18.0349 14.5834 20.8332 17.3816 20.8332 20.8334V21.875"
                    stroke="#343538"
                    strokeWidth="2.08333"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12.5002 11.4583C10.199 11.4583 8.3335 9.59285 8.3335 7.29167C8.3335 4.99048 10.199 3.125 12.5002 3.125C14.8013 3.125 16.6668 4.99048 16.6668 7.29167C16.6668 9.59285 14.8013 11.4583 12.5002 11.4583Z"
                    stroke="#343538"
                    strokeWidth="2.08333"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              <span className="whitespace-nowrap font-medium text-[#343538]">{customer.firstname ? customer.firstname : `Sign in`}</span>
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-[0.2rem]"
                animate={{ rotate: isOpenAccount ? 180 : 0 }}
                transition={{ duration: 0.3 }}>
                <path
                  d="M13.8106 5.65892L8.50019 10.8354L3.18981 5.65892C3.09493 5.56625 2.96757 5.51437 2.83494 5.51437C2.70231 5.51437 2.57494 5.56625 2.48006 5.65892C2.43412 5.70394 2.39763 5.75766 2.37271 5.81696C2.34779 5.87625 2.33496 5.93992 2.33496 6.00424C2.33496 6.06855 2.34779 6.13222 2.37271 6.19152C2.39763 6.25081 2.43412 6.30454 2.48006 6.34955L8.12937 11.8575C8.22858 11.9543 8.36165 12.0084 8.50019 12.0084C8.63873 12.0084 8.77179 11.9543 8.871 11.8575L14.5203 6.35061C14.5666 6.30557 14.6033 6.25171 14.6285 6.19222C14.6536 6.13273 14.6665 6.06881 14.6665 6.00424C14.6665 5.93966 14.6536 5.87575 14.6285 5.81626C14.6033 5.75677 14.5666 5.70291 14.5203 5.65786C14.4254 5.56519 14.2981 5.51331 14.1654 5.51331C14.0328 5.51331 13.9054 5.56519 13.8106 5.65786V5.65892Z"
                  fill="#343538"
                />
              </motion.svg>
            </div>
            {/* -- Modal Account */}
            <ModalAccount isOpenAccount={isOpenAccount} />
            <div
              onClick={toggleOpenCart}
              className="flex h-[41px] items-center justify-between gap-2 rounded-full px-4 md:bg-[#F6F7F8] hover:bg-[#edeff1] transition ease-in-out delay-150 cursor-pointer group">
              <svg className="mb-[0.1rem]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.97738 9.84C4.0176 9.33881 4.24513 8.87115 4.61465 8.53017C4.98417 8.18918 5.46857 7.9999 5.97138 8H18.0294C18.5322 7.9999 19.0166 8.18918 19.3861 8.53017C19.7556 8.87115 19.9832 9.33881 20.0234 9.84L20.8264 19.84C20.8485 20.1152 20.8133 20.392 20.7232 20.6529C20.6331 20.9139 20.4899 21.1533 20.3027 21.3562C20.1155 21.5592 19.8883 21.7211 19.6354 21.8319C19.3825 21.9427 19.1095 21.9999 18.8334 22H5.16738C4.8913 21.9999 4.61823 21.9427 4.36536 21.8319C4.11249 21.7211 3.88529 21.5592 3.69808 21.3562C3.51086 21.1533 3.36768 20.9139 3.27755 20.6529C3.18742 20.392 3.15229 20.1152 3.17438 19.84L3.97738 9.84Z"
                  stroke="#343538"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 11V6C16 4.93913 15.5786 3.92172 14.8284 3.17157C14.0783 2.42143 13.0609 2 12 2C10.9391 2 9.92172 2.42143 9.17157 3.17157C8.42143 3.92172 8 4.93913 8 6V11"
                  stroke="#343538"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-semibold text-[#343538]">{totalProduct}</span>
            </div>
          </div>
          {/* Hamburger */}
          <div className="mt-1 items-center md:hidden">
            <button className="focus:shadow-outline rounded-lg focus:outline-none" onClick={toggleMenu}>
              <svg fill="currentColor" viewBox="0 0 20 20" className="h-6 w-6">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </Headroom>

      {/* -- Navbar Mobile  -- */}
      <NavbarMobile isOpen={isOpen} toggleMenu={toggleMenu} isOpenCategory={isOpenCategory} toggleMenuCategory={toggleMenuCategory} categoryList={categoryList} />

      {/* -- Shopping Cart -- */}
      <ShoppingCart isOpenCart={isOpenCart} toggleOpenCart={toggleOpenCart} />
    </div>
  )
}
