import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { convertToIDR } from '../../../functions/functions'
import { addToCart, addTotal, removeFromCart, setOrderId, subtractQuantity } from '../../../redux/cartSlice'
import axios from '../../../api/axios'

export const ShoppingCart = ({ isOpenCart, toggleOpenCart }) => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const products = useSelector((state) => state.product.data)

  const carts = useSelector((state) => state.cart.data)
  // console.log(carts);
  const [productImage, setProductImage] = useState()
  // console.log(productImage);

  const total = carts.reduce((total, item) => total + item.price * item.quantity, 0)

  const totalProduct = useSelector((state) => state.cart.totalProduct)
  const dispatch = useDispatch()

  dispatch(addTotal(carts.reduce((total, item) => total + item.quantity, 0)))

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
  }, [carts])

  const addQty = (item) => {
    // console.log(item);
    dispatch(
      addToCart({
        id: item.id,
        quantity: 1,
        price: item.price,
        name: item.name
      })
    )
  }

  const handleSubtractQuantity = (product, item) => {
    if (item.quantity === 1) {
      dispatch(subtractQuantity({ id: product.id, quantity: 1 }))
      toast.success(`${product.name} has been removed from cart`, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'light',
        autoClose: 3000
      })
    } else {
      dispatch(subtractQuantity({ id: product.id, quantity: 1 }))
    }
  }

  const handleRemoveProduct = (product) => {
    dispatch(removeFromCart({ id: product.id }))
    toast.success(`${product.name} has been removed from cart`, {
      position: 'top-center',
      hideProgressBar: true,
      theme: 'light',
      autoClose: 3000
    })
  }

  const handleCheckout = async (data) => {
    try {
      // alert('checkout');

      const response = await axios.post(
        '/order',
        {
          id: ~~(Math.random() * 100) + 1,
          products: data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response)
      console.log(response.data.result[0].OrderId)
      dispatch(setOrderId(response.data.result[0].OrderId))
      // alert('checkout');
      navigate('/checkout')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AnimatePresence>
      {isOpenCart && (
        <>
          {/* background dark blur */}
          <div onClick={toggleOpenCart} className="fixed top-0 left-0 w-full h-full bg-black opacity-40 z-40"></div>
          ~~``
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="z-50 absolute right-0 top-0 h-screen shadow-md w-[95vw] md:w-[52vw] lg:w-[26rem]">
            <div className="relative flex flex-col bg-white w-full">
              <div className={`w-[95vw] md:w-[52vw] lg:w-[26rem] fixed bg-white`}>
                <div className="flex  justify-between items-center border-b border-[#D9D9D9] px-[1.4rem] py-[0.7rem]">
                  <div className="flex gap-2.5 items-center">
                    <span className="text-[18px] font-semibold text-[#343538] whitespace-pre">My Cart</span>
                    <div className="flex items-center rounded-full bg-[#00A67C] px-[1rem] py-[0.2rem]">
                      <span className="text-white font-medium">{totalProduct ? totalProduct : 0}</span>
                    </div>
                  </div>
                  <div className="cursor-pointer rounded-lg p-2 hover:bg-gray-200" onClick={toggleOpenCart}>
                    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17.5638 2.06405C17.6707 1.95728 17.7555 1.83051 17.8134 1.69096C17.8713 1.55142 17.9012 1.40183 17.9013 1.25075C17.9014 1.09967 17.8717 0.950053 17.814 0.810437C17.7562 0.670821 17.6716 0.543943 17.5648 0.437047C17.458 0.330151 17.3313 0.24533 17.1917 0.187428C17.0522 0.129527 16.9026 0.099677 16.7515 0.0995841C16.6004 0.0994912 16.4508 0.129157 16.3112 0.186887C16.1716 0.244618 16.0447 0.329282 15.9378 0.436047L8.9998 7.37405L2.0638 0.436047C1.84792 0.22016 1.55511 0.098877 1.2498 0.098877C0.944493 0.098877 0.651689 0.22016 0.435802 0.436047C0.219916 0.651933 0.0986328 0.944738 0.0986328 1.25005C0.0986328 1.55536 0.219916 1.84816 0.435802 2.06405L7.3738 9.00005L0.435802 15.936C0.328906 16.0429 0.244112 16.1698 0.18626 16.3095C0.128409 16.4492 0.0986328 16.5989 0.0986328 16.75C0.0986328 16.9012 0.128409 17.0509 0.18626 17.1906C0.244112 17.3302 0.328906 17.4571 0.435802 17.564C0.651689 17.7799 0.944493 17.9012 1.2498 17.9012C1.40098 17.9012 1.55067 17.8714 1.69034 17.8136C1.83 17.7557 1.95691 17.6709 2.0638 17.564L8.9998 10.626L15.9378 17.564C16.1537 17.7797 16.4464 17.9007 16.7515 17.9005C17.0566 17.9003 17.3492 17.7789 17.5648 17.563C17.7804 17.3472 17.9015 17.0545 17.9013 16.7493C17.9011 16.4442 17.7797 16.1517 17.5638 15.936L10.6258 9.00005L17.5638 2.06405Z"
                        fill="#343538"
                      />
                    </svg>
                  </div>
                </div>
                {/* Product List */}
                <div
                  className="shadow-inner flex flex-col px-[1.4rem] divide-y-[1px] divide-[#E4E4E4] overflow-y-auto h-[85vh] md:h-[89vh] lg:h-[85vh] pb-[2.5rem] lg:pb-[3.2rem]"
                  id="shopping-cart-scroll">
                  {carts?.map((item) => {
                    const product = products.find((product) => product?.ProductId === item.id)
                    const prodImage = productImage.find((prod) => prod?.ProductId === item.id)

                    return (
                      <div className="flex justify-start items-center gap-4 py-[0.8rem]" key={product?.ProductId}>
                        <div className="flex shrink-0 h-max items-center">
                          <img
                            src={prodImage?.image ? prodImage.image : 'https://www.pngkey.com/png/detail/233-2332677_ega-png.png'}
                            alt={product.Product?.name}
                            className="h-[6.5rem] w-[6rem] object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[14px] font-medium">Rp. {convertToIDR(product.Product?.price)}</span>
                          <span className="text-[14px] font-medium text-gray-700 cursor-pointer hover:underline hover:text-black transition delay-50 ease-in-out line-clamp-2">
                            {product.Product?.name}
                          </span>
                          <div className="mt-1 flex items-center">
                            <div
                              className="mr-3 rounded-full border border-[#B2B2B2] h-[1.8rem] w-[1.8rem] flex items-center justify-center hover:bg-[#00A67C] group cursor-pointer transition delay-50 ease-in-out hover:border-[#00A67C]"
                              onClick={() => handleSubtractQuantity(product?.Product, item)}>
                              <MinusIcon className=" text-gray-900 group-hover:text-white w-5 h-5" />
                            </div>
                            <p className="text-[16px]">{item.quantity}</p>
                            <div
                              onClick={() => addQty(product?.Product)}
                              className="mx-3 rounded-full border border-[#B2B2B2] h-[1.8rem] w-[1.8rem] flex items-center justify-center hover:bg-[#00A67C] group cursor-pointer transition delay-50 ease-in-out hover:border-[#00A67C]">
                              <PlusIcon className="text-gray-900 group-hover:text-white w-4 h-4" />
                            </div>
                            <div className="text-[14px]  text-gray-600 cursor-pointer hover:text-[#00A67C]" onClick={() => handleRemoveProduct(product?.Product)}>
                              <p>Remove</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Checkout */}
              <div className="rounded-t-xl border-t border-[#D9D9D9] px-[1.4rem] py-[0.7rem] fixed bottom-0 bg-white w-[95vw] md:w-[52vw] lg:w-[26rem]">
                <div className="flex flex-col gap-2.5">
                  <div className="justify-between flex items-center px-1">
                    <span className="font-medium text-gray-800">Total</span>
                    <span className="font-bold text-[#343538] text-[17px]">Rp. {convertToIDR(total)}</span>
                  </div>
                  <div className="">
                    <button
                      // disabled={true}
                      onClick={() => handleCheckout(carts)}
                      className="cssbuttons-io-button w-full font-semibold">
                      Go to Checkout
                      <div className="icon">
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

ShoppingCart.propTypes = {
  isOpenCart: PropTypes.bool.isRequired,
  toggleOpenCart: PropTypes.func.isRequired
}
