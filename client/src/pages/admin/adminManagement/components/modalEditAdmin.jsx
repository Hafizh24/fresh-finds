/* eslint-disable react/prop-types */
import { Button, Dialog, Card, CardBody, CardFooter, Typography, Input } from '@material-tailwind/react'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import axios from '../../../../api/axios'

export default function ModalEditAdmin({ openModalEdit, handleEdit, handleRefreshTable, clickedData }) {
  const token = localStorage.getItem('admtoken')
  const handleClose = () => {
    formik.resetForm()
    handleEdit()
  }
  const handleSubmit = async (data) => {
    data.id = clickedData.id
    try {
      const response = await axios.patch('admins/', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      handleRefreshTable()
      handleClose()
      toast.success(response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
    } catch (err) {
      toast.error(err.response.data.message, { position: 'top-center' })
    }
  }
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: ''
    },
    onSubmit: (values, action) => {
      handleSubmit(values)
      action.resetForm()
    }
  })
  return (
    <>
      <Dialog size="xs" open={openModalEdit} handler={handleEdit} dismiss={{ outsidePress: () => handleClose() }} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={formik.handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Edit Admin {clickedData?.name}
              </Typography>
              <Typography className="-mb-2" variant="h6">
                Name
              </Typography>
              <Input name="name" autoComplete="off" label={clickedData?.name} size="lg" onChange={formik.handleChange} value={formik.values.name} />

              <Typography className="-mb-2" variant="h6">
                Username
              </Typography>
              <Input name="username" autoComplete="off" label={clickedData?.username} size="lg" onChange={formik.handleChange} value={formik.values.username} />

              <Typography className="-mb-2" variant="h6">
                Email
              </Typography>
              <Input name="email" autoComplete="off" label={clickedData?.email} size="lg" onChange={formik.handleChange} value={formik.values.email} />
              <Typography className="-mb-2" variant="h6">
                Password
              </Typography>
              <Input name="password" type="password" autoComplete="off" label="Password" size="lg" onChange={formik.handleChange} value={formik.values.password} />
            </CardBody>
            <CardFooter className="pt-0">
              <div className="flex flex-row gap-3">
                <Button onClick={handleClose} variant="text" fullWidth>
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#41907a' }} variant="filled" fullWidth>
                  Update
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  )
}
