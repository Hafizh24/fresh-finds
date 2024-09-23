import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'

import { Navbar } from '../navbar'
import { ProductCatalogueData } from './components/productCatalogueData'
import { Footer } from '../footer'
import axios from '../../api/axios'
import { formatDistance } from '../../functions/functions'
import { useGeoLocation } from '../../hooks/useGeoLocation'

const filterItems = [
  { title: 'Relevance', sort: 'createdAt', order: 'desc' },
  { title: 'Price: Lowest first', sort: 'price', order: 'asc' },
  { title: 'Price: Highest first', sort: 'price', order: 'desc' },
  { title: 'Name: A - Z', sort: 'name', order: 'asc' },
  { title: 'Name: Z - A', sort: 'name', order: 'desc' }
]

export const ProductCatalogue = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  // const { coordinates, loaded } = useSelector((state) => state.geolocation);
  const { loaded, coordinates } = useGeoLocation()
  const [branchData, setBranchData] = useState(null)
  const [count, setCount] = useState(0)

  const params = useParams()
  const [categoryList, setCategoryList] = useState([])
  const [categoryId, setCategoryId] = useState(params.category_id)
  const [subCategoryId, setSubCategoryId] = useState(0)
  const [searhValue, setSearchValue] = useState(params.search)
  const [branchId, setBranchId] = useState()

  const [nearestBranchProduct, setNearestBranchProduct] = useState([])
  const [pageLimit, setPageLimit] = useState(10)

  const handlePageLimit = () => {
    if (nearestBranchProduct.length % 10 === 0) {
      setPageLimit((prevLimit) => prevLimit + 10)
    }
  }

  //filter
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const handleFilter = (sortBy, orderBy) => {
    setSort(sortBy)
    setOrder(orderBy)
  }

  const fetchNearestBranchProduct = async (branch_id) => {
    try {
      if (searhValue) {
        const response = await axios.get(
          `products/all?page=1&sortBy=${sort}&sortOrder=${order}&limit=${pageLimit}&branch_id=${branch_id}&category_id=${categoryId}&subcategory_id=${subCategoryId}&search=${searhValue}`
        )
        setNearestBranchProduct(response.data.result.rows)
        setCount(response.data.result.count)
      } else {
        const response = await axios.get(
          `products/all?page=1&sortBy=${sort}&sortOrder=${order}&limit=${pageLimit}&branch_id=${branch_id}&category_id=${categoryId}&subcategory_id=${subCategoryId}&search=`
        )
        setNearestBranchProduct(response.data.result.rows)
        setCount(response.data.result.count)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchNearestBranch = async () => {
    if (loaded) {
      try {
        const response = await axios.post(`branches/get-nearest?latitude=${coordinates.lat}&longitude=${coordinates.lng}&limit=1`)
        setBranchData(response.data.result[0])
        fetchNearestBranchProduct(response.data.result[0].id)
        setBranchId(response.data.result[0].id)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const fetchMainBranch = async () => {
    try {
      const response = await axios.get('branches/super-store')
      setBranchData(response.data.result)
      fetchNearestBranchProduct(response.data.result.id)
      setBranchId(response.data.result.id)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      fetchNearestBranch()
    } else {
      fetchMainBranch()
    }
  }, [coordinates?.lat, coordinates?.lng, categoryId, subCategoryId, searhValue])

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth

      if (screenWidth < 768) {
        setIsCategoryOpen(false)
      } else {
        setIsCategoryOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getCategory = async () => {
    try {
      const response = await axios.get(`/categories/all?all=true}`)
      setCategoryList(response.data.result.rows)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    getCategory()
  }, [])

  useEffect(() => {
    setCategoryId(params.category_id)
    setSearchValue(params.search)
    setSubCategoryId(0)
  }, [params])

  useEffect(() => {
    fetchNearestBranchProduct(branchId)
  }, [pageLimit, sort, order])

  return (
    <>
      <Navbar />
      <section className="mx-[16px] md:mx-[32px] lg:mx-[80px] xl:mx-[100px]">
        <section className="flex flex-col lg:flex-row lg:gap-[1rem] mb-10">
          {/* Left Side */}
          <div className="">
            {/* Breadcrumb */}
            <div className="flex w-max items-center justify-center gap-1.5 rounded-lg bg-none pl-1 text-[14px] font-medium text-gray-500 my-2 lg:my-3">
              <Link to={'/home'} className="cursor-pointer hover:underline hover:text-[#858585] underline-offset-2">
                Home
              </Link>
              <div className="flex items-center pt-[0.1rem]">
                <svg width="6" height="10" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 11.5L6.5 6.5L1.5 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="">Product Catalogue</span>
            </div>
            <section className="flex flex-col border border-[#D1D5D8] lg:border-[#e4e4e4] rounded-xl pb-3 lg:pb-4 h-max">
              {/* Branch Info */}
              <section className="hidden lg:flex gap-[0.8rem] justify-between items-center w-max pl-[1.3rem] pr-[1rem] pb-4 pt-5 ">
                <div className="flex flex-col flex-wrap">
                  <span className="text-[14px] font-medium text-[#939393] tracking-tight">Shopping from:</span>
                  <span className="text-[14.5px] font-semibold text-[#343538] w-[7.5rem] line-clamp-2 tracking-tight">{branchData?.name}</span>
                </div>
                <div className="rounded-full bg-[#E1F5EF] px-[0.7rem] py-[0.55rem]">
                  {branchData?.distance ? (
                    <span className="text-[14px] font-semibold text-[#00A67C]">{formatDistance(branchData?.distance)}</span>
                  ) : (
                    <svg
                      // width="32"
                      // height="32"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-[1.6rem]">
                      <path
                        d="M16.6667 5.49992H3.33333V3.83325H16.6667V5.49992ZM10.8333 13.4166C10.8333 14.3666 11.1917 15.3833 11.6667 16.3333V17.1666H3.33333V12.1666H2.5V10.4999L3.33333 6.33325H16.6667L17.25 9.24992C16.6667 8.98325 16.0667 8.83325 15.4167 8.83325C12.9167 8.83325 10.8333 10.9166 10.8333 13.4166ZM10 12.1666H5V15.4999H10V12.1666ZM18.3333 13.4166C18.3333 15.5833 15.4167 18.8333 15.4167 18.8333C15.4167 18.8333 12.5 15.5833 12.5 13.4166C12.5 11.8333 13.8333 10.4999 15.4167 10.4999C17 10.4999 18.3333 11.8333 18.3333 13.4166ZM16.4167 13.4999C16.4167 12.9999 15.9167 12.4999 15.4167 12.4999C14.9167 12.4999 14.4167 12.9166 14.4167 13.4999C14.4167 13.9999 14.8333 14.4999 15.4167 14.4999C16 14.4999 16.5 13.9999 16.4167 13.4999Z"
                        fill="#00A67C"
                      />
                    </svg>
                  )}
                </div>
                {/* {coordinates?.lat && ( */}
              </section>
              {/* Category */}
              <section className="flex flex-col text-[#343538] px-[0.5rem] text-[15px]">
                <div
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex justify-between items-center pt-3 lg:border-t lg:border-[#e4e4e4] cursor-pointer lg:cursor-default">
                  <h4
                    className="font-semibold lg:underline underline-offset-2 mx-[0.8rem] cursor-pointer"
                    onClick={() => {
                      setSearchValue('')
                      setCategoryId(0)
                      setSubCategoryId(0)
                    }}>
                    All Category
                  </h4>
                  <div className="lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#bbc0c5"
                        d="M9 5a1 1 0 1 0 0 2a1 1 0 0 0 0-2M6.17 5a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 0 1 0-2zM15 11a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2zM9 17a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2z"
                      />
                    </svg>
                  </div>
                </div>
                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 0, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 0, height: 0 }}
                      transition={{
                        type: 'spring',
                        bounce: 0,
                        duration: 0.7
                      }}
                      className="">
                      {categoryList.map((item, index) => (
                        <>
                          <div key={index} className="flex flex-col first:pt-2">
                            <div
                              className={`${
                                selectedCategory === item.name ? 'bg-[#F0FAF7]' : 'bg-transparent'
                              } flex justify-between items-center px-[0.8rem] w-full rounded-lg hover:bg-[#F0FAF7] group`}>
                              <h5
                                className={`${
                                  selectedCategory === item.name ? 'text-[#009771]' : 'text-gray-700 '
                                } w-full font-medium py-[0.45rem]  group-hover:text-[#009771]  cursor-pointer transition ease-in-out delay-100`}
                                onClick={() => {
                                  setSelectedCategory((prev) => (prev === item.name ? null : item.name))
                                  setCategoryId(item.id)
                                  setSearchValue('')
                                  setSubCategoryId(0)
                                }}>
                                {item.name}
                              </h5>
                              {selectedCategory === item.name && (
                                <motion.svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 17 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mt-[0.2rem]"
                                  animate={{
                                    rotate: setSelectedCategory ? 180 : 0
                                  }}
                                  transition={{ duration: 0.3 }}>
                                  <path
                                    d="M13.8106 5.65892L8.50019 10.8354L3.18981 5.65892C3.09493 5.56625 2.96757 5.51437 2.83494 5.51437C2.70231 5.51437 2.57494 5.56625 2.48006 5.65892C2.43412 5.70394 2.39763 5.75766 2.37271 5.81696C2.34779 5.87625 2.33496 5.93992 2.33496 6.00424C2.33496 6.06855 2.34779 6.13222 2.37271 6.19152C2.39763 6.25081 2.43412 6.30454 2.48006 6.34955L8.12937 11.8575C8.22858 11.9543 8.36165 12.0084 8.50019 12.0084C8.63873 12.0084 8.77179 11.9543 8.871 11.8575L14.5203 6.35061C14.5666 6.30557 14.6033 6.25171 14.6285 6.19222C14.6536 6.13273 14.6665 6.06881 14.6665 6.00424C14.6665 5.93966 14.6536 5.87575 14.6285 5.81626C14.6033 5.75677 14.5666 5.70291 14.5203 5.65786C14.4254 5.56519 14.2981 5.51331 14.1654 5.51331C14.0328 5.51331 13.9054 5.56519 13.8106 5.65786V5.65892Z"
                                    fill="#009771"
                                  />
                                </motion.svg>
                              )}
                            </div>
                            <AnimatePresence>
                              {selectedCategory === item.name && (
                                <motion.div
                                  initial={{ opacity: 0, y: 0, height: 0 }}
                                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                                  exit={{ opacity: 0, y: 0, height: 0 }}
                                  transition={{
                                    type: 'spring',
                                    bounce: 0,
                                    duration: 0.7
                                  }}
                                  className="">
                                  {item.SubCategories?.map((sub, index) => (
                                    <div
                                      key={index}
                                      className="first:mt-1 last:mb-1 py-[0.3rem] px-[1.8rem] text-[#009771] font-medium cursor-pointer hover:bg-[#F0FAF7]"
                                      onClick={() => {
                                        setSubCategoryId(sub.id)
                                        setSearchValue('')
                                        setCategoryId(0)
                                      }}>
                                      {sub.name}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </section>
          </div>
          {/* ---------- Right Side ---------- */}
          <section className="lg:mt-3 w-full">
            {/* Title & Filters */}
            <section className="flex flex-col w-full">
              <div className="order-last lg:order-first mb-4 lg:mb-0 flex items-end tracking-tight gap-[0.7rem]">
                <span className="text-[#939393] font-medium mb-[0.2rem]">{count} results</span>
              </div>
              {/* Filter & Sort */}
              <div className="flex w-full my-2 lg:my-3">
                <section className="no-scrollbar w-full flex justify-between items-center gap-[0.3rem] lg:gap-0">
                  {/* <div className="flex gap-[0.3rem] order-last lg:order-first overflow-auto no-scrollbar">
                                        <div className="group flex gap-1 h-max items-center rounded-full py-[0.45rem] px-3.5 border border-[#D1D5D8] cursor-pointer hover:bg-[#343538] hover:border-[#343538] transition ease-in-out delay-75">
                                            <span className="text-gray-600 text-[14px] group-hover:text-white font-medium ">
                                                Discount
                                            </span>
                                        </div>
                                        <div className="group flex gap-1 items-center rounded-full py-[0.45rem] px-3.5 border border-[#D1D5D8] cursor-pointer hover:bg-[#343538] hover:border-[#343538] transition ease-in-out delay-75">
                                            <span className="text-gray-600 text-[14px] group-hover:text-white font-medium whitespace-nowrap">
                                                Buy 1, Get 1
                                            </span>
                                        </div>
                                    </div> */}
                  <div className="relative">
                    <div
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="group flex gap-1 items-center rounded-full py-[0.45rem] px-3.5 border border-[#D1D5D8] cursor-pointer hover:bg-[#343538] hover:border-[#caede3] transition ease-in-out delay-75">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" className="fill-[#757575] group-hover:fill-white">
                        <path d="M11.13 12.5415C11.0763 12.6068 11.0087 12.6594 10.9322 12.6955C10.8557 12.7316 10.7721 12.7502 10.6875 12.75C10.6139 12.7504 10.541 12.7361 10.4731 12.7077C10.4052 12.6794 10.3437 12.6376 10.2922 12.585L8.03924 10.329C7.93391 10.2235 7.87474 10.0806 7.87474 9.93151C7.87474 9.78245 7.93391 9.63948 8.03924 9.53401C8.09137 9.48167 8.15331 9.44014 8.22153 9.41181C8.28974 9.38347 8.36288 9.36888 8.43674 9.36888C8.51061 9.36888 8.58375 9.38347 8.65196 9.41181C8.72017 9.44014 8.78212 9.48167 8.83424 9.53401L10.125 10.833V2.81251C10.125 2.66333 10.1843 2.52025 10.2897 2.41476C10.3952 2.30927 10.5383 2.25001 10.6875 2.25001C10.8367 2.25001 10.9798 2.30927 11.0852 2.41476C11.1907 2.52025 11.25 2.66333 11.25 2.81251V10.8255L12.5415 9.53701C12.5936 9.48478 12.6555 9.44335 12.7236 9.41508C12.7918 9.38681 12.8648 9.37226 12.9386 9.37226C13.0124 9.37226 13.0854 9.38681 13.1536 9.41508C13.2217 9.44335 13.2836 9.48478 13.3357 9.53701C13.4411 9.64248 13.5002 9.78545 13.5002 9.93451C13.5002 10.0836 13.4411 10.2265 13.3357 10.332L11.1292 12.5415H11.13ZM4.75499 2.45851C4.70126 2.39317 4.6337 2.34058 4.55718 2.30452C4.48066 2.26847 4.39708 2.24985 4.31249 2.25001C4.23891 2.24958 4.16599 2.26397 4.09809 2.29232C4.03018 2.32066 3.96868 2.36239 3.91724 2.41501L1.66499 4.67101C1.55966 4.77648 1.50049 4.91945 1.50049 5.06851C1.50049 5.21757 1.55966 5.36054 1.66499 5.46601C1.71712 5.51835 1.77906 5.55988 1.84728 5.58821C1.91549 5.61655 1.98863 5.63114 2.06249 5.63114C2.13636 5.63114 2.2095 5.61655 2.27771 5.58821C2.34592 5.55988 2.40787 5.51835 2.45999 5.46601L3.74999 4.16776V12.1875C3.74999 12.3367 3.80926 12.4798 3.91475 12.5853C4.02023 12.6907 4.16331 12.75 4.31249 12.75C4.46168 12.75 4.60475 12.6907 4.71024 12.5853C4.81573 12.4798 4.87499 12.3367 4.87499 12.1875V4.17451L6.16649 5.46301C6.2186 5.51523 6.2805 5.55667 6.34865 5.58494C6.41679 5.61321 6.48984 5.62776 6.56362 5.62776C6.63739 5.62776 6.71045 5.61321 6.77859 5.58494C6.84673 5.55667 6.90863 5.51523 6.96074 5.46301C7.06608 5.35754 7.12525 5.21457 7.12525 5.06551C7.12525 4.91645 7.06608 4.77348 6.96074 4.66801L4.75424 2.45776L4.75499 2.45851Z" />
                      </svg>
                      <span className="pl-0.5 whitespace-pre text-gray-600 text-[14.5px] font-medium group-hover:text-white">Sort by Relevance</span>
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        className="fill-[#343538] group-hover:fill-white"
                        animate={{ rotate: isSortOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}>
                        <path d="M11.3733 4.6602L7.0001 8.9232L2.62685 4.6602C2.54871 4.58389 2.44382 4.54116 2.3346 4.54116C2.22537 4.54116 2.12048 4.58389 2.04235 4.6602C2.00451 4.69727 1.97446 4.74152 1.95394 4.79035C1.93342 4.83918 1.92285 4.89161 1.92285 4.94458C1.92285 4.99755 1.93342 5.04998 1.95394 5.09881C1.97446 5.14764 2.00451 5.19189 2.04235 5.22895L6.69472 9.76495C6.77642 9.84459 6.886 9.88916 7.0001 9.88916C7.11419 9.88916 7.22377 9.84459 7.30547 9.76495L11.9578 5.22983C11.9959 5.19273 12.0262 5.14838 12.0469 5.09939C12.0676 5.05039 12.0782 4.99776 12.0782 4.94458C12.0782 4.8914 12.0676 4.83876 12.0469 4.78977C12.0262 4.74078 11.9959 4.69643 11.9578 4.65933C11.8797 4.58301 11.7748 4.54028 11.6656 4.54028C11.5564 4.54028 11.4515 4.58301 11.3733 4.65933V4.6602Z" />
                      </motion.svg>
                    </div>
                    {/* filter drawer */}
                    <AnimatePresence>
                      {isSortOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 0, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 168 }}
                          exit={{ opacity: 0, y: 0, height: 0 }}
                          transition={{
                            type: 'spring',
                            bounce: 0,
                            duration: 0.7
                          }}
                          className="w-full flex flex-col absolute mt-2 bg-white py-2.5 rounded-xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                          {filterItems.map((item, index) => (
                            <motion.span
                              key={index}
                              className="w-full text-gray-600 text-[14.5px] font-medium py-1 px-5 hover:bg-gray-100 cursor-pointer transition ease-in-out delay-100 hover:text-gray-700"
                              onClick={() => {
                                handleFilter(item.sort, item.order)
                              }}>
                              {item.title}
                            </motion.span>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </section>
              </div>
            </section>
            {/* Product Cards  */}
            <ProductCatalogueData product={nearestBranchProduct} branchId={branchId} handlePageLimit={handlePageLimit} />
          </section>
        </section>
      </section>
      <Footer />
    </>
  )
}
