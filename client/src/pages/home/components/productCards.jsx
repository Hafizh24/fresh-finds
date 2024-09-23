/* eslint-disable react/prop-types */
import KeenSlider from 'keen-slider'
import 'keen-slider/keen-slider.min.css'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Tooltip } from '@material-tailwind/react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { convertToIDR, formatDistance } from '../../../functions/functions'
import { addToCart } from '../../../redux/cartSlice'
import axios from '../../../api/axios'
import { ModalChangeAddress } from '../../checkout/component/modalChangeAddress'

export const ProductCards = ({ products, branchData, coordinates }) => {
  const token = localStorage.getItem('token')
  const [modalChangeAddressOpen, setModalChangeAddressOpen] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState(null)
  // console.log(deliveryAddress);
  const customer = useSelector((state) => state.customer.value)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [keenSlider, setKeenSlider] = useState(null)
  const sliderRef = useRef(null)
  const [productImage, setProductImage] = useState()

  const fetchDeliveryAddress = async () => {
    try {
      const response = await axios.get('customer-address/delivery-address', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setDeliveryAddress(response.data.result)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddressClick = () => {
    if (token) {
      setModalChangeAddressOpen(!modalChangeAddressOpen)
    } else {
      toast.error(
        <>
          <div className="font-medium text-[#E74C3C]">Oops!</div>
          <div className="text-[15px]">Please sign in</div>
        </>,
        {
          position: 'top-center'
        }
      )
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

  useEffect(() => {
    fetchDeliveryAddress()
    getProductImages()
  }, [products])

  // const fetchProduct = async () => {
  //   try {
  //     const response = await axios.get(`products`);
  //     // setProductImage(response.data?.imageProduct.image)
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const slidePrev = () => {
    if (keenSlider) {
      keenSlider.prev()
    }
  }

  const slideNext = () => {
    if (keenSlider) {
      keenSlider.next()
    }
  }

  useEffect(() => {
    if (sliderRef.current) {
      const slider = new KeenSlider(sliderRef.current, {
        loop: true,
        slides: {
          origin: 'center',
          perView: 1.25,
          spacing: 16
        },
        breakpoints: {
          '(min-width: 0px)': {
            slides: {
              perView: 2,
              spacing: 8
            }
          },
          '(min-width: 640px)': {
            slides: {
              perView: 2,
              spacing: 16
            }
          },
          '(min-width: 768px)': {
            slides: {
              perView: 3.25,
              spacing: 15
            }
          },
          '(min-width: 1024px)': {
            slides: {
              origin: 'auto',
              perView: 4.25,
              spacing: 10
            }
          },
          '(min-width: 1280px)': {
            slides: {
              origin: 'auto',
              perView: 4.5,
              spacing: 22
            }
          }
        }
      })

      setKeenSlider(slider)
    }
  }, [])

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

  return (
    <>
      <div className="my-[16px] mx-[16px] md:mx-[32px] lg:mx-[160px]">
        {/* Shopping From */}
        <div className="flex flex-col md:flex-row w-full items-center justify-center md:justify-between mb-5">
          {/* Branch */}
          <section className="flex gap-[0.7rem] items-center w-max p-1 bg-[#00A67C] rounded-full">
            <div className={`${!coordinates?.lat && 'pulse-effect'} rounded-full p-2 bg-[#E1F5EF]`}>
              <svg width="32" height="32" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.6667 5.49992H3.33333V3.83325H16.6667V5.49992ZM10.8333 13.4166C10.8333 14.3666 11.1917 15.3833 11.6667 16.3333V17.1666H3.33333V12.1666H2.5V10.4999L3.33333 6.33325H16.6667L17.25 9.24992C16.6667 8.98325 16.0667 8.83325 15.4167 8.83325C12.9167 8.83325 10.8333 10.9166 10.8333 13.4166ZM10 12.1666H5V15.4999H10V12.1666ZM18.3333 13.4166C18.3333 15.5833 15.4167 18.8333 15.4167 18.8333C15.4167 18.8333 12.5 15.5833 12.5 13.4166C12.5 11.8333 13.8333 10.4999 15.4167 10.4999C17 10.4999 18.3333 11.8333 18.3333 13.4166ZM16.4167 13.4999C16.4167 12.9999 15.9167 12.4999 15.4167 12.4999C14.9167 12.4999 14.4167 12.9166 14.4167 13.4999C14.4167 13.9999 14.8333 14.4999 15.4167 14.4999C16 14.4999 16.5 13.9999 16.4167 13.4999Z"
                  fill="#00A67C"
                />
              </svg>
            </div>
            <div className={`${!coordinates?.lat && 'mr-[1.2rem]'} flex flex-col text-white`}>
              <span className="text-[14px] font-normal">Shopping from:</span>
              <Tooltip
                content={branchData?.address}
                placement="bottom"
                className="bg-white text-gray-600 border border-blue-gray-50 shadow-xl shadow-black/10 py-[0.4rem] px-[0.6rem]"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: -15 }
                }}>
                <div className="flex items-center gap-[0.3rem] cursor-pointer">
                  <span className="text-[16px] font-medium truncate max-w-[35vw] md:max-w-[10rem]">{branchData?.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mt-[2.4px] h-[1rem] w-[1rem] fill-[#E1F5EF]">
                    <path d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8q0 .425.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m0-8" />
                  </svg>
                </div>
              </Tooltip>
            </div>
            {coordinates?.lat && (
              <div className="pulse-effect rounded-full bg-[#E1F5EF] px-4 py-[0.7rem] ml-[0.5rem]">
                <span className="text-[15px] font-semibold text-[#00A67C] truncate">
                  {formatDistance(branchData?.distance)}
                  <span className="font-medium"> away</span>
                </span>
              </div>
            )}
          </section>
          {/* Address */}
          <section className="relative flex md:flex-col mt-3 md:mt-0 justify-center md:justify-end w-full md:w-max items-start gap-[0.8rem] md:gap-[0.2rem] p-1">
            <div className="text-[16px] text-[#757575] font-medium">Delivery to:</div>
            <div onClick={handleAddressClick} className="flex items-center gap-[0.5rem] cursor-pointer">
              <span className="text-[#00A67C] text-[15.5px] mt-[1px] md:mt-0 md:text-[15px] font-medium underline underline-offset-2">
                {deliveryAddress?.title ? deliveryAddress.title : 'choose address'}
              </span>
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-[0.2rem]"
                animate={{ rotate: modalChangeAddressOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}>
                <path
                  d="M13.8106 5.65892L8.50019 10.8354L3.18981 5.65892C3.09493 5.56625 2.96757 5.51437 2.83494 5.51437C2.70231 5.51437 2.57494 5.56625 2.48006 5.65892C2.43412 5.70394 2.39763 5.75766 2.37271 5.81696C2.34779 5.87625 2.33496 5.93992 2.33496 6.00424C2.33496 6.06855 2.34779 6.13222 2.37271 6.19152C2.39763 6.25081 2.43412 6.30454 2.48006 6.34955L8.12937 11.8575C8.22858 11.9543 8.36165 12.0084 8.50019 12.0084C8.63873 12.0084 8.77179 11.9543 8.871 11.8575L14.5203 6.35061C14.5666 6.30557 14.6033 6.25171 14.6285 6.19222C14.6536 6.13273 14.6665 6.06881 14.6665 6.00424C14.6665 5.93966 14.6536 5.87575 14.6285 5.81626C14.6033 5.75677 14.5666 5.70291 14.5203 5.65786C14.4254 5.56519 14.2981 5.51331 14.1654 5.51331C14.0328 5.51331 13.9054 5.56519 13.8106 5.65786V5.65892Z"
                  fill="#00A67C"
                />
              </motion.svg>
            </div>
          </section>
        </div>
        {/* Cards */}
      </div>
      <ModalChangeAddress
        modalChangeAddressOpen={modalChangeAddressOpen}
        setModalChangeAddressOpen={setModalChangeAddressOpen}
        fetchDeliveryAddress={fetchDeliveryAddress}
      />
    </>
  )
}

ProductCards.propTypes = {
  coordinates: PropTypes.object.isRequired,
  branchData: PropTypes.shape({
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    distance: PropTypes.number
  })
}
