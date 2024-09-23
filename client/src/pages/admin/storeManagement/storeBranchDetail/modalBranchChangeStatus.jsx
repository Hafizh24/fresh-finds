import { Dialog, DialogBody } from '@material-tailwind/react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { SyncLoader } from 'react-spinners'
import { useState } from 'react'

import axios from '../../../../api/axios'

export const ModalBranchChangeStatus = ({ modalStatusOpen, setModalStatusOpen, branchDetailData, fetchBranchDetailData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const token = localStorage.getItem('admtoken')

  const handleChangeStatus = async () => {
    try {
      setIsLoading(true)

      const response = await axios.patch(`branches/change-status/${branchDetailData.id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchBranchDetailData()
      setIsLoading(false)
      toast.success(response.data.message, {
        position: 'top-center'
      })
      setModalStatusOpen(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response.data.message, {
        position: 'top-center'
      })
    }
  }

  return (
    <>
      <Dialog size="sm" open={modalStatusOpen} handler={() => setModalStatusOpen(!modalStatusOpen)} className="px-3 pb-3 pt-5 flex flex-col items-center">
        {/* #2bda6c */}
        <DialogBody className="flex flex-col gap-1 items-center">
          <div className="mb-3 flex items-center justify-center p-7 rounded-full bg-[#dcfce7]">
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 15 15">
              <path
                fill="#2bda6c"
                fillRule="evenodd"
                d="M1.903 7.297c0 3.044 2.207 5.118 4.686 5.547a.521.521 0 1 1-.178 1.027C3.5 13.367.861 10.913.861 7.297c0-1.537.699-2.745 1.515-3.663c.585-.658 1.254-1.193 1.792-1.602H2.532a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V2.686l-.001.002c-.572.43-1.27.957-1.875 1.638c-.715.804-1.253 1.776-1.253 2.97m11.108.406c0-3.012-2.16-5.073-4.607-5.533a.521.521 0 1 1 .192-1.024c2.874.54 5.457 2.98 5.457 6.557c0 1.537-.699 2.744-1.515 3.663c-.585.658-1.254 1.193-1.792 1.602h1.636a.5.5 0 1 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 1 1 1 0v1.845h.002c.571-.432 1.27-.958 1.874-1.64c.715-.803 1.253-1.775 1.253-2.97"
                clipRule="evenodd"
              />
            </svg>{' '}
          </div>
          <h3 className="mb-1 text-[21px] md:text-[24px] text-[#28302A] font-bold text-center">Change Branch Status</h3>
          <span className="text-[15px] text-gray-600 md:w-[80%] text-center font-normal">
            {!branchDetailData?.isActive ? (
              <>
                Are you sure you would like to change this branch status to
                <span className="font-semibold text-gray-600"> Active? </span>
              </>
            ) : (
              <>
                Are you sure you would like to <span className="font-semibold text-gray-600"> switch off </span> this branch status?
              </>
            )}
          </span>
          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={() => setModalStatusOpen(false)}
              className="shadow-sm rounded-lg px-5 py-2 border border-[#E5E7EB] text-[15px] font-medium text-gray-600 transition delay-100 ease-in-out hover:bg-gray-100">
              Cancel
            </button>
            <button
              onClick={handleChangeStatus}
              className="rounded-lg bg-[#00a67c] w-[98.5px] h-[44.375px] text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D] ">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <SyncLoader color="white" size={9} />
                </div>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  )
}

ModalBranchChangeStatus.propTypes = {
  modalStatusOpen: PropTypes.bool.isRequired,
  setModalStatusOpen: PropTypes.func.isRequired,
  fetchBranchDetailData: PropTypes.func.isRequired,
  branchDetailData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired
  })
}
