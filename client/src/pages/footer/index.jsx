import { Link } from 'react-router-dom'

import appLogo from '../../assets/yellow_white_logo.svg'
import tiki from '../../assets/home/Tiki.png'
import jne from '../../assets/home/jne.png'
import pos from '../../assets/home/pos.png'

export const Footer = () => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="px-[16px] md:px-[32px] lg:px-[160px] bg-[#121314]">
        <div className="text-white lg:pt-[1.6rem] flex flex-col">
          <section className="flex justify-between items-center">
            <img src={appLogo} alt="" className="h-[8.8rem] w-[8.8rem] lg:h-[9.8rem] lg:w-[9.8rem]" />
            <div className="hidden lg:block flex-col">
              <span className="text-[14.5px] text-[#f1f1f1] px-1">Get updates on savings events, special offers, new products, and more</span>
              <div className="relative mt-4 w-full">
                <input
                  type="email"
                  placeholder="your email"
                  autoComplete="off"
                  className="w-full border border-[#686868] rounded-full bg-transparent py-3 px-5 text-[14px] focus-within:outline-1 focus-within:outline-[#4ECCA3] focus-within:outline"
                />
                <button className="font-medium absolute inset-y-1 right-1 rounded-full text-[14px] text-[#f1f1f1] px-4 bg-[#00A67C]">subscribe</button>
              </div>
            </div>
          </section>
          <section className="flex flex-wrap gap-[4.5rem] lg:gap-[5rem] mt-2 lg:mt-6">
            <div className="flex flex-col text-[#FAFAFA] text-[15px]">
              <h4 className="mb-6 font-bold text-[15.5px]">About</h4>
              <div className="flex flex-col gap-1.5">
                <Link to={'/about'} onClick={handleLinkClick} className="cursor-pointer  hover:underline hover:underline-offset-2 whitespace-nowrap">
                  About Us
                </Link>
                <Link to={'/store-locator'} onClick={handleLinkClick} className="cursor-pointer  hover:underline hover:underline-offset-2">
                  Store Locator
                </Link>
                <span className="cursor-pointer  hover:underline hover:underline-offset-2">Blogs</span>
              </div>
            </div>
            <div className="flex flex-col text-[#FAFAFA] text-[15px]">
              <h4 className="mb-6 font-bold text-[15.5px]">Support</h4>
              <div className="flex flex-col gap-1.5">
                <Link to={'/about'} onClick={handleLinkClick} className="cursor-pointer  hover:underline hover:underline-offset-2">
                  Delivery Info
                </Link>
                <span className="cursor-pointer  hover:underline hover:underline-offset-2">Contact</span>
                <Link to={'/about'} onClick={handleLinkClick} className="cursor-pointer  hover:underline hover:underline-offset-2">
                  FAQs
                </Link>
              </div>
            </div>
            <div className="flex flex-col text-[#FAFAFA] text-[15px]">
              <h4 className="mb-6 font-bold text-[15.5px]">Legal</h4>
              <div className="flex flex-col gap-1.5">
                <Link to={'/about'} onClick={handleLinkClick} className="cursor-pointer  hover:underline hover:underline-offset-2">
                  Privacy Policy
                </Link>
                <span className="cursor-pointer  hover:underline hover:underline-offset-2">Terms of Use</span>
              </div>
            </div>
            <div className="flex flex-col text-[#FAFAFA] text-[15px]">
              <h4 className="mb-6 font-bold text-[15.5px]">Links</h4>
              <div className="flex flex-col gap-1.5">
                <Link to={'/'} onClick={handleLinkClick} className="cursor-pointer  hover:underline hover:underline-offset-2">
                  Home
                </Link>
                <Link to={'/catalogue'} onClick={() => window.scrollTo(0, 0)} className="cursor-pointer  hover:underline hover:underline-offset-2">
                  Catalogue
                </Link>
              </div>
            </div>
            <div className="flex flex-col text-[#FAFAFA] text-[15px] lg:ml-auto">
              <h4 className="mb-6 font-bold text-[15.5px] lg:text-end">Delivery Partner</h4>
              <div className="flex flex-wrap justify-center gap-2">
                <div className="flex items-center justify-center rounded-lg bg-white border border-[#D1D5D8] h-[40px] w-[70px] pt-2 pb-1 px-2">
                  <img src={tiki} alt="" className="h-full w-full object-fit" />
                </div>
                <div className="flex items-center justify-center rounded-lg bg-white border border-[#D1D5D8] h-[40px] w-[70px] p-2">
                  <img src={jne} alt="" className="h-full w-full object-fit" />
                </div>
                <div className="flex flex-wrap items-center justify-center rounded-lg bg-white border border-[#D1D5D8] h-[40px] w-[70px] py-1">
                  <img src={pos} alt="" className="h-full w-full object-fit" />
                </div>
              </div>
            </div>
          </section>
          <div className="lg:hidden flex flex-col mt-[3rem] w-full md:w-max">
            <span className="text-[14.5px] text-[#f1f1f1] px-1">Get updates on savings events, special offers, new products, and more</span>
            <div className="relative mt-4 w-full">
              <input
                type="email"
                placeholder="your email"
                autoComplete="off"
                className="w-full border border-[#686868] rounded-full bg-transparent py-3 px-5 text-[14px] focus-within:outline-1 focus-within:outline-[#4ECCA3] focus-within:outline"
              />
              <button className="font-medium absolute inset-y-1 right-1 rounded-full text-[14px] text-[#f1f1f1] px-4 bg-[#00A67C]">subscribe</button>
            </div>
          </div>
          <section className="flex lg:justify-end mt-[3rem] mb-[2rem]">
            <span className="text-[#bdbdbd] text-[14px] tracking-tight">© 2024 Fresh Finds, All Rights Reserved</span>
          </section>
        </div>
      </div>
    </>
  )
}
