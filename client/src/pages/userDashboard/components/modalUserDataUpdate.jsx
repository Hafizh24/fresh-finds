import { Dialog, DialogBody, DialogFooter } from '@material-tailwind/react'
import PropTypes from 'prop-types'

import emailBanner from '../../../assets/userRegister/email-verify-2.2.png'

export const ModalUserDataUpdate = ({ modalUpdateOpen, responseMessage }) => {
  const handleClick = () => {
    location.reload()
  }

  return (
    <>
      <Dialog open={modalUpdateOpen} size="sm" className="px-3 pb-3 pt-5 flex flex-col items-center">
        <DialogBody className="flex flex-col gap-4 items-center">
          <div className="flex items-center justify-center">
            <img src={emailBanner} alt="" className="h-[9rem]" />
          </div>
          <h3 className="text-[22px] md:text-[24px] text-[#28302A] font-bold text-center">Account Details Update</h3>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-[15px] text-gray-600 md:w-[90%] text-center font-normal">{responseMessage}</span>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClick}
              className="rounded-full bg-[#00a67c] px-6 py-2.5 text-[15px] font-semibold text-white transition delay-100 ease-in-out hover:bg-[#00916D] ">
              Ok, got it!
            </button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  )
}

ModalUserDataUpdate.propTypes = {
  modalUpdateOpen: PropTypes.bool,
  setModalUpdateOpen: PropTypes.func
}
