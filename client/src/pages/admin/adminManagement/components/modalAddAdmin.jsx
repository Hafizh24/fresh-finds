/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { Button, Dialog, Card, CardBody, CardFooter, Typography, Input } from '@material-tailwind/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { SyncLoader } from 'react-spinners'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'

import axios from '../../../../api/axios'

export default function ModalAddAdmin({ openModalAdd, handleOpenAdd, handleRefreshTable }) {
  const token = localStorage.getItem('admtoken')
  const [isLoading, setIsLoading] = useState(false)

  const RegisterSchema = Yup.object({
    name: Yup.string().required("Name can't be empty"),
    username: Yup.string().required("Username can't be empty"),
    email: Yup.string().required('Email is required').email('Invalid email format')
  })

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await axios.post('admins/', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsLoading(false)
      toast.success(response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
      handleRefreshTable()
      handleClose()
      getAdminData(currentPage)
    } catch (err) {
      setIsLoading(false)
      toast.error(err.response.data.message, { position: 'top-center' })
    }
  }

  const handleClose = () => {
    handleOpenAdd()
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, action) => {
      handleSubmit(values)
      action.resetForm()
    }
  })

  return (
    <>
      <Dialog size="xs" open={openModalAdd} handler={handleOpenAdd} dismiss={{ outsidePress: () => handleClose() }} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={formik.handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Add Admin
              </Typography>
              <Typography className="-mb-2" variant="h6">
                Name
              </Typography>
              <Input
                name="name"
                autoComplete="off"
                label="Name"
                size="lg"
                onChange={formik.handleChange}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
              />
              {formik.touched.name && formik.errors.name ? <div className=" text-red-900 text-xs">{formik.errors.name}</div> : null}
              <Typography className="-mb-2" variant="h6">
                Username
              </Typography>
              <Input
                name="username"
                autoComplete="off"
                label="Username"
                size="lg"
                onChange={formik.handleChange}
                value={formik.values.username}
                error={formik.touched.username && Boolean(formik.errors.username)}
              />
              {formik.touched.username && formik.errors.username ? <div className=" text-red-900 text-xs">{formik.errors.username}</div> : null}
              <Typography className="-mb-2" variant="h6">
                Email
              </Typography>
              <Input
                name="email"
                autoComplete="off"
                label="Email"
                size="lg"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
              />
              {formik.touched.email && formik.errors.email ? <div className=" text-red-900 text-xs">{formik.errors.email}</div> : null}
            </CardBody>
            <CardFooter className="pt-0">
              <div className="flex flex-row gap-3">
                <Button disabled={isLoading} onClick={handleClose} variant="text" fullWidth>
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit" style={{ backgroundColor: '#41907a' }} variant="filled" fullWidth>
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <SyncLoader color="#c0cac2" size={9} />
                    </div>
                  ) : (
                    <>Add</>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  )
}
