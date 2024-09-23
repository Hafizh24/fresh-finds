/* eslint-disable no-unused-vars */
import { useParams } from 'react-router-dom'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import stockAvail from '../../assets/home/stock_avail.svg'
import { Navbar } from '../navbar'
import { Footer } from '../footer'
import axios from '../../api/axios'
import { addToCart } from '../../redux/cartSlice'
import { setNearestBranchProduct } from '../../redux/productSlice'

export const ProductDetail = () => {
  const params = useParams()
  const [productData, setProductData] = useState()
  const [productImages, setProductImages] = useState()
  const [mainImage, setMainImage] = useState()
  const [productId, setProductId] = useState()

  const handleMainImage = (image) => {
    setMainImage(image)
  }
  const [price, setPrice] = useState()
  const [discountedPrice, setDiscountedPrice] = useState()
  const [quantity, setQuantity] = useState(1)
  const customer = useSelector((state) => state.customer.value)
  const dispatch = useDispatch()

  const handleQuantity = (action) => {
    setQuantity((prevQuantity) => {
      if (action === 'add') {
        return prevQuantity + 1
      } else if (action === 'subtract' && prevQuantity > 1) {
        return prevQuantity - 1
      } else {
        return prevQuantity
      }
    })
  }

  const handleAddtoCart = (item) => {
    if (Object.keys(customer).length > 0 && customer.isVerified === true) {
      dispatch(addToCart({ id: item.Product?.id, name: item.Product?.name, quantity: 1, price: item.Product?.price }))

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
          position: 'top-center'
        }
      )
      // navigate('/signin');
    }
  }

  const getProductBranchById = async () => {
    try {
      const response = await axios.get(`products/branch-product/${params.id}/${params.branch_id}`)
      const resultArray = [response.data.result]
      setProductData(response.data.result)
      dispatch(setNearestBranchProduct(resultArray))
      setPrice(response.data.result.original_price)
      setDiscountedPrice(response.data.result.discounted_price)
    } catch (err) {
      console.error(err)
    }
  }

  const getProductImage = async () => {
    try {
      const response = await axios.get(`products/images-all/${params.id}`)
      setProductImages(response.data?.imageProduct)
      setMainImage(response?.data?.imageProduct[0]?.image)
      setProductId(response?.data?.imageProduct[0]?.ProductId)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getProductBranchById()
    getProductImage()
  }, [])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  })

  return (
    <>
      <Navbar />
      {/* <section className="mx-[16px] md:mx-[32px] lg:mx-[120px]"> */}
      <section className="flex justify-center mx-[16px] md:mx-[64px] lg:mx-[120px]">
        <div className="flex flex-col lg:flex-row my-[1rem] md:my-[1.6rem] lg:my-[2.5rem] gap-[1.25rem] lg:gap-[1.8rem] w-max">
          {/* Left: Img & Desc */}
          <section className="flex flex-col lg:flex-row gap-[1.25rem] lg:gap-[1.25rem] w-full lg:w-max items-center">
            <div className="order-last lg:order-first flex lg:flex-col w-full justify-between lg:justify-evenly items-center h-full gap-[1.4rem]">
              <button>
                <svg
                  // width="16"
                  // height="16"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[1.2rem] w-[1.2rem] mt-[0.2rem] rotate-90 lg:rotate-180">
                  <path
                    d="M13.8106 5.65892L8.50019 10.8354L3.18981 5.65892C3.09493 5.56625 2.96757 5.51437 2.83494 5.51437C2.70231 5.51437 2.57494 5.56625 2.48006 5.65892C2.43412 5.70394 2.39763 5.75766 2.37271 5.81696C2.34779 5.87625 2.33496 5.93992 2.33496 6.00424C2.33496 6.06855 2.34779 6.13222 2.37271 6.19152C2.39763 6.25081 2.43412 6.30454 2.48006 6.34955L8.12937 11.8575C8.22858 11.9543 8.36165 12.0084 8.50019 12.0084C8.63873 12.0084 8.77179 11.9543 8.871 11.8575L14.5203 6.35061C14.5666 6.30557 14.6033 6.25171 14.6285 6.19222C14.6536 6.13273 14.6665 6.06881 14.6665 6.00424C14.6665 5.93966 14.6536 5.87575 14.6285 5.81626C14.6033 5.75677 14.5666 5.70291 14.5203 5.65786C14.4254 5.56519 14.2981 5.51331 14.1654 5.51331C14.0328 5.51331 13.9054 5.56519 13.8106 5.65786V5.65892Z"
                    fill="#8e9096"
                  />
                </svg>
              </button>
              <div className="flex lg:flex-col gap-[1.4rem] ">
                {productImages?.map((item) => (
                  <img
                    onClick={() => handleMainImage(item.image)}
                    key={item.id}
                    src={item.image}
                    className="h-[3.4rem] w-[3.4rem] object-cover rounded-xl border border-[#D1D5D8] cursor-pointer"></img>
                ))}
              </div>
              <button>
                <svg
                  // width="16"
                  // height="16"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[1.2rem] w-[1.2rem] mt-[0.2rem] -rotate-90 lg:rotate-0">
                  <path
                    d="M13.8106 5.65892L8.50019 10.8354L3.18981 5.65892C3.09493 5.56625 2.96757 5.51437 2.83494 5.51437C2.70231 5.51437 2.57494 5.56625 2.48006 5.65892C2.43412 5.70394 2.39763 5.75766 2.37271 5.81696C2.34779 5.87625 2.33496 5.93992 2.33496 6.00424C2.33496 6.06855 2.34779 6.13222 2.37271 6.19152C2.39763 6.25081 2.43412 6.30454 2.48006 6.34955L8.12937 11.8575C8.22858 11.9543 8.36165 12.0084 8.50019 12.0084C8.63873 12.0084 8.77179 11.9543 8.871 11.8575L14.5203 6.35061C14.5666 6.30557 14.6033 6.25171 14.6285 6.19222C14.6536 6.13273 14.6665 6.06881 14.6665 6.00424C14.6665 5.93966 14.6536 5.87575 14.6285 5.81626C14.6033 5.75677 14.5666 5.70291 14.5203 5.65786C14.4254 5.56519 14.2981 5.51331 14.1654 5.51331C14.0328 5.51331 13.9054 5.56519 13.8106 5.65786V5.65892Z"
                    fill="#8e9096"
                  />
                </svg>
              </button>
            </div>
            <div className="relative flex items-center h-full w-full lg:w-max lg:shrink-0">
              <div className="relative w-full">
                <img src={mainImage} alt="" className="rounded-2xl h-[45vh] w-[90vw] md:h-[40vh] md:w-[70vw] lg:h-[50vh] lg:w-[28rem] object-cover" />
                <div className="absolute top-[0.8rem] right-[0.8rem] rounded-full p-[0.45rem] bg-[#F6F7F8] shadow-sm cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // width="1em"
                    // height="1em"
                    viewBox="0 0 24 24"
                    className="h-[1.5rem] w-[1.5rem] fill-[#343538]">
                    <path
                      // fill="currentColor"
                      d="M12.001 4.529a5.998 5.998 0 0 1 8.242.228a6 6 0 0 1 .236 8.236l-8.48 8.492l-8.478-8.492a6 6 0 0 1 8.48-8.464m6.826 1.641a3.998 3.998 0 0 0-5.49-.153l-1.335 1.198l-1.336-1.197a4 4 0 0 0-5.686 5.605L12 18.654l7.02-7.03a4 4 0 0 0-.193-5.454"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </section>
          {/* Right: Pricing */}
          <section className="flex flex-col lg:min-w-[35vw] rounded-3xl py-6 px-[1.6rem] md:px-[2rem] lg:py-8 lg:px-8 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
            {/* Breadcrumb */}
            <div className="flex gap-[0.2rem] font-medium text-[#067627]">
              <span>{productData?.Product?.Category?.name}</span>
              {productData?.Product?.SubCategory?.name && (
                <>
                  <span>/</span>
                  <span>{productData?.Product?.SubCategory?.name}</span>
                </>
              )}
            </div>
            {/* Title */}
            <h2 className="mt-3 text-[24px] lg:text-[27px] font-semibold tracking-tight max-w-2xl">{productData?.Product?.name}</h2>
            <div className="flex flex-col gap-[0.5rem] mt-[1.2rem]">
              <div className="flex items-center gap-[0.5rem]">
                {productData?.hasDiscount && (
                  <div className="mr-[0.5rem] rounded-lg bg-[#FFDC23] px-[0.75rem] py-[0.2rem] w-max font-semibold text-[13.5px] text-[#28302A]">
                    {productData?.percentage}
                  </div>
                )}
                {productData?.hasDiscount ? (
                  <div className="font-bold text-[#28302A] text-[19px]">Rp {discountedPrice}</div>
                ) : (
                  <div className="font-bold text-[#28302A] text-[19px]">Rp {price}</div>
                )}
                {productData?.hasDiscount && <div className="font-semibold text-[#757575] text-[15px] line-through">Rp {price}</div>}
              </div>
              {productData?.Discounts[0]?.type === 'minimum_purchase' && (
                <div className="mr-[0.5rem] rounded-lg bg-[#FFDC23] px-[0.75rem] py-[0.2rem] font-medium text-[13.5px] text-[#28302A]">
                  Minimum purchase of {productData?.Discounts[0]?.min_purchase_amount} items with a maximum discount of Rp.
                  {productData?.Discounts[0]?.max_discount}
                </div>
              )}
              <span className="text-[#757575] font-medium">{productData?.Product?.weight}gr</span>
            </div>
            <div className="flex gap-2 items-center mt-[0.8rem]">
              <img src={stockAvail} alt="" className="h-[1rem] w-[1rem]" />
              {productData?.stock > 0 ? (
                <span className="font-medium text-[#067627] text-[16px]">stock: {productData?.stock}</span>
              ) : (
                <span className="font-medium text-[#067627] text-[16px]">stock empty</span>
              )}
            </div>
            <div className="mt-[1.5rem] tracking-normal">
              <span className="font-medium text-[15px] text-gray-800 ">Product Description</span>
              <p className="mt-[0.4rem] text-gray-600 text-[15px] max-w-3xl">{productData?.Product?.description}</p>
            </div>
            <div className="flex gap-[0.6rem] mt-[1.8rem]">
              <button
                onClick={() => handleAddtoCart(productData)}
                className="bg-[#00A67C] flex items-center justify-center py-[0.5rem] rounded-full w-full text-white text-[15px] font-medium hover:bg-[#008d69] cursor-pointer transition delay-50 ease-in-out">
                Add to Cart
              </button>
              {/* <div className="flex items-center">
                                <div
                                    className="mr-3 rounded-full border border-[#B2B2B2] h-[2.4rem] w-[2.4rem] flex items-center justify-center hover:bg-[#00A67C] group cursor-pointer transition delay-50 ease-in-out hover:border-[#00A67C]"
                                    onClick={() => handleQuantity('subtract')}
                                >
                                    <MinusIcon className=" text-gray-900 group-hover:text-white w-5 h-5" />
                                </div>
                                <p className="text-[18px] font-medium">{quantity}</p>
                                <div
                                    onClick={() => handleQuantity('add')}
                                    className="mx-3 rounded-full border border-[#B2B2B2] h-[2.4rem] w-[2.4rem] flex items-center justify-center hover:bg-[#00A67C] group cursor-pointer transition delay-50 ease-in-out hover:border-[#00A67C]"
                                >
                                    <PlusIcon className="text-gray-900 group-hover:text-white w-4 h-4" />
                                </div>
                            </div> */}
            </div>
          </section>
        </div>
      </section>
      <div className="mt-[5vh] lg:mt-[15vh]">
        <Footer />
      </div>
    </>
  )
}
