/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Dialog, Card, CardBody, CardFooter, Typography, Input } from '@material-tailwind/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import { SyncLoader } from 'react-spinners'

import axios from '../../../api/axios'

export default function ModalForgotPassword({ open, handleOpen }) {
  const [isLoading, setIsLoading] = useState(false)

  const checkAccountSchema = Yup.object({
    email: Yup.string().email('Invalid address format').required('Email is required')
  })

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`admins/forgot-password?email=${data.email}`)
      setIsLoading(false)
      toast.success(response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
    } catch (err) {
      setIsLoading(false)
      toast.error(err.response.data.message, { position: 'top-center' })
    }
  }

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: checkAccountSchema,
    onSubmit: (values, action) => {
      handleSubmit(values)
      action.resetForm()
    }
  })

  return (
    <>
      <Dialog size="xs" open={open} handler={handleOpen} className="bg-transparent shadow-none">
        <form onSubmit={formik.handleSubmit}>
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Find Your Account
              </Typography>
              <Typography className="mb-3 font-normal" variant="paragraph" color="gray">
                Please enter your email address to search for your account.
              </Typography>
              <Typography className="-mb-2" variant="h6">
                Your Email
              </Typography>
              <Input
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                label="Email"
                size="lg"
                error={formik.touched.email && Boolean(formik.errors.email)}
              />
              {formik.touched.email && formik.errors.email ? <div className=" text-red-900 text-xs">{formik.errors.email}</div> : null}
            </CardBody>
            <CardFooter className="pt-0">
              <Button disabled={isLoading} type="submit" className="rounded-full" style={{ backgroundColor: '#41907a' }} variant="filled" fullWidth>
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <SyncLoader color="#c0cac2" size={9} />
                  </div>
                ) : (
                  <>Search</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Dialog>
    </>
  )
}
