import { Dialog, DialogBody, DialogHeader, Step, Stepper } from '@material-tailwind/react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SyncLoader } from 'react-spinners'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { BiHome } from 'react-icons/bi'
import { LuMapPin } from 'react-icons/lu'
import Select from 'react-select'

import { MapWithMarker } from './mapWithMarker'
import axios from '../../../api/axios'

export const ModalAddressEdit = ({ modalEditOpen, setModalEditOpen, item, fetchUserAddressData, currentPage }) => {
  const token = localStorage.getItem('token')
  const customer = useSelector((state) => state.customer.value)

  const [isLoading, setIsLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [isLastStep, setIsLastStep] = useState(false)
  const [isFirstStep, setIsFirstStep] = useState(false)

  const [cityOptions, setCityOptions] = useState([])
  const [provinceOptions, setProvinceOptions] = useState([])

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1)
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)

  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  })

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value)

    const ll = await getLatLng(results[0])
    setAddress(value)
    setCoordinates(ll)
  }

  const fetchCities = async () => {
    try {
      const response = await axios('cities/')
      const cityData = response.data.result.map((city) => ({
        value: city.city_id,
        label: city.city
      }))
      setCityOptions(cityData)
    } catch (error) {
      console.error('Error fethcing cities', error)
    }
  }

  const fetchProvinces = async () => {
    try {
      const response = await axios('provinces/')
      const provinceData = response.data.result.map((province) => ({
        value: province.province_id,
        label: province.province
      }))
      setProvinceOptions(provinceData)
    } catch (error) {
      console.error('Error fetching provinces', error)
    }
  }

  const handleCityChange = (selectedOption) => {
    formik.setFieldValue('CityId', selectedOption.value)
  }

  const handleProvinceChange = (selectedOption) => {
    formik.setFieldValue('province_id', selectedOption.value)
  }

  useEffect(() => {
    fetchCities()
    fetchProvinces()
  }, [])

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const dataToSend = {
        title: formik.values.title || item.title,
        customerAddressName: formik.values.customerAddressName || item.customerAddressName,
        phoneNumber: formik.values.phoneNumber || item.phoneNumber,
        address: address || item.address,
        longitude: coordinates.lng || item.longitude,
        latitude: coordinates.lat || item.latitude,
        fullAddress: formik.values.fullAddress || item.fullAddress,
        CityId: formik.values.CityId ? formik.values.CityId : item.CityId,
        province_id: formik.values.province_id ? formik.values.province_id : item.province_id
      }

      await createAddressSchema.validate(dataToSend)

      const response = await axios.patch(`customer-address/edit/${item.id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchUserAddressData(currentPage)
      setIsLoading(false)
      toast.success(response.data.message, {
        position: 'top-center'
      })
      setModalEditOpen(false)
      formik.resetForm()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  const createAddressSchema = Yup.object().shape({
    title: Yup.string(),
    customerAddressName: Yup.string(),
    phoneNumber: Yup.string(),
    address: Yup.string(),
    fullAddress: Yup.string(),
    province_id: Yup.number()
  })

  const formik = useFormik({
    initialValues: {
      title: item.title || undefined,
      customerAddressName: item.customerAddressName || undefined,
      phoneNumber: item.phoneNumber || undefined,
      address: item.address || undefined,
      latitude: item.latitude || undefined,
      longitude: item.longitude || undefined,
      fullAddress: item.fullAddress || undefined,
      province_id: item.province_id || null,
      CityId: item.CityId || null
    },
    validationSchema: createAddressSchema,
    onSubmit: (values) => {
      handleSubmit(values)
    }
  })

  return (
    <Dialog Dialog size="lg" open={modalEditOpen} handler={() => setModalEditOpen(!modalEditOpen)} className="flex flex-col items-center">
      <DialogHeader className=" flex flex-col w-full border-b border-gray-300">
        <div className="flex justify-between font-bold w-full px-4 md:px-6">
          <div></div>
          <div className="flex text-[#28302A] text-[20px] md:text-[21px] gap-3 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#00A67C" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z" />
              <path
                fill="#00A67C"
                d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"
              />
            </svg>
            <span>Edit Your Address</span>
          </div>
          <div onClick={() => setModalEditOpen(!modalEditOpen)} className="cursor-pointer rounded-md hover:bg-gray-100 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#657385" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <div className="w-[220px] md:w-[340px] lg:w-[400px] mb-7 mt-5">
          <Stepper
            activeStep={activeStep}
            isLastStep={(value) => setIsLastStep(value)}
            isFirstStep={(value) => setIsFirstStep(value)}
            lineClassName="bg-[#CAE7DF]"
            activeLineClassName="bg-[#00A67C]">
            <Step onClick={() => setActiveStep(0)} className="cursor-pointer h-9 w-9" activeClassName="bg-[#00A67C]" completedClassName="bg-[#00A67C]">
              <BiHome size={18} />
              <div className="absolute -bottom-[2rem] w-max text-centers">
                <span className={`${activeStep == 0 ? 'text-gray-800 font-semibold' : 'text-gray-500 font-medium'} text-[13px] md:text-[14px]`}>Address Details</span>
              </div>
            </Step>
            <Step
              onClick={() => setActiveStep(1)}
              className="cursor-pointer h-9 w-9 text-[#212121] bg-[#CAE7DF]"
              activeClassName="bg-[#00A67C]"
              completedClassName="bg-[#00A67C]">
              <LuMapPin size={18} />
              <div className="absolute -bottom-[2rem] w-max text-centers">
                <span className={`${activeStep == 1 ? 'text-gray-800 font-semibold' : 'text-gray-500 font-medium'} text-[13px] md:text-[14px]`}>Address Pinpoint</span>
              </div>
            </Step>
          </Stepper>
        </div>
      </DialogHeader>
      <DialogBody className="flex flex-col gap-4 items-center w-full px-4 md:px-10">
        <form onSubmit={formik.handleSubmit} className="w-full">
          {/* 1 */}
          <section id="modal-scroll" className={`${activeStep == 0 ? 'block' : 'hidden'} w-full h-[52vh] lg:h-full overflow-auto pb-2 pr-3 lg:pr-0 lg:pb-0`}>
            <div className="flex flex-col md:flex-row gap-3.5 md:gap-[2rem] w-full">
              {/* Label & Customer Name */}
              <div className="flex flex-col w-full gap-3.5">
                <div className="w-full">
                  <label className="mb-2 block text-sm font-medium text-gray-900">Label</label>
                  <input
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                    placeholder="My Home"
                    autoComplete="off"
                  />
                  {formik.touched.title && formik.errors.title ? <span className="pl-2 pb-2 text-red-500 text-[14px]">{formik.errors.title}</span> : null}
                </div>
                <div className="w-full">
                  <label className="mb-2 block text-sm font-medium text-gray-900">Customer name</label>
                  <input
                    name="customerAddressName"
                    value={formik.values.customerAddressName}
                    onChange={formik.handleChange}
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                    placeholder={customer.firstname}
                    autoComplete="off"
                  />
                  {formik.touched.customerAddressName && formik.errors.customerAddressName ? (
                    <span className="pl-2 pb-2 text-red-500 text-[14px]">{formik.errors.customerAddressName}</span>
                  ) : null}
                </div>
              </div>
              {/* Phone Number & Post code */}
              <div className="flex flex-col w-full gap-3.5">
                <div className="w-full">
                  <label className="mb-2 block text-sm font-medium text-gray-900">Phone number</label>
                  <div className="relative mt-2 text-gray-500">
                    <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                      <select className="text-sm text-gray-500 outline-none rounded-lg h-full bg-transparent">
                        <option>IDN</option>
                      </select>
                    </div>
                    <input
                      name="phoneNumber"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      type="number"
                      id="phoneNumber"
                      placeholder={customer.phoneNumber}
                      className="focus:outline-[#4ECCA3] block w-full pl-[4.5rem] pr-3 py-2.5 text-sm border border-gray-300 bg-[#FCFCFC] rounded-lg text-gray-900"
                      autoComplete="off"
                    />
                  </div>
                  {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                    <span className="pl-2 pb-2 text-red-500 text-[14px]">{formik.errors.phoneNumber}</span>
                  ) : null}
                </div>
              </div>
            </div>
            {/*  */}
            <div className="flex gap-[0.8rem] md:gap-[2rem] border-t border-gray-300 mt-5 w-full pt-5">
              {/* City and Province */}
              <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-gray-900">City</label>
                <Select
                  options={cityOptions}
                  onChange={handleCityChange}
                  placeholder="Select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderRadius: '0.5rem',
                      backgroundColor: '#FCFCFC',
                      fontSize: '14px',
                      padding: '2px',
                      borderColor: state.isFocused ? '#4ECCA3' : '#E0E0E0',
                      boxShadow: state.isFocused ? '0 0 0 0.8px #4ECCA3' : 'transparent',
                      outline: state.isFocused ? '#4ECCA3' : 'transparent',
                      '&:hover': {
                        borderColor: '#4ECCA3'
                      }
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: '14px',
                      backgroundColor: state.isFocused ? '#e6f4f0' : 'transparent',
                      cursor: 'pointer'
                    })
                  }}
                />
              </div>
              <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-gray-900">Province</label>
                <Select
                  options={provinceOptions}
                  onChange={handleProvinceChange}
                  placeholder="Select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderRadius: '0.5rem',
                      backgroundColor: '#FCFCFC',
                      fontSize: '14px',
                      padding: '2px',
                      borderColor: state.isFocused ? '#4ECCA3' : '#E0E0E0',
                      boxShadow: state.isFocused ? '0 0 0 0.8px #4ECCA3' : 'transparent',
                      outline: state.isFocused ? '#4ECCA3' : 'transparent',
                      '&:hover': {
                        borderColor: '#4ECCA3'
                      }
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: '14px',
                      backgroundColor: state.isFocused ? '#e6f4f0' : 'transparent',
                      cursor: 'pointer'
                    })
                  }}
                />
              </div>
            </div>
            <div className="w-full mt-[1rem] lg:mt-[1.2rem]">
              <label className="mb-2 block text-sm font-medium text-gray-900">Address</label>
              <textarea
                name="fullAddress"
                value={formik.values.fullAddress}
                onChange={formik.handleChange}
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                placeholder={item?.fullAddress}
                autoComplete="off"
              />
              {formik.touched.fullAddress && formik.errors.fullAddress ? <span className="pl-2 pb-2 text-red-500 text-[14px]">{formik.errors.fullAddress}</span> : null}
            </div>
          </section>

          {/* 2 */}
          {/* Map */}
          <div className={`${activeStep == 1 ? 'block' : 'hidden'} flex flex-col`}>
            <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="w-full relative">
                  <label className="mb-2 block text-sm font-medium text-gray-900">Pinpoint</label>
                  <input
                    {...getInputProps({
                      placeholder: 'Search Places ...',
                      className: 'location-search-input'
                    })}
                    className="rounded-lg bg-red h-[41px] bg-[#FCFCFC] border border-[#E0E0E0] px-3 block w-full focus:outline-[#4ECCA3] text-[15px] text-gray-900"
                  />
                  <div className="autocomplete-dropdown-container absolute z-50 border border-gray-300 rounded-sm">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion, index) => {
                      const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item'
                      const style = suggestion.active
                        ? {
                            backgroundColor: '#e6f4f0',
                            cursor: 'pointer',
                            padding: '3px 10px',
                            fontSize: '15px'
                          }
                        : {
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            padding: '3px 10px',
                            fontSize: '15px'
                          }
                      return (
                        <div
                          key={index}
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style
                          })}>
                          <span>{suggestion.description}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            <div className="flex flex-col gap-3 mt-4">
              <MapWithMarker
                coordinates={{
                  lat: coordinates.lat || 0,
                  lng: coordinates.lng || 0
                }}
                setAddress={setAddress}
                setCoordinates={setCoordinates}
              />
              <div className="flex gap-3 items-center">
                <div className="shrink-0">
                  <svg width="19" height="19" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11 3C15.4183 3 19 6.58172 19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3Z"
                      stroke="#4ECCA3"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path d="M11 3V1M19 11H21M11 19V21M3 11H1" stroke="#4ECCA3" strokeWidth="2" strokeLinecap="round" />
                    <path d="M11 15C13.2091 15 15 13.2091 15 11C15 8.79086 13.2091 7 11 7C8.79086 7 7 8.79086 7 11C7 13.2091 8.79086 15 11 15Z" fill="#4ECCA3" />
                  </svg>
                </div>
                <div>
                  <span className="text-gray-600 font-normal mt-2 text-[15px]">
                    {address}{' '}
                    <span className="text-[14px] text-gray-500">
                      {' '}
                      ({coordinates.lat}, {coordinates.lng}).
                    </span>{' '}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Button Group */}
          <div className="mt-7 flex justify-between gap-3 items-center">
            <div
              onClick={handlePrev}
              disabled={isFirstStep}
              className="flex gap-1 items-center p-2 rounded-lg w-max h-max hover:bg-gray-100 cursor-pointer transition ease-in-out delay-100">
              <GrPrevious size={20} className={`${activeStep == 0 ? 'hidden' : 'block'} text-[#657385]`} />
            </div>
            <div className={`${activeStep == 0 ? 'hidden' : 'block'} flex gap-3`}>
              {/* <button
                                onClick={() => setModalEditOpen(!modalEditOpen)}
                                className="shadow-sm rounded-xl px-5 py-2 border border-[#E5E7EB] text-[15px] font-medium text-gray-600 transition delay-100 ease-in-out hover:bg-gray-100"
                            >
                                Cancel
                            </button> */}
              <button
                type="submit"
                className="rounded-xl bg-[#00a67c] h-[44px] w-[138px] text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D] ">
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <SyncLoader color="white" size={9} />
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
            <div
              onClick={handleNext}
              disabled={isLastStep}
              className="flex gap-1 items-center p-2 rounded-lg w-max h-max hover:bg-gray-100 cursor-pointer transition ease-in-out delay-100">
              <GrNext size={20} className={`${activeStep == 1 ? 'hidden' : 'block'} text-[#657385]`} />
            </div>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  )
}

ModalAddressEdit.propTypes = {
  modalEditOpen: PropTypes.bool.isRequired,
  setModalEditOpen: PropTypes.func.isRequired,
  fetchUserAddressData: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    customerAddressName: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    fullAddress: PropTypes.string.isRequired,
    province_id: PropTypes.number.isRequired,
    CityId: PropTypes.number.isRequired
  })
}
