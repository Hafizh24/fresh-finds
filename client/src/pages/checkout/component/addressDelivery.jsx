import { useEffect, useState } from 'react'

import { ModalChangeAddress } from '../component/modalChangeAddress'
import axios from '../../../api/axios'
import { DeliveryCost } from './deliveryCost'
import { calculateDistance } from '../../../functions/functions'
import { useGeoLocation } from '../../../hooks/useGeoLocation'

export const AddressDelivery = ({ handleDeliveryCostChange }) => {
  const [branchLatLng, setBranchLatLng] = useState()
  const [addressLatLng, setAddressLatLng] = useState()
  const [finalDistance, setFinalDistance] = useState()

  const { loaded, coordinates } = useGeoLocation()
  const [branchCity, setBranchCity] = useState()
  const [branchMaxDistance, setBranchMaxDistance] = useState()

  const fetchNearestBranch = async () => {
    if (loaded) {
      try {
        const response = await axios.post(`branches/get-nearest?latitude=${coordinates.lat}&longitude=${coordinates.lng}`)
        setBranchCity(response.data.result[0].CityId)
        setBranchMaxDistance(response.data.result[0].maxDeliveryDistance)

        const { latitude, longitude } = response.data.result[0]
        setBranchLatLng({ latitude, longitude })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const fetchMainBranch = async () => {
    try {
      const response = await axios.get('branches/super-store')
      setBranchCity(response.data.result.CityId)
      setBranchMaxDistance(response.data.result.maxDeliveryDistance)

      const { latitude, longitude } = response.data.result
      setBranchLatLng({ latitude, longitude })
    } catch (error) {
      console.error(error)
    }
  }

  const token = localStorage.getItem('token')
  const [modalChangeAddressOpen, setModalChangeAddressOpen] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState(null)

  const fetchDeliveryAddress = async () => {
    try {
      const response = await axios.get('customer-address/delivery-address', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setDeliveryAddress(response.data.result)

      const { latitude, longitude } = response.data.result
      setAddressLatLng({ latitude, longitude })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDeliveryAddress()
  }, [])

  useEffect(() => {
    if (branchLatLng && addressLatLng) {
      const distance = calculateDistance(branchLatLng.latitude, branchLatLng.longitude, addressLatLng.latitude, addressLatLng.longitude)

      setFinalDistance(distance)
    }
  }, [branchLatLng, addressLatLng])

  useEffect(() => {
    if (!loaded) {
      console.log('Location permission denied. Fetching branch Id from main store.')
      fetchMainBranch()
    } else if (coordinates && loaded) {
      console.log('Location permission granted. Fetching branch Id from nearest store.')
      fetchNearestBranch()
    }
  }, [loaded, coordinates?.lat, coordinates?.lng])

  return (
    <>
      {/* Delivery Address */}
      <section className="rounded-xl bg-[#FFFFFF] py-5 px-4 md:px-7 shadow-sm">
        <h3 className="text-[20px] font-bold border-b border-[#dcdcdc] text-[#28302A] pb-[0.6rem]">Delivery Address</h3>
        {!deliveryAddress ? (
          <div className="mt-[1rem] text-[14px] font-medium text-gray-500">You haven&apos;t selected any address, please select one</div>
        ) : (
          <div className="flex flex-col gap-1 mt-[1rem] border-b border-[#dcdcdc] pb-[1.3rem]">
            <div className="flex items-center gap-[0.6rem]">
              <h4 className="text-[16.5px] text-[#474747] font-medium">{deliveryAddress?.title}</h4>
              {deliveryAddress?.isDefault && (
                <div className="flex items-center py-[0.1rem] bg-[#DBEFDC] w-max rounded-md px-[0.5rem] mt-[0.1rem]">
                  <span className="text-[13px] font-medium text-[#1e6a24] tracking-tight">default</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[#989d9e]">
              <span className="font-medium text-[14px]">{deliveryAddress?.customerAddressName}</span>
              <span className=" font-medium text-[14px]">({deliveryAddress?.phoneNumber})</span>
            </div>
            <div className="flex gap-1 rounded-xl bg-[#f5f6f6] p-3 mt-[0.3rem]">
              <div className="w-max h-max flex items-center justify-center mt-[3px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15 15">
                  <g fill="none" fillRule="evenodd" stroke="#696969" strokeLinecap="square" clipRule="evenodd">
                    <path d="M7.5 8.495a2 2 0 0 0 2-1.999a2 2 0 0 0-4 0a2 2 0 0 0 2 1.999Z" />
                    <path d="M13.5 6.496c0 4.997-5 7.995-6 7.995s-6-2.998-6-7.995A5.999 5.999 0 0 1 7.5.5c3.313 0 6 2.685 6 5.996Z" />
                  </g>
                </svg>
              </div>
              <div className="flex flex-col">
                <p className="text-[14px] font-medium text-[#696969] px-1">{deliveryAddress?.fullAddress}</p>
                <div className="flex items-center">
                  <p className="text-[14px] font-medium text-[#696969] pl-1">{deliveryAddress?.City?.city},</p>
                  <p className="text-[14px] font-medium text-[#696969] pl-1">{deliveryAddress?.City?.Province?.province}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setModalChangeAddressOpen(!modalChangeAddressOpen)}
          className="mt-[0.8rem] px-4 rounded-full bg-[#00A67C] font-medium text-white py-[0.6rem] text-[14px] hover:bg-[#00916D] transition ease-in-out delay-100">
          {deliveryAddress ? 'Change' : 'Choose'} Address
        </button>
      </section>
      {/* Delivery Cost */}
      <DeliveryCost
        deliveryAddress={deliveryAddress}
        finalDistance={finalDistance}
        handleDeliveryCostChange={handleDeliveryCostChange}
        branchCity={branchCity}
        branchMaxDistance={branchMaxDistance}
      />
      {/* ----- Modal ----- */}
      <ModalChangeAddress
        modalChangeAddressOpen={modalChangeAddressOpen}
        setModalChangeAddressOpen={setModalChangeAddressOpen}
        fetchDeliveryAddress={fetchDeliveryAddress}
      />
    </>
  )
}
