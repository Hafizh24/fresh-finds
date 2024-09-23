/* eslint-disable react/prop-types */
import { Button, Dialog, Card, CardBody, CardFooter, Typography } from '@material-tailwind/react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import axios from '../../../../api/axios'

export default function ModalDelete({ openDelete, handleDelete, getAdminData, clickedData, currentPage }) {
  const token = localStorage.getItem('admtoken')

  const handleSubmit = async (id) => {
    try {
      const response = await axios.delete(`admins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success(response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
      handleDelete()
      getAdminData(currentPage)
    } catch (err) {
      toast.error(err.response.data.message, { position: 'top-center' })
    }
  }

  const handleClose = () => {
    handleDelete()
  }

  return (
    <>
      <Dialog size="xs" open={openDelete} handler={handleDelete} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Delete {clickedData?.name}
            </Typography>
            <Typography className="font-normal">Warning: This action will permanently delete the selected data. Are you sure you want to proceed?</Typography>
          </CardBody>
          <CardFooter className="pt-0">
            <div className="flex flex-row gap-3">
              <Button onClick={handleClose} variant="text" fullWidth>
                Cancel
              </Button>
              <Button onClick={() => handleSubmit(clickedData?.id)} color="red" variant="filled" fullWidth>
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  )
}
