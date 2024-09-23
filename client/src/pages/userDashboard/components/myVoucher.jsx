import { useEffect, useState } from 'react'

import lemonLogo from '../../../assets/lemon-logo.svg'
import axios from '../../../api/axios'
import { convertToIDR, formatDate2 } from '../../../functions/functions'
import emptyVoucher from '../../../assets/userDashboard/empty_voucher.svg'

export const MyVoucher = () => {
  const token = localStorage.getItem('token')
  const [userVoucherData, setUserVoucherData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUserVoucherData = async (page) => {
    try {
      const response = await axios.get(`vouchers/customer?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUserVoucherData(response.data.result.rows)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // window.scrollTo(0, 0)
  }

  useEffect(() => {
    fetchUserVoucherData(currentPage)
  }, [currentPage])

  return (
    <>
      <div className="h-screen">
        <section className="flex h-max flex-1 flex-col gap-[1.6rem] rounded-2xl border border-[#E6E6E5] bg-white  px-[22px] md:px-[32px] lg:px-[2.6rem] py-[2rem]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="mb-2 text-[26px] font-bold">My Voucher</h3>
              <p className="text-[15px] text-gray-600 ">Available coupon and voucher</p>
            </div>
          </div>
          {userVoucherData?.length > 0 ? (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-[0.75rem] md:gap-[2rem]">
                {userVoucherData?.map((item) => (
                  <>
                    <div
                      key={item?.id}
                      className="col-span-1 flex flex-col rounded-lg bg-gradient-to-r odd:from-[#049F75] odd:to-[#43E5B4] even:from-[#D87428] even:to-[#FBB770] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                      <div className="relative flex justify-between py-4 px-[1.6rem] items-center rounded-t-lg">
                        <div className="flex flex-col text-white">
                          <span className="text-[14.5px] text-[#effcf8] font-normal whitespace-pre">
                            {item?.Voucher.type === 'referral_code'
                              ? 'Referral  Voucher'
                              : item?.Voucher.type === 'shipping_cost'
                              ? 'Delivery Voucher'
                              : 'Product Voucher'}
                          </span>
                          {item.Voucher.value === 'percentage' ? (
                            <span className="text-[23px] font-semibold tracking-tight whitespace-pre">{item.Voucher.amount * 100}% Off</span>
                          ) : (
                            <span className="text-[23px] font-semibold tracking-tight whitespace-pre">Rp {convertToIDR(item.Voucher.amount)} Off</span>
                          )}
                          <span className="text-[15px] font-thin text-[#e2f9f2] uppercase">{item.Voucher.code}</span>
                        </div>
                        <div className="absolute h-5 w-5 rounded-full bg-white -left-[0.7rem] -bottom-[0.7rem] border-r border-[#E3E4E5]"></div>
                        <div className="absolute h-5 w-5 rounded-full bg-white -right-[0.7rem] -bottom-[0.7rem] border-l border-[#E3E4E5]"></div>
                        <div className="absolute right-[1.2rem] opacity-[0.65]">
                          <img src={lemonLogo} alt="" className="h-[4.1rem] w-[4.1rem]" />
                        </div>
                      </div>
                      <div className="flex py-2.5 px-[1.5rem] justify-between items-center rounded-b-lg text-[#e2f9f2] border-t-[1px] border-dashed border-[#e2f9f2]">
                        <div className="flex items-center text-[14px] gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="mt-[0.8px]">
                            <g fill="none">
                              <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                              <path
                                fill="currentColor"
                                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 4a1 1 0 0 0-1 1v5a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V7a1 1 0 0 0-1-1"
                              />
                            </g>
                          </svg>
                          <div className="flex">
                            {item?.Voucher.type === 'referral_code' ? (
                              <span>No Expiration Date</span>
                            ) : (
                              <>
                                <span>{formatDate2(item.Voucher.start_date)}</span>
                                <span className="mx-1">-</span>
                                <span>{formatDate2(item.Voucher.end_date)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="font-semibold text-[15.5px] whitespace-pre">x {item.quantity}</div>
                      </div>
                    </div>
                  </>
                ))}
              </section>
              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-[#E0E0E0] p-1.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-[0.65] transition ease-in-out delay-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#7a7a7a"
                    className="h-[1.2rem] w-[1.2rem] rtl:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <div className="text-[#898989] text-[15px] font-medium mx-1.5">
                  {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-[#E0E0E0] p-1.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-[0.65] transition ease-in-out delay-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#7a7a7a" className="h-[1.2rem] w-[1.2rem] rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 mt-7 mb-4">
              <div>
                <img src={emptyVoucher} alt="" className="h-[12rem] w-[12rem] opacity-60" />
              </div>
              <h3 className="text-[20px] md:text-[23px] text-[#666666] font-semibold opacity-80 mt-[1rem]">No Available Voucher!</h3>
              <p className="text-[14.5px] font-medium text-gray-500 w-[250px] text-center opacity-90 mt-[0.5rem]">Grab your voucher</p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
