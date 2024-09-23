import { useEffect, useRef, useState } from 'react'
import KeenSlider from 'keen-slider'
import 'keen-slider/keen-slider.min.css'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useScroll, useTransform, motion } from 'framer-motion'

import { convertToIDR } from '../../../functions/functions'
import stockAvail from '../../../assets/home/stock_avail.svg'
import axios from '../../../api/axios'

// const cardsData = [
//   {
//     title: 'card 2',
//     img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     price: '25000',
//     stock: 54,
//     desc: 'Just FreshDirect 100% Grass-Fed Local 80% Lean Ground Beef, Fresh, Premium Packaging'
//   },
//   {
//     title: 'card 1',
//     img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     price: '25000',
//     stock: 54,
//     desc: 'FreshDirect Rotisserie Chicken, Raised w/o Antibiotics'
//   },
//   {
//     title: 'card 3',
//     img: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     price: '2500000',
//     stock: 54,
//     desc: 'Siggis Skyr Icelandic-Style Strained Non-Fat Yogurt, Mixed Berry and Acai'
//   },
//   {
//     title: 'card 4',
//     img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     price: '25000',
//     stock: 54,
//     desc: 'Just FreshDirect Local Angus RWA 90% Lean Ground Beef, Premium Packaging'
//   },
//   {
//     title: 'card 5',
//     img: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     price: '25000000',
//     stock: 54,
//     desc: 'Sprouts Organic Chicken Thin Sliced Boneless Breast'
//   },
//   {
//     title: 'card 6',
//     img: 'https://plus.unsplash.com/premium_photo-1671379041175-782d15092945?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     price: '250000',
//     stock: 54,
//     desc: 'this is desc this is desc this is desc'
//   }
// ]

// eslint-disable-next-line react/prop-types
export const DiscountedProducts = ({ product, branchId }) => {
  const [productImage, setProductImage] = useState()
  const navigate = useNavigate()

  const [keenSlider, setKeenSlider] = useState(null)
  const sliderRef = useRef(null)

  const handleLinkClick = () => {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0 })
  }

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -1000])

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
              perView: 2.25,
              spacing: 8
            }
          },
          '(min-width: 640px)': {
            slides: {
              perView: 2.25,
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
              spacing: 15
            }
          }
        }
      })

      setKeenSlider(slider)
    }
  }, [])

  const getProductImages = async () => {
    try {
      const imagePromises = product?.map(async (prod) => {
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
      <section className="relative my-[16px] mx-[10px] md:mx-[32px] lg:mx-[160px] bg-[#EBF6F3] rounded-2xl overflow-hidden z-10">
        <motion.svg
          style={{ y }}
          className=" absolute h-[17rem] md:h-[18rem] w-max -left-[6rem] bottom-[7rem] lg:-bottom-[0rem] md:-bottom-[8rem] opacity-40"
          width="39"
          height="40"
          viewBox="0 0 39 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_130_61)">
            <g clipPath="url(#clip1_130_61)">
              <path
                d="M29.4288 36.255C28.4852 36.4679 27.4916 36.5853 26.4512 36.5853C20.8572 36.5853 14.7236 33.5202 10.047 28.3856C4.37683 22.1616 2.23494 14.3608 4.0459 8.61523C-0.216448 14.058 -1.10447 21.3401 1.51595 27.5713C1.73816 29.0376 2.18574 32.4914 1.658 33.644C1.658 33.644 4.38238 33.5967 6.81631 34.7414C13.2063 40.118 22.4103 40.7187 29.4288 36.255Z"
                fill="#E9DE2C"
              />
              <path
                d="M21.8975 33.3159L22.1808 33.3979C23.5989 33.8079 24.9861 34.016 26.3035 34.016C27.9327 34.016 29.4254 33.692 30.7428 33.0518C31.1816 32.8374 31.6276 32.5591 32.1054 32.202L32.4172 31.9694L22.5752 20.0093L21.8975 33.3159Z"
                fill="#E9DE2C"
              />
              <path
                d="M6.50977 16.5847L6.64626 17.1247C7.36446 19.9668 8.81196 22.8238 10.8348 25.3891L11.0705 25.6879L19.7484 18.5824L6.50977 16.5847Z"
                fill="#E9DE2C"
              />
              <path
                d="M15.4288 3.65405C14.2892 3.65405 13.1948 3.81961 12.1751 4.1452L11.6553 4.31312L21.2291 15.9461L21.7806 5.07782L21.5402 4.97691C19.4483 4.09947 17.3921 3.65405 15.4288 3.65405Z"
                fill="#E9DE2C"
              />
              <path
                d="M10.2425 5.02502L9.96002 5.21502C9.61005 5.45231 9.32832 5.66754 9.07755 5.89379C8.54585 6.36996 8.0816 6.92339 7.65862 7.58482C6.44046 9.48082 5.94209 11.9421 6.21905 14.7021L6.24683 14.9891L20.1711 17.09L10.2425 5.02502Z"
                fill="#E9DE2C"
              />
              <path d="M29.1954 10.3315C27.5511 8.62704 25.7417 7.20406 23.8228 6.1043L23.2943 5.80078L22.7705 16.1078L29.4723 10.62L29.1954 10.3315Z" fill="#E9DE2C" />
              <path
                d="M35.4639 22.4989C35.4131 22.1032 35.3353 21.6775 35.2266 21.1611L35.1726 20.9104L23.918 19.2123L33.5108 30.8713L33.7941 30.4795C35.2996 28.4029 35.8765 25.6437 35.4639 22.4989Z"
                fill="#E9DE2C"
              />
              <path d="M34.7224 19.2848L34.5113 18.7006C33.6693 16.3694 32.3972 14.1391 30.729 12.0721L30.4933 11.7788L23.4082 17.578L34.7224 19.2848Z" fill="#E9DE2C" />
              <path d="M12.3521 27.1439C14.5845 29.505 17.1874 31.379 19.8785 32.5639L20.3745 32.7822L21.049 19.5103L12.0791 26.8554L12.3521 27.1439Z" fill="#E9DE2C" />
              <path
                d="M26.4061 36.8865C20.7597 36.8865 14.5681 33.856 9.84551 28.7798C2.12075 20.4729 0.704195 9.24749 6.68704 3.75343C8.83052 1.78569 11.7025 0.74585 14.9927 0.74585C20.6399 0.74585 26.8306 3.77708 31.5517 8.85331C39.2788 17.1571 40.6962 28.3841 34.7117 33.8789C32.5675 35.8466 29.6955 36.8865 26.4061 36.8865ZM14.9935 2.03324C12.035 2.03324 9.46697 2.95561 7.56713 4.69946C2.10884 9.71104 3.55793 20.1221 10.7978 27.9055C15.28 32.7232 21.1144 35.5999 26.4061 35.5999C29.3646 35.5999 31.9318 34.6783 33.8317 32.9345C39.2907 27.9221 37.8416 17.511 30.6002 9.7276C26.1196 4.90916 20.2851 2.03324 14.9935 2.03324Z"
                fill="#E9DE2C"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_130_61">
              <rect width="38.3751" height="38.485" fill="white" transform="translate(0.0410156 0.74585)" />
            </clipPath>
            <clipPath id="clip1_130_61">
              <rect width="38.3751" height="38.485" fill="white" transform="translate(0.0410156 0.74585)" />
            </clipPath>
          </defs>
        </motion.svg>
        <motion.svg
          style={{ y }}
          className=" absolute h-[18.5rem] w-max -right-[5rem] -bottom-[20rem] opacity-40"
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="119"
          viewBox="0 0 120 119"
          fill="none">
          <g clipPath="url(#clip0_978_2)">
            <g clipPath="url(#clip1_978_2)">
              <path
                d="M90.3328 23.3722C91.5349 25.4067 92.5509 27.6291 93.3269 30.0486C97.4993 43.0578 94.8987 59.6232 86.3669 74.3541C76.0256 92.2135 59.3616 103.052 44.5606 103.154C60.4813 108.98 78.1908 105.577 90.8235 94.805C94.0904 93.1873 101.842 89.5533 104.934 89.9152C104.934 89.9152 102.791 83.615 103.655 77.0953C111.476 58.1982 106.017 36.3427 90.3328 23.3722Z"
                fill="#E9DE2C"
              />
              <path
                d="M89.0704 43.0948L89.051 42.3743C88.953 38.7686 88.4055 35.3863 87.423 32.3227C86.2078 28.5339 84.3359 25.3057 81.8547 22.7227C81.0254 21.8631 80.0413 21.0349 78.8489 20.192L78.0719 19.6413L57.4142 51.5095L89.0704 43.0948Z"
                fill="#E9DE2C"
              />
              <path
                d="M61.3798 91.4418L62.5422 90.7189C68.6596 86.9148 74.2682 81.4035 78.7648 74.7732L79.2885 74.0007L56.1821 59.1547L61.3798 91.4418Z"
                fill="#E9DE2C"
              />
              <path
                d="M24.4569 80.4083C25.3068 83.0585 26.5107 85.4792 28.0335 87.6063L28.8143 88.689L48.9062 57.6903L23.0523 64.5677L22.9954 65.2026C22.5016 70.7263 22.9925 75.8425 24.4569 80.4083Z"
                fill="#E9DE2C"
              />
              <path
                d="M31.5344 91.4396L32.1899 91.9539C33.0064 92.5896 33.7204 93.0832 34.4371 93.4965C35.9484 94.3755 37.5902 95.0396 39.4541 95.5267C44.8012 96.936 50.9347 96.2471 57.1893 93.5307L57.8404 93.2507L52.3731 59.2915L31.5344 91.4396Z"
                fill="#E9DE2C"
              />
              <path d="M29.8207 43.3804C27.0571 48.484 25.0754 53.7602 23.9322 59.0485L23.6158 60.5055L48.135 53.9849L30.2896 42.5196L29.8207 43.3804Z" fill="#E9DE2C" />
              <path
                d="M53.6286 19.6651C52.74 20.0804 51.8014 20.5809 50.6737 21.2214L50.127 21.5351L54.5462 48.9835L74.6848 17.9209L73.5563 17.5562C67.5723 15.6143 60.6826 16.3443 53.6286 19.6651Z"
                fill="#E9DE2C"
              />
              <path d="M46.6578 23.8039L45.4477 24.7334C40.6185 28.4418 36.3463 33.0747 32.7515 38.506L32.2407 39.2743L51.101 51.3972L46.6578 23.8039Z" fill="#E9DE2C" />
              <path d="M81.7412 69.9269C85.6036 62.9627 88.049 55.5023 88.8156 48.3545L88.9569 47.0371L57.3842 55.4332L81.2694 70.7784L81.7412 69.9269Z" fill="#E9DE2C" />
              <path
                d="M94.0656 29.9277C98.2771 43.0586 95.8009 59.7328 87.44 74.5269C73.7552 98.7283 48.5332 110.451 31.2093 100.662C25.0041 97.1549 20.4277 91.2566 17.9736 83.6051C13.7616 70.4722 16.2402 53.7993 24.6023 39.0089C38.2779 14.8044 63.503 3.07889 80.83 12.8705C87.0358 16.3797 91.6122 22.2779 94.0656 29.9277ZM20.9868 82.6366C23.1935 89.5168 27.2681 94.7964 32.7675 97.9053C48.5707 106.836 71.862 95.6494 84.683 72.9687C92.6179 58.9279 95.0006 43.1997 91.0537 30.8937C88.8471 24.0135 84.7748 18.7352 79.2755 15.6262C63.4698 6.69418 40.1785 17.8809 27.3587 40.5653C19.4207 54.603 17.04 70.3306 20.9868 82.6366Z"
                fill="#E9DE2C"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_978_2">
              <rect width="93.7214" height="94.6132" fill="white" transform="translate(29.1256 118.376) rotate(-107.782)" />
            </clipPath>
            <clipPath id="clip1_978_2">
              <rect width="93.7214" height="94.6132" fill="white" transform="translate(29.1256 118.376) rotate(-107.782)" />
            </clipPath>
          </defs>
        </motion.svg>
        {/*  */}
        <div className="flex flex-col gap-5 py-4 md:py-6 px-4 md:px-8">
          <section className="flex flex-col md:flex-row justify-between items-center z-50">
            <div className="flex flex-col gap-1 p-1 md:px-1 md:py-0 lg:p-0">
              <h4 className="whitespace-pre tracking-tight font-semibold text-[29px] text-[#28302A]">Best Deals</h4>
              <p className="text-gray-600 font-medium text-[15.5px]">Check out these discounted items that everyone is raving about!</p>
            </div>
            <div className="flex items-center justify-between gap-5 w-full md:w-max mt-5 px-1.5 md:px-0">
              <Link to={'/catalogue'} onClick={handleLinkClick} className="font-semibold text-[#469A84] hover:underline underline-offset-2 cursor-pointer ">
                View all
              </Link>
              <div className="flex gap-3">
                <button
                  aria-label="Previous slide"
                  id="keen-slider-previous"
                  onClick={slidePrev}
                  className="rounded-full border border-[#93cebe] p-3 transition hover:bg-[#e0f1ed] h-max cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#469a84" className="h-5 w-5 rtl:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  aria-label="Next slide"
                  id="keen-slider-next"
                  onClick={slideNext}
                  className="rounded-full border border-[#93cebe] p-3 transition hover:bg-[#e0f1ed] h-max cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#469a84" className="h-5 w-5 rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
          <section ref={sliderRef}>
            <div id="keen-slider" className="keen-slider">
              {product?.map((item, index) => (
                <div className="keen-slider__slide cursor-pointer" key={index} onClick={() => navigate(`/product-detail/${item.Product?.id}/${branchId}`)}>
                  <div className="flex h-full flex-col justify-between bg-white p-2 border border-[#D1D5D8] rounded-xl gap-3 hover:border-[#00A67C] transition delay-100 ease-in-out">
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
                        <p className="text-[16px] md:text-[18px] font-bold text-rose-600 tracking-tight">{convertToIDR(item?.discounted_price)}</p>
                        <div className="font-semibold text-[#757575] text-[15px] line-through">Rp {item?.original_price}</div>
                      </div>
                      <p className="leading-relaxed text-gray-700 text-[14px] md:text-[15px] line-clamp-2">{item.Product?.desc}</p>

                      <div className="flex gap-1.5 items-center">
                        <img src={stockAvail} alt="" className="h-3 pt-[0.1rem]" />
                        <span className="text-[#067627] font-medium text-[13px] md:text-[14px]">
                          stock: <span className="text-[13px] md:text-[14px]">{item?.stock}</span>{' '}
                        </span>
                      </div>
                    </div>
                    <button className="mt-1 mb-[0.2rem] w-full rounded-full bg-[#00A67C] text-white py-[0.4rem] text-[14px]">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  )
}
