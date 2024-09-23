import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Option, Select } from '@material-tailwind/react'
import ContentLoader from 'react-content-loader'
import { FiPackage } from 'react-icons/fi'

import axios from '../../../api/axios'
import { convertToIDR, formatWeight } from '../../../functions/functions'
import deliverySvg from '../../../assets/transport.svg'

const dummyWeight = 1700

export const DeliveryCost = ({ deliveryAddress, finalDistance, handleDeliveryCostChange, branchCity, branchMaxDistance }) => {
  const token = localStorage.getItem('token')
  const [shippingCost, setShippingCost] = useState(null)
  const [selectedCourier, setSelectedCourier] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCourierChange = (value) => {
    setSelectedCourier(value)
  }

  const calculateShippingCost = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        'shipping/calculate-cost',
        {
          originCityId: deliveryAddress?.CityId,
          destinationCityId: branchCity,
          weight: dummyWeight,
          courier: selectedCourier
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setShippingCost(response.data.shippingcost[0].costs)
      setLoading(false)
      // console.log(shippingCost);
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedCourier && deliveryAddress) {
      calculateShippingCost()
    }
  }, [selectedCourier, deliveryAddress])

  return (
    <section className="rounded-xl bg-[#FFFFFF] py-5 px-4 md:px-7 shadow-sm">
      <h3 className="text-[20px] font-bold border-b border-[#dcdcdc] text-[#28302A] pb-[0.6rem]">Delivery Method & Cost</h3>
      {finalDistance < branchMaxDistance ? (
        <>
          <div className="flex flex-col md:flex-row gap-2 mt-4 justify-between items-start md:items-center">
            {/* Dropdown for Delivery Method */}
            <div className="w-full md:w-max">
              <Select color="teal" variant="standard" label="Select Courier" id="courier" onChange={(value) => handleCourierChange(value)}>
                <Option value="jne">JNE</Option>
                <Option value="pos">POS</Option>
                <Option value="tiki">TIKI</Option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5 order-first md:order-last mb-[12px] md:mb-0">
              <div className="flex items-center text-[14px] text-[#989D9E] font-[450]">
                <FiPackage size={16} className="text-[#989D9E] place-self-start mt-[3px] mr-[0.42rem]" />
                <span className=" ">Weight: {formatWeight(dummyWeight)}</span>
                <span className="text-gray-400 text-[10px] px-1 ">•</span>
                <span className=" ">Distance: {finalDistance.toFixed(1)} km</span>
              </div>
            </div>
          </div>
          <fieldset className="flex flex-col mt-4 gap-2.5">
            <legend className="sr-only">Courier Service Options</legend>
            {loading ? (
              <ContentLoader height={100} width="100%" speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
                <rect x="0" y="10" rx="3" ry="3" width="40%" height="10" />
                <rect x="0" y="30" rx="3" ry="3" width="40%" height="10" />
                <rect x="45%" y="10" rx="3" ry="3" width="60%" height="10" />
                {/*  */}
                <rect x="0" y="60" rx="3" ry="3" width="40%" height="10" />
                <rect x="0" y="80" rx="3" ry="3" width="40%" height="10" />
                <rect x="45%" y="60" rx="3" ry="3" width="60%" height="10" />
              </ContentLoader>
            ) : (
              shippingCost?.map((item, index) => (
                <div key={index}>
                  <input
                    id={item.service}
                    type="radio"
                    name="serviceOptions"
                    className="peer hidden [&:checked_+_label_svg]:block"
                    onClick={() => handleDeliveryCostChange(item.cost[0].value)}
                  />
                  <label
                    htmlFor={item.service}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 text-gray-700 bg-white p-4 font-medium shadow-sm hover:border-gray-200  peer-checked:ring-1 peer-checked:ring-[#00A67C]  peer-checked:text-[#00A67C]">
                    <div className="flex items-center gap-2 w-full">
                      <svg className="hidden h-5 w-5 text-[#00A67C]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex flex-col">
                        <p className="text-gray-800 text-[14px] font-medium">{item.service}</p>
                        <p className="text-[#989D9E] text-[14px]">{item.description}</p>
                      </div>
                      <span className="ml-auto font-semibold ">Rp {convertToIDR(item.cost[0].value)}</span>
                    </div>
                  </label>
                </div>
              ))
            )}
          </fieldset>
        </>
      ) : finalDistance > branchMaxDistance ? (
        <div className="flex flex-col items-center mt-3">
          <div>
            <img src={deliverySvg} alt="" className="h-[12rem] w-[12rem] md:h-[14rem] md:w-[14rem] opacity-[0.60]" />
          </div>
          <h3 className="text-[22px] md:text-[23px] text-[#6db85c] font-semibold text-center">Oops, You&apos;re too far away!</h3>
          <p className="text-[14.5px] font-medium text-gray-500 w-[270px] md:w-[300px] text-center opacity-[0.90] mt-[0.4rem] mb-3">
            your location is out of reach for delivery, please choose another address
          </p>
        </div>
      ) : (
        <>
          <div className="mt-[1rem] text-[14px] font-medium text-gray-500">Delivery costs will be displayed once you&apos;ve selected your address</div>
        </>
      )}
    </section>
  )
}

DeliveryCost.propTypes = {
  deliveryAddress: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    CityId: PropTypes.number.isRequired,
    maxDeliveryDistance: PropTypes.string
  }),
  finalDistance: PropTypes.number
}
