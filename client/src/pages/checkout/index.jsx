/* eslint-disable no-unused-vars */
import { FaArrowRight } from 'react-icons/fa6'
import { IoMdArrowBack } from 'react-icons/io'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

import { AddressDelivery } from './component/addressDelivery'
import appLogo from '../../assets/logo-app-1.png'
import { OrderSummary } from './component/orderSummary'
import axios from '../../api/axios'
import { convertToIDR } from '../../functions/functions'

export const CheckoutPage = () => {
  const navigate = useNavigate()
  const carts = useSelector((state) => state.cart.data)
  const products = useSelector((state) => state.product.data)
  const orderId = useSelector((state) => state.cart.order_id)

  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [productImage, setProductImage] = useState()
  const customer = useSelector((state) => state.customer.value)
  const total = carts.reduce((total, item) => total + item.price * item.quantity, 0)
  const [discount, setDiscount] = useState(0)

  const handleDiscount = (cart) => {
    cart?.map((item) => {
      const product = products.find((product) => product.ProductId === item.id)

      let temp_discount = 0
      let i = 1
      if (product.hasDiscount) {
        while (temp_discount < product.Discounts[0].max_discount && i <= item.quantity) {
          const discountAmount = product?.Discounts[0].difference
          if (temp_discount + discountAmount <= product.Discounts[0].max_discount) {
            setDiscount((prevTotalDiscount) => prevTotalDiscount + discountAmount)
            temp_discount += discountAmount
            i++
          } else {
            break
          }
        }
        temp_discount = 0
      }
    })
  }

  const [selectedDeliveryCost, setSelectedDeliveryCost] = useState(0)

  const handleDeliveryCostChange = (cost) => {
    setSelectedDeliveryCost(cost)
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
    getProductImages()
    handleDiscount(carts)
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js'

    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY

    const script = document.createElement('script')
    script.src = snapScript
    script.setAttribute('data-client-key', clientKey)
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleCheckout = async () => {
    try {
      const data = {
        id: orderId,
        total: total + selectedDeliveryCost - discount
      }

      const response = await axios.patch('/order', data)
      // console.log(response);
      window.snap.pay(response.data.token)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {/* <Navbar /> */}
      <div className="bg-white flex justify-between items-center px-[18px] lg:px-[160px] py-3 border-b border-[#E4E4E4]">
        <img src={appLogo} alt="" className="h-[28px] lg:h-[35px] "></img>
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap font-medium text-[#343538] mr-1">{customer?.firstname}</span>
          {customer.profile_picture ? (
            <img src={customer.profile_picture} className="object-cover h-9 w-9 rounded-full"></img>
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
        </div>
      </div>
      <div className="bg-[#F8F8FA]">
        <section className="mx-[16px] md:mx-[32px] lg:mx-[160px] py-2 lg:py-3.5">
          <div className="flex flex-col pb-2 lg:pb-3 gap-[0.2rem] lg:gap-1">
            <div onClick={() => navigate('/')} id="underline-wrapper" className="text-gray-600 flex items-center gap-2 w-max cursor-pointer hover:text-gray-700 relative">
              <IoMdArrowBack className="h-[0.8rem] w-[0.8rem] lg:h-[1rem] lg:w-[1rem]" />
              <span className="font-medium text-[13px] lg:text-[14px] relative">
                Go back
                <span id="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700 transition-all origin-left transform scale-x-0"></span>
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                <g fill="none" stroke="#00a67c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M11.5 21H8.574a3 3 0 0 1-2.965-2.544l-1.255-8.152A2 2 0 0 1 6.331 8H17.67a2 2 0 0 1 1.977 2.304l-.5 3.248" />
                  <path d="M9 11V6a3 3 0 0 1 6 0v5m0 8l2 2l4-4" />
                </g>
              </svg>
              <h2 className="text-[25px] font-bold text-[#00A67C]">Checkout</h2>
            </div>
          </div>
          {/* Grid */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* -- Left -- */}
            <section className="flex flex-col gap-3 w-full lg:w-[47vw]">
              {/* Order Summary */}
              <OrderSummary products={products} carts={carts} productImage={productImage} total={total} convertToIDR={convertToIDR} />
              {/* Address & Delivery */}
              <AddressDelivery handleDeliveryCostChange={handleDeliveryCostChange} />
              {/* Payment Method */}
              <section className="rounded-xl bg-[#FFFFFF] py-5 px-4 md:px-7 shadow-sm mb-[4rem] lg:mb-0">
                <h3 className="text-[20px] font-bold border-b border-[#dcdcdc] text-[#28302A] pb-[0.6rem]">Payment Method</h3>
                <div className="mt-2">
                  <fieldset className="space-y-3">
                    <legend className="sr-only">Delivery</legend>

                    <div>
                      <input type="radio" name="DeliveryOption" value="DeliveryStandard" id="DeliveryStandard" className="peer hidden [&:checked_+_label_svg]:block" />

                      <label
                        htmlFor="DeliveryStandard"
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 bg-white p-4 font-medium shadow-sm hover:border-gray-200  peer-checked:ring-1 peer-checked:ring-[#00A67C]">
                        <div className="flex items-center gap-2">
                          <svg className="hidden h-5 w-5 text-[#00A67C]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>

                          <p className="text-gray-700 text-[14px]">Midtrans</p>
                        </div>
                      </label>
                    </div>

                    <div>
                      <input type="radio" name="DeliveryOption" value="DeliveryPriority" id="DeliveryPriority" className="peer hidden [&:checked_+_label_svg]:block" />

                      <label
                        htmlFor="DeliveryPriority"
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 font-medium shadow-sm hover:border-gray-300 peer-checked:ring-1 peer-checked:ring-[#00A67C]">
                        <div className="flex items-center gap-2">
                          <svg className="hidden h-5 w-5 text-[#00A67C]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-gray-700 text-[14px]">Manual Payment</p>
                        </div>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </section>
            </section>
            {/* -- Right -- */}
            <section className="hidden lg:block flex-1 ">
              <div className="">
                <section className={`rounded-xl bg-[#FFFFFF] py-5 px-5 md:px-6 shadow-sm h-max`}>
                  <h3 className="text-[20px] font-semibold border-b border-gray-300 text-[#28302A] pb-[0.6rem]">Payment Details</h3>
                  <div className="flex flex-col gap-2 mb-[1rem] mt-[1.4rem]">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-600">Subtotal</h4>
                      <h4 className="font-semibold tracking-tight text-gray-900">{convertToIDR(total)}</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-600">Delivery</h4>
                      <h4 className="font-semibold tracking-tight text-gray-900">{convertToIDR(selectedDeliveryCost)}</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-[#4eb197]">Discount</h4>
                      <h4 className="font-semibold tracking-tight text-[#4eb197]">{discount ? `- ${convertToIDR(discount)}` : discount}</h4>
                    </div>
                  </div>
                  <div className="border-t border-[#dcdcdc] flex items-center justify-between pt-[1rem]">
                    <h4 className="font-semibold text-[18px]">Total</h4>
                    <h4 className="font-bold text-[18px]">Rp{convertToIDR(total + selectedDeliveryCost - discount)}</h4>
                  </div>
                  <button
                    onClick={() => handleCheckout()}
                    className="flex items-center justify-center gap-2 mt-[1.2rem] px-4 rounded-lg w-full bg-[#00A67C] font-semibold text-white py-[0.6rem] text-[15px] hover:bg-[#00916D] transition ease-in-out delay-100">
                    <span>Pay Now</span>
                    {/* <img src={arrowLong} alt="" className="mt-[0.1rem]" /> */}
                    <FaArrowRight className="mt-[0.1rem]" />
                  </button>
                </section>
                <p className="text-[14px] mt-[0.6rem] text-gray-500 font-medium tracking-tight text-justify px-2">
                  By completing your purchase, you are agreeing to our application&apos;s Terms and Conditions.
                </p>
              </div>
            </section>
            {/* --------------- Checkout Mobile ---------------- */}
            {/* bg-[#00765f] */}
            <section
              onClick={() => setIsPaymentOpen(!isPaymentOpen)}
              className="fixed bottom-0 left-0 right-0 bottom lg:hidden rounded-t-2xl bg-[#00765f] cursor-pointer z-30 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
              <div className="flex justify-between px-[20px] md:px-[40px] text-white py-3">
                <div className="flex gap-2.5 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // width="16"
                    // height="16"
                    viewBox="0 0 16 16"
                    className="h-[1.3rem]">
                    <path
                      fill="white"
                      d="M3.5 3A2.5 2.5 0 0 0 1 5.5V6h14v-.5A2.5 2.5 0 0 0 12.5 3zM15 7H1v3.5A2.5 2.5 0 0 0 3.5 13h9a2.5 2.5 0 0 0 2.5-2.5zm-4.5 3h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1"
                    />
                  </svg>
                  <div className="flex gap-[0.5rem]">
                    <span className="text-[17px] font-medium">Total:</span>
                    <span className="text-[16.5px] font-normal">{convertToIDR(total + selectedDeliveryCost - discount)}</span>
                  </div>
                </div>
                <div className="flex justify-center items-center text-white">
                  <motion.svg
                    width="38"
                    height="10"
                    viewBox="0 0 40 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ rotate: isPaymentOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[0.48rem]">
                    <path d="M2 9L20 2" stroke="#F6F7F8" strokeWidth="3" strokeLinecap="round" />
                    <path d="M20 2L38 9" stroke="#F6F7F8" strokeWidth="3" strokeLinecap="round" />
                  </motion.svg>
                </div>
              </div>
            </section>
            <AnimatePresence>
              {isPaymentOpen && (
                <motion.section
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -160 }}
                  exit={{ opacity: 0, y: 160 }}
                  transition={{ duration: 0.3 }}
                  className="fixed z-30 w-[95vw] md:w-[80vw] right-[2.5vw] md:right-[10vw] bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-2xl py-5 px-5 -translate-y-1/2 top-1/2">
                  <div className="flex justify-between items-center h-max border-b border-gray-300  pb-[0.6rem]">
                    <h3 className="text-[20px] font-semibold text-[#28302A]">Payment Details</h3>
                    <div onClick={() => setIsPaymentOpen(false)} className="cursor-pointer rounded-md hover:bg-gray-100 p-1 h-max">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#657385" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mb-[1rem] mt-[1.4rem]">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-600">Subtotal</h4>
                      <h4 className="font-semibold tracking-tight text-gray-900">Rp. {convertToIDR(total)}</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-600">Delivery</h4>
                      <h4 className="font-semibold tracking-tight text-gray-900">{convertToIDR(selectedDeliveryCost)}</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-[#4eb197]">Discount</h4>
                      <h4 className="font-semibold tracking-tight text-[#4eb197]">{discount ? `Rp. - ${convertToIDR(discount)}` : discount}</h4>
                    </div>
                  </div>
                  <div className="border-t border-[#dcdcdc] flex items-center justify-between pt-[1rem]">
                    <h4 className="font-semibold text-[18px]">Total</h4>
                    <h4 className="font-bold text-[18px]">{convertToIDR(total + selectedDeliveryCost - discount)}</h4>
                  </div>
                  <button
                    onClick={() => handleCheckout()}
                    className="flex items-center justify-center gap-2 mt-[1.2rem] px-4 rounded-lg w-full bg-[#00A67C] font-semibold text-white py-[0.6rem] text-[15px] hover:bg-[#00916D] transition ease-in-out delay-100">
                    <span>Pay Now</span>
                    {/* <img src={arrowLong} alt="" className="mt-[0.1rem]" /> */}
                    <FaArrowRight className="mt-[0.1rem]" />
                  </button>
                </motion.section>
              )}
            </AnimatePresence>
            {isPaymentOpen && <div className="fixed top-0 left-0 w-full h-full bg-black opacity-40 z-20"></div>}
          </div>
        </section>
      </div>
    </div>
  )
}
