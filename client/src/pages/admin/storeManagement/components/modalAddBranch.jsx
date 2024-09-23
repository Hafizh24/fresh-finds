// import { MapWithMarker } from "../../../userDashboard/components/mapWithMarker";
// import { Dialog, DialogBody, DialogHeader, Step, Stepper } from "@material-tailwind/react";
// import { useFormik } from 'formik';
// import { useEffect, useState } from "react";
// import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
// import * as Yup from 'yup';
// import { SyncLoader } from "react-spinners";
// import PropTypes from 'prop-types';
// import axios from "../../../../api/axios";
// import { toast } from 'react-toastify';
// import { GrNext, GrPrevious } from "react-icons/gr";
// import { BiHome } from "react-icons/bi";
// import { LuMapPin } from "react-icons/lu";
// import { IoIosWarning } from "react-icons/io";
// import Select from 'react-select'

// export const ModalAddBranch = ({ modalAddOpen, handleModalAddOpen }) => {
//     const token = localStorage.getItem('admtoken');

//     const [isLoading, setIsLoading] = useState(false);
//     const [activeStep, setActiveStep] = useState(0);
//     const [isLastStep, setIsLastStep] = useState(false);
//     const [isFirstStep, setIsFirstStep] = useState(false);

//     const [cityOptions, setCityOptions] = useState([]);
//     const [provinceOptions, setProvinceOptions] = useState([])
//     const [adminOptions, setAdminOptions] = useState([])

//     const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1)
//     const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1)

//     const handleSubmit = async () => {
//         try {
//             setIsLoading(true);
//             const dataToSend = {
//                 name: formik.values.name,
//                 AdminId: formik.values.AdminId,
//                 contactNumber: formik.values.contactNumber,
//                 address: address,
//                 longitude: coordinates.lng,
//                 latitude: coordinates.lat,
//                 fullAddress: formik.values.fullAddress,
//                 CityId: formik.values.CityId,
//                 province_id: formik.values.province_id
//             };

//             await addBranchSchema.validate(dataToSend);

//             const response = await axios.post(`branches/`,
//                 dataToSend,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             )

//             setIsLoading(false);
//             toast.success(response.data.message, {
//                 position: 'top-center',
//             });
//             handleModalAddOpen()
//             formik.resetForm();

//         } catch (error) {
//             console.log(error);
//             setIsLoading(false)
//             // if (error.response.data.message.includes("null")) {
//             //     toast.error(`City, Province, or Pinpoint can't be empty`, {
//             //         position: 'top-center',
//             //     });
//             //     return
//             // }
//             toast.error(error.response.data.message, {
//                 position: 'top-center'
//             })
//         }
//     }

//     const [address, setAddress] = useState('');
//     const [coordinates, setCoordinates] = useState({
//         lat: null,
//         lng: null,
//     });

//     const handleSelect = async (value) => {
//         const results = await geocodeByAddress(value);
//         const ll = await getLatLng(results[0]);
//         setAddress(value);
//         setCoordinates(ll);
//     };

//     const fetchCities = async () => {
//         try {
//             const response = await axios('cities/');
//             const cityData = response.data.result.map((city) => ({
//                 value: city.city_id,
//                 label: city.city
//             }));
//             setCityOptions(cityData);
//         } catch (error) {
//             console.error('Error fethcing cities', error);
//         }
//     }

//     const fetchProvinces = async () => {
//         try {
//             const response = await axios('provinces/');
//             const provinceData = response.data.result.map((province) => ({
//                 value: province.province_id,
//                 label: province.province

//             }))
//             setProvinceOptions(provinceData)
//         } catch (error) {
//             console.error('Error fetching provinces', error);
//         }
//     }

//     const fetchAdminData = async () => {
//         try {
//             const response = await axios.get('admins/no-pagination', {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             const adminData = response.data.result.map((admin) => ({
//                 value: admin.id,
//                 label: admin.name
//             }));
//             setAdminOptions(adminData)
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const handleCityChange = (selectedOption) => {
//         formik.setFieldValue('CityId', selectedOption.value)
//     }

//     const handleProvinceChange = (selectedOption) => {
//         formik.setFieldValue('province_id', selectedOption.value)
//     }

//     const handleAdminChange = (value) => { formik.setFieldValue('AdminId', value) }

//     const addBranchSchema = Yup.object().shape({
//         name: Yup.string().required("Branch name can't be empty"),
//         AdminId: Yup.number().required("You need to select an admin"),
//         contactNumber: Yup.string().required("Contact number can't be empty"),
//         address: Yup.string(),
//         fullAddress: Yup.string().required("Address can't be empty")
//     });

//     const formik = useFormik({
//         initialValues: {
//             name: '',
//             AdminId: '',
//             contactNumber: '',
//             latitude: null,
//             longitude: null,
//             fullAddress: '',
//             CityId: null,
//             province_id: null
//         },
//         validationSchema: addBranchSchema,
//         onSubmit: (values) => {
//             handleSubmit(values);
//         },
//     });

//     useEffect(() => {
//         fetchAdminData();
//         fetchCities();
//         fetchProvinces();
//     }, [])

//     return (
//         <Dialog
//             Dialog
//             size="lg"
//             open={modalAddOpen}
//             handler={() => handleModalAddOpen()}
//             className="flex flex-col items-center"
//         >
//             <DialogHeader className=" flex flex-col w-full border-b border-gray-300">
//                 <div className="flex justify-between font-bold w-full px-4 md:px-6">
//                     <div></div>
//                     <div className="flex text-[#28302A] text-[20px] md:text-[21px] gap-3 items-center">
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="26"
//                             height="26"
//                             viewBox="0 0 24 24"
//                             className="mb-[0.1rem]"
//                         >
//                             <path
//                                 fill="#00A67C"
//                                 d="M16.53 11.16c1.23-.26 2.4-.18 3.47.14V10c0-.63-.3-1.22-.8-1.6l-6-4.5a2.01 2.01 0 0 0-2.4 0l-6 4.5c-.5.38-.8.97-.8 1.6v9c0 1.1.9 2 2 2h5.68a6.915 6.915 0 0 1-.55-4.35c.52-2.72 2.69-4.91 5.4-5.49"
//                             />
//                             <path
//                                 fill="#7FE2C9"
//                                 d="M18 13c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m3 5.5h-2.5V21h-1v-2.5H15v-1h2.5V15h1v2.5H21z"
//                             />
//                         </svg>
//                         <span>Add New Branch</span>
//                     </div>
//                     <div
//                         onClick={() => handleModalAddOpen()}
//                         className="cursor-pointer rounded-md hover:bg-gray-100 p-1"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             strokeWidth={1.5}
//                             stroke="#657385"
//                             className="w-6 h-6"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 d="M6 18 18 6M6 6l12 12"
//                             />
//                         </svg>
//                     </div>
//                 </div>
//                 <div className="w-[220px] md:w-[340px] lg:w-[400px] mb-7 mt-5">
//                     <Stepper
//                         activeStep={activeStep}
//                         isLastStep={(value) => setIsLastStep(value)}
//                         isFirstStep={(value) => setIsFirstStep(value)}
//                         lineClassName="bg-[#CAE7DF]"
//                         activeLineClassName="bg-[#00A67C]"
//                     >
//                         <Step
//                             onClick={() => setActiveStep(0)}
//                             className="cursor-pointer h-9 w-9"
//                             activeClassName="bg-[#00A67C]"
//                             completedClassName="bg-[#00A67C]"
//                         >
//                             <BiHome size={18} />
//                             <div className="absolute -bottom-[2rem] w-max text-centers">
//                                 <span
//                                     className={`${activeStep == 0 ? 'text-gray-800 font-semibold' : 'text-gray-500 font-medium'
//                                         } text-[13px] md:text-[14px]`}
//                                 >
//                                     Branch Details
//                                 </span>
//                             </div>
//                         </Step>
//                         <Step
//                             onClick={() => setActiveStep(1)}
//                             className="cursor-pointer h-9 w-9 text-[#212121] bg-[#CAE7DF] text-white"
//                             activeClassName="bg-[#00A67C]"
//                             completedClassName="bg-[#00A67C]"
//                         >
//                             <LuMapPin size={18} />
//                             <div className="absolute -bottom-[2rem] w-max text-centers">
//                                 <span
//                                     className={`${activeStep == 1 ? 'text-gray-800 font-semibold' : 'text-gray-500 font-medium'
//                                         } text-[13px] md:text-[14px]`}
//                                 >
//                                     Branch Pinpoint
//                                 </span>
//                             </div>
//                         </Step>
//                     </Stepper>
//                 </div>
//             </DialogHeader>
//             <DialogBody className="flex flex-col gap-4 items-center w-full px-4 md:px-10">
//                 <form onSubmit={formik.handleSubmit} className="w-full">
//                     {/* 1 */}
//                     <section className={`${activeStep == 0 ? "block" : "hidden"} w-full`}>
//                         <div className="flex flex-col md:flex-row gap-3.5 md:gap-[2rem] w-full">
//                             {/* Branch name & Admin */}
//                             <div className="flex flex-col w-full gap-3.5">
//                                 <div className="w-full">
//                                     <label className="mb-2 block text-sm font-medium text-gray-900">
//                                         Branch Name
//                                     </label>
//                                     <input
//                                         name="name"
//                                         value={formik.values.name}
//                                         onChange={formik.handleChange}
//                                         type="text"
//                                         className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
//                                         placeholder="New Branch"
//                                         autoComplete="off"
//                                     />
//                                     {formik.touched.name && formik.errors.name ? (
//                                         <span className="pl-[0.1rem] pb-2 text-red-500 text-[14px]">
//                                             {formik.errors.name}
//                                         </span>
//                                     ) : null}
//                                 </div>
//                                 <div className="w-full">
//                                     <label className="mb-2 block text-sm font-medium text-gray-900">
//                                         Admin
//                                     </label>
//                                     <Select
//                                         options={adminOptions}
//                                         onChange={handleAdminChange}
//                                         placeholder="Select"
//                                         styles={{
//                                             control: (provided, state) => ({
//                                                 ...provided,
//                                                 borderRadius: '0.5rem',
//                                                 backgroundColor: '#FCFCFC',
//                                                 fontSize: '14px',
//                                                 padding: '2px',
//                                                 borderColor: state.isFocused ? '#4ECCA3' : '#E0E0E0',
//                                                 boxShadow: state.isFocused ? '0 0 0 0.8px #4ECCA3' : 'transparent',
//                                                 outline: state.isFocused ? '#4ECCA3' : 'transparent',
//                                                 '&:hover': {
//                                                     borderColor: '#4ECCA3',
//                                                 }
//                                             }),
//                                             option: (provided, state) => ({
//                                                 ...provided,
//                                                 fontSize: '14px',
//                                                 backgroundColor: state.isFocused ? '#e6f4f0' : 'transparent',
//                                                 cursor: 'pointer'
//                                             }),
//                                         }}
//                                     />
//                                 </div>
//                             </div>
//                             {/* Phone Number */}
//                             <div className="flex flex-col w-full gap-3.5">
//                                 <div className="w-full">
//                                     <label className="mb-2 block text-sm font-medium text-gray-900">
//                                         Contact Number
//                                     </label>
//                                     <div className="relative mt-2 text-gray-500">
//                                         <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
//                                             <select className="text-sm text-gray-500 outline-none rounded-lg h-full bg-transparent">
//                                                 <option>IDN</option>
//                                             </select>
//                                         </div>
//                                         <input
//                                             name="contactNumber"
//                                             value={formik.values.contactNumber}
//                                             onChange={formik.handleChange}
//                                             type="number"
//                                             id="contactNumber"
//                                             placeholder="022"
//                                             className="focus:outline-[#4ECCA3] block w-full pl-[4.5rem] pr-3 py-2.5 text-sm border border-gray-300 bg-[#FCFCFC] rounded-lg text-gray-900"
//                                             autoComplete="off"
//                                         />
//                                     </div>
//                                     {formik.touched.contactNumber && formik.errors.contactNumber ? (
//                                         <span className="pl-2 pb-2 text-red-500 text-[14px]">
//                                             {formik.errors.contactNumber}
//                                         </span>
//                                     ) : null}
//                                 </div>
//                             </div>
//                         </div>
//                         {/*  */}
//                         <div className="flex gap-[0.8rem] md:gap-[2rem] border-t border-gray-300 mt-5 w-full pt-5">
//                             {/* City and Province */}
//                             <div className="w-full">
//                                 <label className="mb-2 block text-sm font-medium text-gray-900">
//                                     City
//                                 </label>
//                                 <Select
//                                     options={cityOptions}
//                                     onChange={handleCityChange}
//                                     placeholder="Select"
//                                     styles={{
//                                         control: (provided, state) => ({
//                                             ...provided,
//                                             borderRadius: '0.5rem',
//                                             backgroundColor: '#FCFCFC',
//                                             fontSize: '14px',
//                                             padding: '2px',
//                                             borderColor: state.isFocused ? '#4ECCA3' : '#E0E0E0',
//                                             boxShadow: state.isFocused ? '0 0 0 0.8px #4ECCA3' : 'transparent',
//                                             outline: state.isFocused ? '#4ECCA3' : 'transparent',
//                                             '&:hover': {
//                                                 borderColor: '#4ECCA3',
//                                             }
//                                         }),
//                                         option: (provided, state) => ({
//                                             ...provided,
//                                             fontSize: '14px',
//                                             backgroundColor: state.isFocused ? '#e6f4f0' : 'transparent',
//                                             cursor: 'pointer'
//                                         }),
//                                     }}
//                                 />
//                             </div>
//                             <div className="w-full">
//                                 <label className="mb-2 block text-sm font-medium text-gray-900">
//                                     Province
//                                 </label>
//                                 <Select
//                                     options={provinceOptions}
//                                     onChange={handleProvinceChange}
//                                     placeholder="Select"
//                                     styles={{
//                                         control: (provided, state) => ({
//                                             ...provided,
//                                             borderRadius: '0.5rem',
//                                             backgroundColor: '#FCFCFC',
//                                             fontSize: '14px',
//                                             padding: '2px',
//                                             borderColor: state.isFocused ? '#4ECCA3' : '#E0E0E0',
//                                             boxShadow: state.isFocused ? '0 0 0 0.8px #4ECCA3' : 'transparent',
//                                             outline: state.isFocused ? '#4ECCA3' : 'transparent',
//                                             '&:hover': {
//                                                 borderColor: '#4ECCA3',
//                                             }
//                                         }),
//                                         option: (provided, state) => ({
//                                             ...provided,
//                                             fontSize: '14px',
//                                             backgroundColor: state.isFocused ? '#e6f4f0' : 'transparent',
//                                             cursor: 'pointer',
//                                         }),
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                         <div className="w-full mt-[1rem] lg:mt-[1.2rem]">
//                             <label className="mb-2 block text-sm font-medium text-gray-900">
//                                 Address
//                             </label>
//                             <textarea
//                                 name="fullAddress"
//                                 value={formik.values.fullAddress}
//                                 onChange={formik.handleChange}
//                                 type="text"
//                                 className="block w-full rounded-lg border border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
//                                 placeholder="Branch address..."
//                                 autoComplete="off"
//                             />
//                             {formik.touched.fullAddress && formik.errors.fullAddress ? (
//                                 <span className="pl-[0.1rem] pb-1 text-red-500 text-[14px]">
//                                     {formik.errors.fullAddress}
//                                 </span>
//                             ) : null}
//                         </div>
//                     </section>
//                     {/* 2 */}
//                     {/* Map */}
//                     <div className={`${activeStep == 1 ? "block" : "hidden"} flex flex-col`}>
//                         <PlacesAutocomplete
//                             value={address}
//                             onChange={setAddress}
//                             onSelect={handleSelect}
//                         >
//                             {({
//                                 getInputProps,
//                                 suggestions,
//                                 getSuggestionItemProps,
//                                 loading,
//                             }) => (
//                                 <div className="w-full relative">
//                                     <label className="mb-2 block text-sm font-medium text-gray-900">
//                                         Pinpoint
//                                     </label>
//                                     <input
//                                         {...getInputProps({
//                                             placeholder: 'Search Places ...',
//                                             className: 'location-search-input',
//                                         })}
//                                         className="rounded-lg bg-red h-[41px] bg-[#FCFCFC] border border-[#E0E0E0] px-3 block w-full focus:outline-[#4ECCA3] text-[15px] text-gray-900"
//                                     />
//                                     <div className="autocomplete-dropdown-container absolute z-50 border border-gray-300 rounded-sm">
//                                         {loading && <div>Loading...</div>}
//                                         {suggestions.map((suggestion, index) => {
//                                             const className = suggestion.active
//                                                 ? 'suggestion-item--active'
//                                                 : 'suggestion-item';
//                                             const style = suggestion.active
//                                                 ? {
//                                                     backgroundColor: '#e6f4f0',
//                                                     cursor: 'pointer',
//                                                     padding: '3px 10px',
//                                                     fontSize: '15px',
//                                                 }
//                                                 : {
//                                                     backgroundColor: '#ffffff',
//                                                     cursor: 'pointer',
//                                                     padding: '3px 10px',
//                                                     fontSize: '15px',
//                                                 };
//                                             return (
//                                                 <div
//                                                     key={index}
//                                                     {...getSuggestionItemProps(suggestion, {
//                                                         className,
//                                                         style,
//                                                     })}
//                                                 >
//                                                     <span>{suggestion.description}</span>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             )}
//                         </PlacesAutocomplete>
//                         <div className="flex flex-col gap-3 mt-4">
//                             <MapWithMarker
//                                 coordinates={{
//                                     lat: coordinates.lat || 0,
//                                     lng: coordinates.lng || 0,
//                                 }}
//                                 setAddress={setAddress}
//                                 setCoordinates={setCoordinates}
//                             />
//                             <div className="flex gap-3 items-center">
//                                 <div className="shrink-0">
//                                     <svg
//                                         width="19"
//                                         height="19"
//                                         viewBox="0 0 22 22"
//                                         fill="none"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                         <path
//                                             d="M11 3C15.4183 3 19 6.58172 19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3Z"
//                                             stroke="#4ECCA3"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                         />
//                                         <path
//                                             d="M11 3V1M19 11H21M11 19V21M3 11H1"
//                                             stroke="#4ECCA3"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                         />
//                                         <path
//                                             d="M11 15C13.2091 15 15 13.2091 15 11C15 8.79086 13.2091 7 11 7C8.79086 7 7 8.79086 7 11C7 13.2091 8.79086 15 11 15Z"
//                                             fill="#4ECCA3"
//                                         />
//                                     </svg>
//                                 </div>
//                                 <div>
//                                     <span className="text-gray-600 font-normal mt-2 text-[15px]">
//                                         {address}{' '}
//                                         <span className="text-[14px] text-gray-500">
//                                             {' '}
//                                             ({coordinates.lat}, {coordinates.lng}).
//                                         </span>{' '}
//                                     </span>
//                                 </div>
//                             </div>
//                             {Object.keys(formik.errors).length > 0 && (
//                                 <div className="w-full flex items-center gap-2 rounded-lg bg-[#FDE3E4] text-[14px] py-2 px-3 text-[#EC324E] shadow-sm">
//                                     <IoIosWarning size={15} />
//                                     <span className="font-medium">You must complete all the inputs</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Button Group */}
//                     <div className="mt-7 flex justify-between gap-3 items-center">
//                         <div
//                             onClick={handlePrev} disabled={isFirstStep}
//                             className="flex gap-1 items-center p-2 rounded-lg w-max h-max hover:bg-gray-100 cursor-pointer transition ease-in-out delay-100"
//                         >
//                             <GrPrevious size={20} className={`${activeStep == 0 ? 'hidden' : 'block'} text-[#657385]`} />
//                         </div>
//                         <div className={`${activeStep == 0 ? 'hidden' : 'block'} flex gap-3`}>
//                             <button
//                                 onClick={handleModalAddOpen}
//                                 className="shadow-sm rounded-xl px-5 py-2 border border-[#E5E7EB] text-[15px] font-medium text-gray-600 transition delay-100 ease-in-out hover:bg-gray-100"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="rounded-xl bg-[#00a67c] h-[44px] w-[138px] text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D] "
//                             >
//                                 {isLoading ? (
//                                     <div className="flex justify-center items-center">
//                                         <SyncLoader color="white" size={9} />
//                                     </div>
//                                 ) : (
//                                     'Save Address'
//                                 )}
//                             </button>
//                         </div>
//                         <div
//                             onClick={handleNext} disabled={isLastStep}
//                             className="flex gap-1 items-center p-2 rounded-lg w-max h-max hover:bg-gray-100 cursor-pointer transition ease-in-out delay-100"
//                         >
//                             <GrNext size={20} className={`${activeStep == 1 ? 'hidden' : 'block'} text-[#657385]`} />
//                         </div>
//                     </div>
//                 </form>
//             </DialogBody>
//         </Dialog>
//     )
// }

// ModalAddBranch.propTypes = {
//     modalAddOpen: PropTypes.bool.isRequired,
//     handleModalAddOpen: PropTypes.func.isRequired,
// };
