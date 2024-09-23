/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import stockAvail from '../../../assets/home/stock_avail.svg'
import { convertToIDR } from '../../../functions/functions'
import axios from '../../../api/axios'

export const ProductCatalogueData = ({ product, branchId, handlePageLimit }) => {
  const [productImage, setProductImage] = useState()
  const navigate = useNavigate()

  const getProductImages = async () => {
    try {
      const imagePromises = product.map(async (prod) => {
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
  }, [product])

  return (
    <>
      {/* Card Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
        {product.map((item, index) => (
          <div onClick={() => navigate(`/product-detail/${item.Product?.id}/${branchId}`)} className="cursor-pointer col-span-1" key={index}>
            <div className="flex h-full flex-col justify-between bg-white p-2 border border-[#D1D5D8] rounded-xl gap-3 hover:border-[#00A67C] transition delay-75 ease-in-out">
              <div>
                <img
                  src={productImage[index]?.image ? productImage[index]?.image : 'https://www.pngkey.com/png/detail/233-2332677_ega-png.png'}
                  alt=""
                  className="rounded-lg h-[8.75rem] md:h-[11.5rem] lg:h-[9rem] xl:h-[10rem] w-full object-cover"
                />
              </div>
              <div className="px-1.5 flex flex-col gap-1">
                <div className="flex gap-1">
                  <span className="font-bold text-[13px]">Rp</span>
                  {item?.hasDiscount ? (
                    <p className="text-[16px] md:text-[18px] font-bold text-rose-600 tracking-tight">{convertToIDR(item?.discounted_price)}</p>
                  ) : (
                    <p className="text-[16px] md:text-[18px] font-bold text-rose-600 tracking-tight">{convertToIDR(item.original_price)}</p>
                  )}
                  {item?.hasDiscount && <div className="font-semibold text-[#757575] text-[15px] line-through">Rp {item?.original_price}</div>}
                </div>
                <p className="leading-relaxed text-gray-900 text-[14px] line-clamp-2">{item.Product?.name}</p>

                <div className="flex gap-1.5 items-center">
                  <img src={stockAvail} alt="" className="h-3 pt-[0.1rem]" />
                  <span className="text-[#067627] font-medium text-[13px] md:text-[14px]">
                    stock: <span className="text-[13px] md:text-[14px]">{item.stock}</span>{' '}
                  </span>
                </div>
              </div>
              <button
                // onClick={addToCart}
                className="mt-1 mb-[0.2rem] w-full rounded-full bg-[#00A67C] text-white py-[0.4rem] text-[14px]">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </section>
      {/* Pagination */}
      {product.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-[1.4rem] md:mt-[1.8rem]">
          <button
            onClick={handlePageLimit}
            className="text-[#898989] rounded-lg border border-[#E0E0E0] p-1.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-[0.65] transition ease-in-out delay-100 ">
            Load more
          </button>
        </div>
      )}
    </>
  )
}
