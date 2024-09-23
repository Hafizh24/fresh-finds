import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Navbar } from '../navbar'
import logoAppWhite from '../../assets/logo-app-white.svg'
import freshBg3 from '../../assets/about/fresh-3.jpg'
import { GrocerySteps } from '../home/components/grocerySteps'
import { Footer } from '../footer'

const FaqItems = [
  {
    title: 'How do I place an order?',
    desc: 'Once you’re ready to check out, start by going to your cart. This is where you’ll enter your address and choose your delivery window.After this step you can add your payment information. You’ll see an estimated total in checkout, but you won’t be charged for your order until it’s delivered. The final price may change due to coupons, substitutions, taxes (if applicable), or weighted items.'
  },
  {
    title: 'What are the available Delivery options?',
    desc: 'We deliver our package through services provided by JNE, POS, and TIKI. You can shop online for the products you need and get them delivered to your doorstep that works for your schedule, same day delivery also available.'
  },
  {
    title: 'Is my personal information secure?',
    desc: "We recognize that privacy is very important to our customers, and we pledge to protect the security and privacy of any personal information they provide. This includes customers' names, addresses, telephone numbers, email addresses, credit/debit cards and checking account information, and any information that can be linked to an individual."
  },
  {
    title: 'What are your privacy policy?',
    desc: 'We obtain personal information about you when you access our web app. The types of personal information we may obtain include: Contact information, such as telephone number, email, address; Payment Information; and Demographic information and interests'
  }
]

export const About = () => {
  const [selectedMenu, setSelectedMenu] = useState(null)

  const toggleDescription = (index) => {
    setSelectedMenu((prevIndex) => (prevIndex === index ? null : index))
  }

  return (
    <>
      <Navbar />
      <section className="relative w-full h-[100svh] md:h-[70vh] lg:h-[80vh]">
        <img src={freshBg3} alt="" className="h-full w-full object-cover opacity-[0.85]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-[1rem] md:gap-[3rem] pt-[1rem]">
          <img src={logoAppWhite} alt="" className=" h-[10rem]" />
          <div className="border-[2px] border-white py-2 px-5 text-white rounded-full text-[18px] font-medium cursor-pointer hover:bg-white hover:text-gray-500 transition ease-in-out delay-100">
            About Us
          </div>
        </div>
      </section>
      <section className="w-full px-[16px] md:px-[32px] lg:px-[160px] mt-[2rem] mb-[2.6rem] md:mt-[5rem] md:mb-[6rem] flex flex-col gap-[2.4rem] md:gap-[5rem]">
        <div className="">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex flex-col items-start font-semibold text-[#067627]">
              <h2 className="text-[1.8rem] md:text-[2.4rem] lg:text-[3rem] leading-tight">
                Shop Fresh, <br /> Shop Easy
              </h2>
              <h2 className="text-[1.1rem] md:text-[1.5rem] lg:text-[1.7rem] mt-[1rem]">Your One-Stop Online Market!</h2>
            </div>
            <div className="md:max-w-[22rem] lg:max-w-[30rem] text-[#343538] mt-[1rem] md:mt-0 text-[15px] md:text-[16px]">
              At <span className="text-[#067627] font-medium">Fresh Finds,</span> we understand the importance of fresh, high-quality ingredients in every meal you
              prepare for yourself and your loved ones. We&apos;re dedicated to revolutionizing the way you shop for groceries. All available at your fingertips.
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex flex-col items-start font-semibold text-[#067627]">
              <h2 className="text-[1.8rem] md:text-[2.4rem] lg:text-[3rem]">FAQs</h2>
            </div>
            <div className="max-w-[30rem] w-full text-[#343538] flex flex-col gap-[0.5rem] text-[15px] md:text-[15.5px] mt-[1rem] md:mt-0">
              {FaqItems.map((item, index) => (
                <>
                  <div
                    key={index}
                    onClick={() => toggleDescription(index)}
                    className="border border-gray-300 shadow-sm rounded-lg py-[0.5rem] px-[0.8rem] cursor-pointer hover:bg-gray-50 transition ease-in-out delay-100">
                    <div className="flex justify-between items-center">
                      <h4>{item.title}</h4>
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        className="fill-[#65676d] group-hover:fill-[#3A826E] mt-[0.15rem]"
                        animate={{ rotate: selectedMenu === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}>
                        <path d="M11.3733 4.6602L7.0001 8.9232L2.62685 4.6602C2.54871 4.58389 2.44382 4.54116 2.3346 4.54116C2.22537 4.54116 2.12048 4.58389 2.04235 4.6602C2.00451 4.69727 1.97446 4.74152 1.95394 4.79035C1.93342 4.83918 1.92285 4.89161 1.92285 4.94458C1.92285 4.99755 1.93342 5.04998 1.95394 5.09881C1.97446 5.14764 2.00451 5.19189 2.04235 5.22895L6.69472 9.76495C6.77642 9.84459 6.886 9.88916 7.0001 9.88916C7.11419 9.88916 7.22377 9.84459 7.30547 9.76495L11.9578 5.22983C11.9959 5.19273 12.0262 5.14838 12.0469 5.09939C12.0676 5.05039 12.0782 4.99776 12.0782 4.94458C12.0782 4.8914 12.0676 4.83876 12.0469 4.78977C12.0262 4.74078 11.9959 4.69643 11.9578 4.65933C11.8797 4.58301 11.7748 4.54028 11.6656 4.54028C11.5564 4.54028 11.4515 4.58301 11.3733 4.65933V4.6602Z" />
                      </motion.svg>
                    </div>
                    <AnimatePresence>
                      {selectedMenu === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 0, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: 0, height: 0 }}
                          transition={{
                            type: 'spring',
                            bounce: 0,
                            duration: 0.7
                          }}>
                          <p className="pt-[0.6rem] pb-[0.4rem] text-[14px] md:text-[14.5px] text-[#65676d]">{item.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </section>
      <GrocerySteps />
      <Footer />
    </>
  )
}
