/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { convertToIDR } from '../../../functions/functions'
import stockAvail from '../../../assets/home/stock_avail.svg'
import { addToCart } from '../../../redux/cartSlice'
import axios from '../../../api/axios'

const filterItems = [
  { title: 'Relevance', sort: 'createdAt', order: 'desc' },
  { title: 'Price: Lowest first', sort: 'price', order: 'asc' },
  { title: 'Price: Highest first', sort: 'price', order: 'desc' },
  { title: 'Name: A - Z', sort: 'name', order: 'asc' },
  { title: 'Name: Z - A', sort: 'name', order: 'desc' }
]

export const BrowseProducts = ({ products, categoryList, setCategoryId, branchId, handleFilter, handlePageLimit, productsLength }) => {
  // console.log(products);

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [productImage, setProductImage] = useState()

  const customer = useSelector((state) => state.customer.value)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAddtoCart = (item) => {
    if (Object.keys(customer).length > 0 && customer.isVerified === true) {
      dispatch(
        addToCart({
          id: item.Product?.id,
          name: item.Product?.name,
          price: item.Product?.price,
          quantity: 1
        })
      )

      toast.success(`${item.Product?.name} has been added to cart`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        theme: 'light'
      })
    } else {
      toast.error(
        <>
          <div className="font-semibold text-[#E74C3C]">Oops!</div>
          <div className="text-[15px]">Please Sign in to access this feature</div>
        </>,
        {
          position: 'top-center',
          autoClose: 2000
        }
      )
      setTimeout(() => navigate('/signin'), 3500)
    }
  }

  const getProductImages = async () => {
    try {
      const imagePromises = products.map(async (prod) => {
        const response = await axios.get(`products/images/${prod?.Product?.id}`)
        return response.data.imageProduct
      })
      const images = await Promise.all(imagePromises)
      setProductImage(images)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLinkClick = () => {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    getProductImages()
  }, [products])

  return (
    <>
      <div className="my-[16px] mx-[16px] md:mx-[32px] lg:mx-[160px] lg:my-[2rem]">
        <section>
          <div className="flex justify-between">
            <h2 className="text-[25px] md:text-[29px] font-semibold text-gray-900 tracking-tight">Browse Our Products</h2>
            <div>{/* view all */}</div>
          </div>
          {/* Category */}
          <div className="relative group">
            <div className="no-scrollbar flex overflow-auto mt-4 mb-3 gap-2">
              {categoryList?.map((item) => (
                <>
                  <div
                    key={item.id}
                    className="text-gray-700 rounded-full py-[0.4rem] hover:text-white px-4 bg-[#F6F7F8] border border-gray-150 cursor-pointer hover:bg-[#28302A] hover:border-[#28302A] transition ease-in-out delay-100"
                    onClick={() => setCategoryId(item.id)}>
                    <span className="whitespace-pre  text-[15px] font-medium ">{item.name}</span>
                  </div>
                </>
              ))}
            </div>
            {/* Button slider */}
            <div className="absolute -left-7 top-0 hidden group-hover:block ">
              <div className="bg-white rounded-full p-2 border border-gray-300 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#616161" className="h-5 w-5 rtl:rotate-180">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </div>
            </div>
            <div className="absolute -right-7 top-0 hidden group-hover:block ">
              <div className="bg-white rounded-full p-2 border border-gray-300 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#616161" className="h-5 w-5 rotate-180">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
          {/* Filter & Sort */}
          <section className="w-full flex justify-between mb-4">
            <div className="relative ml-auto">
              <div
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="group flex gap-1 items-center rounded-full py-[0.45rem] z-20 hover:text-white px-3.5 border border-[#D1D5D8] cursor-pointer hover:bg-[#F0FAF7] hover:border-[#caede3] transition ease-in-out delay-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" className="fill-[#757575] group-hover:fill-[#3A826E]">
                  <path d="M11.13 12.5415C11.0763 12.6068 11.0087 12.6594 10.9322 12.6955C10.8557 12.7316 10.7721 12.7502 10.6875 12.75C10.6139 12.7504 10.541 12.7361 10.4731 12.7077C10.4052 12.6794 10.3437 12.6376 10.2922 12.585L8.03924 10.329C7.93391 10.2235 7.87474 10.0806 7.87474 9.93151C7.87474 9.78245 7.93391 9.63948 8.03924 9.53401C8.09137 9.48167 8.15331 9.44014 8.22153 9.41181C8.28974 9.38347 8.36288 9.36888 8.43674 9.36888C8.51061 9.36888 8.58375 9.38347 8.65196 9.41181C8.72017 9.44014 8.78212 9.48167 8.83424 9.53401L10.125 10.833V2.81251C10.125 2.66333 10.1843 2.52025 10.2897 2.41476C10.3952 2.30927 10.5383 2.25001 10.6875 2.25001C10.8367 2.25001 10.9798 2.30927 11.0852 2.41476C11.1907 2.52025 11.25 2.66333 11.25 2.81251V10.8255L12.5415 9.53701C12.5936 9.48478 12.6555 9.44335 12.7236 9.41508C12.7918 9.38681 12.8648 9.37226 12.9386 9.37226C13.0124 9.37226 13.0854 9.38681 13.1536 9.41508C13.2217 9.44335 13.2836 9.48478 13.3357 9.53701C13.4411 9.64248 13.5002 9.78545 13.5002 9.93451C13.5002 10.0836 13.4411 10.2265 13.3357 10.332L11.1292 12.5415H11.13ZM4.75499 2.45851C4.70126 2.39317 4.6337 2.34058 4.55718 2.30452C4.48066 2.26847 4.39708 2.24985 4.31249 2.25001C4.23891 2.24958 4.16599 2.26397 4.09809 2.29232C4.03018 2.32066 3.96868 2.36239 3.91724 2.41501L1.66499 4.67101C1.55966 4.77648 1.50049 4.91945 1.50049 5.06851C1.50049 5.21757 1.55966 5.36054 1.66499 5.46601C1.71712 5.51835 1.77906 5.55988 1.84728 5.58821C1.91549 5.61655 1.98863 5.63114 2.06249 5.63114C2.13636 5.63114 2.2095 5.61655 2.27771 5.58821C2.34592 5.55988 2.40787 5.51835 2.45999 5.46601L3.74999 4.16776V12.1875C3.74999 12.3367 3.80926 12.4798 3.91475 12.5853C4.02023 12.6907 4.16331 12.75 4.31249 12.75C4.46168 12.75 4.60475 12.6907 4.71024 12.5853C4.81573 12.4798 4.87499 12.3367 4.87499 12.1875V4.17451L6.16649 5.46301C6.2186 5.51523 6.2805 5.55667 6.34865 5.58494C6.41679 5.61321 6.48984 5.62776 6.56362 5.62776C6.63739 5.62776 6.71045 5.61321 6.77859 5.58494C6.84673 5.55667 6.90863 5.51523 6.96074 5.46301C7.06608 5.35754 7.12525 5.21457 7.12525 5.06551C7.12525 4.91645 7.06608 4.77348 6.96074 4.66801L4.75424 2.45776L4.75499 2.45851Z" />
                </svg>
                <span className="pl-0.5 whitespace-pre text-gray-600 text-[15px] font-medium group-hover:text-[#3A826E]">Sort by Relevance</span>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  className="fill-[#343538] group-hover:fill-[#3A826E] mt-[0.15rem]"
                  animate={{ rotate: isFilterOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}>
                  <path d="M11.3733 4.6602L7.0001 8.9232L2.62685 4.6602C2.54871 4.58389 2.44382 4.54116 2.3346 4.54116C2.22537 4.54116 2.12048 4.58389 2.04235 4.6602C2.00451 4.69727 1.97446 4.74152 1.95394 4.79035C1.93342 4.83918 1.92285 4.89161 1.92285 4.94458C1.92285 4.99755 1.93342 5.04998 1.95394 5.09881C1.97446 5.14764 2.00451 5.19189 2.04235 5.22895L6.69472 9.76495C6.77642 9.84459 6.886 9.88916 7.0001 9.88916C7.11419 9.88916 7.22377 9.84459 7.30547 9.76495L11.9578 5.22983C11.9959 5.19273 12.0262 5.14838 12.0469 5.09939C12.0676 5.05039 12.0782 4.99776 12.0782 4.94458C12.0782 4.8914 12.0676 4.83876 12.0469 4.78977C12.0262 4.74078 11.9959 4.69643 11.9578 4.65933C11.8797 4.58301 11.7748 4.54028 11.6656 4.54028C11.5564 4.54028 11.4515 4.58301 11.3733 4.65933V4.6602Z" />
                </motion.svg>
              </div>
              {/* filter drawer */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, width: 197.215, height: 0 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      width: 197.215,
                      height: 172.5
                    }}
                    exit={{ opacity: 0, y: 0, width: 197.215, height: 0 }}
                    transition={{
                      type: 'spring',
                      bounce: 0,
                      duration: 0.7
                    }}
                    className="w-full flex flex-col absolute mt-2 bg-white py-2.5 rounded-xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                    {filterItems.map((item, index) => (
                      <motion.span
                        key={index}
                        className="text-gray-600 text-[15px] font-medium py-1 px-5 hover:bg-[#F0FAF7] cursor-pointer transition ease-in-out delay-100 hover:text-[#3A826E]"
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
          {/* Card Grid */}
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
            {productsLength?.map((item, index) => (
              <div className="cursor-pointer col-span-1" key={index}>
                <div
                  onClick={(event) => {
                    if (!event.target.closest('button')) {
                      navigate(`/product-detail/${item.Product?.id}/${branchId}`)
                    }
                  }}
                  className="flex h-full flex-col justify-between bg-white p-2 border border-[#D1D5D8] rounded-xl gap-3 hover:border-[#00A67C] transition delay-75 ease-in-out">
                  <div>
                    <img
                      src={productImage[index]?.image ? productImage[index]?.image : 'https://www.pngkey.com/png/detail/233-2332677_ega-png.png'}
                      alt=""
                      className="rounded-lg h-[140px] md:h-[145px] xl:h-[180px] w-full object-cover"
                    />
                  </div>
                  <div className="px-1.5 flex flex-col gap-2">
                    <div className="flex gap-1">
                      <span className="font-bold text-[13px]">Rp</span>
                      {item?.hasDiscount ? (
                        <p className="text-[16px] md:text-[18px] font-bold text-rose-600 tracking-tight">{convertToIDR(item?.discounted_price)}</p>
                      ) : (
                        <p className="text-[16px] md:text-[18px] font-bold text-rose-600 tracking-tight">{convertToIDR(item.original_price)}</p>
                      )}
                      {item?.hasDiscount && <div className="font-semibold text-[#757575] text-[15px] line-through">Rp {item?.original_price}</div>}
                    </div>
                    <p className="leading-relaxed text-gray-900 text-[14px] md:text-[15px] line-clamp-2">{item.Product?.name}</p>

                    <div className="flex gap-1.5 items-center">
                      <img src={stockAvail} alt="" className=" h-3 pt-[0.1rem]" />
                      <span className="text-[#067627] font-medium text-[13px] md:text-[14px]">
                        stock: <span className="text-[13px] md:text-[14px]">{item.stock}</span>{' '}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleAddtoCart(item)} className="mt-1 mb-[0.2rem] w-full rounded-full bg-[#00A67C] text-white py-[0.4rem] text-[14px]">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </section>
          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-[1.4rem] md:mt-[1.8rem]">
            <button
              onClick={handlePageLimit}
              className="text-[#898989] rounded-lg border border-[#E0E0E0] p-1.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-[0.65] transition ease-in-out delay-100 ">
              Load more
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
