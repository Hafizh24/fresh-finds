import { Dialog, DialogBody } from '@material-tailwind/react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { SyncLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'

import axios from '../../../api/axios'
import avaDummy from '../../../assets/userDashboard/ava-dummy.png'
import { updateProfilePicture } from '../../../redux/customerSlice'

export const ModalUpdateImage = ({ modalImgOpen, setModalImgOpen }) => {
  const customer = useSelector((state) => state.customer.value)
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)

    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleFileUpload = async () => {
    if (selectedFile) {
      const allowedExt = ['jpg', 'jpeg', 'png', 'gif']
      const fileExt = selectedFile.name.split('.').pop().toLowerCase()

      if (!allowedExt.includes(fileExt)) {
        toast.error('Invalid file format. Allowed formats: jpg, jpeg, png, gif', {
          position: 'top-center'
        })
        return
      }

      const maxSizeMB = 1
      const maxSizeBytes = maxSizeMB * 1024 * 1024

      if (selectedFile.size > maxSizeBytes) {
        toast.error(`File size exceeds the maximum limit of ${maxSizeMB}MB`, {
          position: 'top-center'
        })
        return
      }

      const formData = new FormData()
      formData.append('profile_picture', selectedFile)

      try {
        setIsLoading(true)
        const response = await axios.patch('customer/img-update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })

        dispatch(updateProfilePicture(response.data.profile_picture))

        toast.success('Profile picture updated!', {
          position: 'top-center'
        })
        setIsLoading(false)
        setModalImgOpen(false)
        location.reload()
      } catch (error) {
        setIsLoading(false)
        console.log('Error uploading file', error)
      }
    } else {
      toast.error('You need to select a file', {
        position: 'top-center'
      })
    }
  }

  return (
    <Dialog size="xs" open={modalImgOpen} handler={() => setModalImgOpen(!modalImgOpen)} className="">
      <DialogBody className="flex flex-col gap-1 items-center">
        <div className="flex items-center w-full mb-4">
          <h3 className="ml-auto text-[20px] md:text-[21px] text-[#28302A] font-bold text-center">Update Profile Picture</h3>
          <div onClick={() => setModalImgOpen(!modalImgOpen)} className="ml-auto cursor-pointer rounded-md hover:bg-gray-100 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#657385" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <img
          src={previewUrl || (customer.profile_picture ? customer.profile_picture : avaDummy)}
          alt=""
          className="h-[140px] w-[140px] lg:h-[160px] lg:w-[160px] rounded-full object-cover mb-3 mt-1"></img>
        <div className="w-full mt-2">
          <input
            id="file_upload"
            type="file"
            className="file:cursor-pointer text-gray-700 mt-2 block w-[15rem] text-sm file:mr-2 lg:file:mr-4 file:rounded-full file:border-0 file:bg-[#E1F5EF] file:py-1 file:px-4 file:text-sm file:font-medium file:text-[#3A826E] hover:file:bg-[#a8e2d0] focus:outline-none disabled:opacity-60"
            onChange={handleFileChange}
          />
        </div>
        <div className="w-full text-[#989D9E] text-[13.5px] font-normal mb-2 mt-[1px] pl-1 whitespace-pre">jpg, jpeg, png, or gif (Max 1 mb)</div>
        <button
          onClick={handleFileUpload}
          className="rounded-full w-full bg-[#00a67c] h-[40px] text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D] ">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <SyncLoader color="white" size={9} />
            </div>
          ) : (
            'Save changes'
          )}
        </button>
      </DialogBody>
    </Dialog>
  )
}

ModalUpdateImage.propTypes = {
  modalImgOpen: PropTypes.bool.isRequired,
  setModalImgOpen: PropTypes.func.isRequired
}
