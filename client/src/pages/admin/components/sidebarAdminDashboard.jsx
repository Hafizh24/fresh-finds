/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Avatar, Button, Typography } from '@material-tailwind/react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { IoMdLogOut } from 'react-icons/io'
import { BsChevronDown } from 'react-icons/bs'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import axios from '../../../api/axios'
import { sidebarData } from './sidebarData'

export default function AdminSidebar({ subMenuStatus = false }) {
  const adminData = useSelector((state) => state.admin.value)
  const token = localStorage.getItem('admtoken')
  const [subMenuOpen, setSubMenuOpen] = useState(subMenuStatus)
  const [navMenuOpen, setNavMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.post('admins/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      localStorage.removeItem('admtoken')
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
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
    <div className="relative w-full lg:max-w-[20rem] px-4 pt-2.5 pb-2 md:px-[5rem]  lg:p-4 shadow-xl shadow-blue-gray-900/5 gap-5 bg-[#4eaf94] border-b border-[#4ba88e] lg:border-none">
      <div className="flex flex-col items-center justify-between lg:justify-center lg:pt-[0.5rem] gap-2 lg:pb-5 lg:border-b border-[#78c3ae]">
        <div className="flex justify-between lg:justify-start items-center w-full gap-[1rem]">
          <Avatar
            size="xl"
            src={adminData.profile_picture ? adminData.profile_picture : 'https://th.bing.com/th/id/OIP.0CZd1ESLnyWIHdO38nyJDAAAAA?rs=1&pid=ImgDetMain'}
            alt="avatar"
            className=" h-[2.6rem] w-[2.6rem] lg:h-[3rem] lg:w-[3rem]"
          />
          <div className="flex flex-col justify-center text-white">
            <span className="font-semibold text-[15px] lg:text-[15px]">{adminData?.name || 'undefined'}</span>
            <span className="font-normal text-[14px] text-[#e8fcf2] lg:text-[14px]">{adminData?.isSuperAdmin ? <>Super Admin</> : <>Admin</>}</span>
          </div>
          <div
            className="block lg:hidden rounded-lg bg-[#8dccba] hover:bg-[#82c7b4] transition ease-in-out delay-100 p-1.5 cursor-pointer h-max ml-auto"
            onClick={() => setNavMenuOpen(!navMenuOpen)}>
            {!navMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="#408f79" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#408f79" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="#408f79" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#408f79" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        </div>
        <NavLink to={'/admin-profile'} className="w-full mt-2 hidden lg:block">
          <Button variant="filled" className="w-full flex items-center gap-3 bg-[#9dd5c6] text-[#2f6a59] rounded-xl">
            <UserCircleIcon className="h-5 w-5 whitespace-nowrap" />
            <span className="whitespace-nowrap capitalize font-semibold text-[14px] pb-[0.1rem]">Profile & Settings</span>
          </Button>
        </NavLink>
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
            }}
            className="absolute lg:relative bg-[#4EAF94] left-0 px-4 md:px-[5rem] lg:px-0 z-50 w-full flex flex-col items-center gap-1.5 lg:mt-4">
            <NavLink to={'/admin-profile'} className="w-full mt-5 lg:hidden">
              <Button variant="filled" className="w-full flex items-center gap-3 bg-[#9dd5c6] text-[#2f6a59] rounded-xl">
                <UserCircleIcon className="h-5 w-5 whitespace-nowrap" />
                <span className="whitespace-nowrap capitalize font-semibold text-[14px] pb-[0.1rem]">Profile & Settings</span>
              </Button>
            </NavLink>
            {sidebarData.map((item, index) => (
              <React.Fragment key={index}>
                {adminData?.isSuperAdmin === true ? (
                  <>
                    {!item.subMenus ? (
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex cursor-pointer w-full p-3 rounded-xl text-[15px] font-medium ${
                            isActive ? 'bg-[#edf7f4] text-[#41907a]' : 'text-[#edf7f4] hover:bg-[#edf7f4] hover:text-[#41907a]'
                          }`
                        }>
                        <div className="flex flex-row w-full gap-3 items-center whitespace-nowrap">
                          {item.icon}
                          {item.title}
                        </div>
                      </NavLink>
                    ) : (
                      <>
                        <div onClick={() => setSubMenuOpen(!subMenuOpen)} className={'flex flex-col cursor-pointer w-full p-3 rounded-md text-[#edf7f4]'}>
                          <div className="flex flex-row w-full gap-3 items-center whitespace-nowrap text-[15px] font-medium">
                            {item.icon}
                            {item.title}
                            <BsChevronDown className={`${subMenuOpen && 'rotate-180'}`} />
                          </div>
                        </div>
                        {subMenuOpen && (
                          <div className="flex flex-col w-full pl-8 pr-8 text-[15px] font-medium">
                            {item.subMenus.map((subMenuItem, index) => (
                              <NavLink
                                to={subMenuItem.path}
                                key={index}
                                className={({ isActive }) =>
                                  `flex cursor-pointer w-full p-2 rounded-xl ${
                                    isActive ? 'bg-[#edf7f4] text-[#41907a]' : 'text-[#edf7f4] hover:bg-[#edf7f4] hover:text-[#41907a]'
                                  }`
                                }>
                                {subMenuItem.title}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {item.admin === true && (
                      <>
                        {!item.subMenus ? (
                          <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                              `flex cursor-pointer w-full p-3 rounded-xl font-medium ${
                                isActive ? 'bg-[#edf7f4] text-[#41907a]' : 'text-[#edf7f4] hover:bg-[#edf7f4] hover:text-[#41907a]'
                              }`
                            }>
                            <div className="flex flex-row w-full gap-2 items-center">
                              {item.icon}
                              {item.title}
                            </div>
                          </NavLink>
                        ) : (
                          <>
                            <div onClick={() => setSubMenuOpen(!subMenuOpen)} className={'flex flex-col cursor-pointer w-full p-3 rounded-md text-[#edf7f4]'}>
                              <div className="flex flex-row w-full gap-2 items-center font-medium">
                                {item.icon}
                                {item.title}
                                <BsChevronDown className={`${subMenuOpen && 'rotate-180'}`} />
                              </div>
                            </div>
                            {subMenuOpen && (
                              <div className="flex flex-col w-full pl-8 pr-8 font-medium">
                                {item.subMenus.map((subMenuItem, index) => (
                                  <NavLink
                                    to={subMenuItem.path}
                                    key={index}
                                    className={({ isActive }) =>
                                      `flex cursor-pointer w-full p-3 rounded-xl mb-2 ${
                                        isActive ? 'bg-[#edf7f4] text-[#41907a]' : 'text-[#edf7f4] hover:bg-[#edf7f4] hover:text-[#41907a]'
                                      }`
                                    }>
                                    {subMenuItem.title}
                                  </NavLink>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
            <div onClick={handleLogout} className="flex items-start cursor-pointer w-full p-3 rounded-lg text-white hover:bg-[#edf7f4] hover:text-[#41907a] mb-4">
              <div className="flex flex-row w-full gap-2 items-center">
                <IoMdLogOut className="h-5 w-5" />
                Logout
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
