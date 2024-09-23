import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import axios from '../../api/axios'
import { Navbar } from '../navbar'
import { formatDistance } from '../../functions/functions'
import { StoreLocatorMap } from './components/storeLocatorMap'
import { Footer } from '../footer'
import { useGeoLocation } from '../../hooks/useGeoLocation'

export const StoreLocator = () => {
  const { loaded, coordinates } = useGeoLocation()

  const [branchData, setBranchData] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [listExpand, setListExpand] = useState(false)

  const handleStoreClick = (index) => {
    setSelectedStore(filteredBranchData()[index])
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredBranchData = () => {
    return branchData?.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.address.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const fetchNearbyBranch = async () => {
    try {
      const response = await axios.post(`branches/get-nearest?latitude=${coordinates.lat}&longitude=${coordinates.lng}`)
      setBranchData(response.data.result)
      if (response.data.result.length > 0 && !selectedStore) {
        setSelectedStore(response.data.result[0])
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchNearbyBranch()
  }, [loaded, coordinates?.lat, coordinates?.lng])

  return (
    <>
      <Navbar />
      {/* <section className="mx-[16px] md:mx-[32px] lg:mx-[160px] mb-[4rem]"> */}
      <section className="relative lg:mx-[160px] lg:pb-[4rem]">
        {/* Breadcrumb */}
        <div className="flex w-max items-center justify-center gap-1.5 rounded-lg bg-none pl-1.5 text-[14px] font-medium text-gray-500 my-2 lg:my-3">
          <Link to={'/'} className="cursor-pointer hover:underline hover:text-[#858585] underline-offset-2">
            Home
          </Link>
          <div className="flex items-center pt-[0.1rem]">
            <svg width="6" height="10" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 11.5L6.5 6.5L1.5 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="">Store Locator</span>
        </div>
        {/*  */}
        <div className="relative flex flex-col lg:flex-row lg:gap-3">
          {/* Left */}
          <AnimatePresence>
            <motion.div className="px-[16px] lg:px-0 flex flex-col order-last lg:order-first lg:w-[35vw] bg-[#28302A] lg:bg-transparent pb-8 pt-2.5 lg:py-0 rounded-t-2xl lg:rounded-none">
              <div onClick={() => setListExpand(!listExpand)} className="lg:hidden flex justify-center text-white p-1 cursor-pointer mb-2.5">
                <motion.svg
                  width="38"
                  height="10"
                  viewBox="0 0 40 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: listExpand ? 180 : 0 }}
                  transition={{ duration: 0.3 }}>
                  <path d="M2 9L20 2" stroke="#F6F7F8" strokeWidth="3" strokeLinecap="round" />
                  <path d="M20 2L38 9" stroke="#F6F7F8" strokeWidth="3" strokeLinecap="round" />
                </motion.svg>
              </div>
              <div className="relative w-full mb-2 lg:pr-2.5">
                <div className="absolute inset-y-0 right-5 flex cursor-pointer items-center pl-3">
                  <FiSearch size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="table-search"
                  className="block rounded-xl border border-[#dbdbdb] bg-[transparent] p-2.5 pl-4 text-sm text-gray-100 lg:text-gray-900 duration-300 focus:border-[#4ECCA3] focus:outline-[#4ECCA3] w-full "
                  placeholder="Search a store..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div id="modal-scroll" className={`${listExpand ? 'h-[60vh]' : 'h-[15vh]'} pr-1.5 flex flex-col gap-2 overflow-auto lg:h-[72vh]`}>
                {/*  */}
                {filteredBranchData().map((item, index) => (
                  <>
                    <div
                      key={index}
                      onClick={() => handleStoreClick(index)}
                      className="flex flex-col hover:bg-[#f0f2f4] px-5 py-4 lg:py-5 cursor-pointer rounded-lg bg-[#F6F7F8] transition ease-in-out delay-100">
                      <div className="flex justify-between items-center">
                        <span className="text-[#212121] font-semibold">{item?.name}</span>
                        {item?.distance && (
                          <>{item?.distance < 25000 && <span className="text-[14px] text-gray-500 font-medium">{formatDistance(item.distance)} away</span>}</>
                        )}
                      </div>
                      <span className="text-[14px] line-clamp-2 mt-[0.4rem] font-normal text-gray-600">{item?.address}</span>
                      {/* <span className="text-[14px] mt-[0.1rem] font-normal text-[#757575]">{item.phone}</span> */}
                      <button className="hidden md:block rounded-full px-3.5 py-1.5 w-max text-[13px] font-normal text-[#00A67C] transition delay-100 ease-in-out border border-[#00A67C] hover:bg-[#00A67C] hover:text-white mt-[0.8rem]">
                        View on Map
                      </button>
                    </div>
                  </>
                ))}
                {/*  */}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right */}
          {/* <section className="h-[55vh] lg:h-[80vh] lg:w-[65vw]"> */}
          <section className={`${listExpand ? 'h-[20vh]' : 'h-[60vh]'} lg:h-[80vh] lg:w-[65vw]`}>
            {selectedStore && <StoreLocatorMap latitude={selectedStore.latitude} longitude={selectedStore.longitude} selectedStore={selectedStore} />}
          </section>
        </div>
      </section>
      <Footer />
    </>
  )
}
