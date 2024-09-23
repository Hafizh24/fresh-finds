/* eslint-disable no-unused-vars */
import { Button, Input, Typography } from '@material-tailwind/react'
import { Link, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import logo from '../../../assets/logo-app-1.png'
import axios from '../../../api/axios'

export default function AdminResetPassword() {
  const params = useParams()

  const PasswordSchema = Yup.object().shape({
    password: Yup.string().min(3, 'Must be at least 3 characters long').required("Password can't be empty"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password must match the confirmation password') // Validasi konfirmasi password
      .required('Confirm password cannot be empty')
  })

  const handleSubmit = async (data) => {
    try {
      const response = await axios.patch('admins/password', data, {
        headers: {
          Authorization: `Bearer ${params.token}`
        }
      })
      toast.success(response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.message, { position: 'top-center' })
    }
  }

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: PasswordSchema,
    onSubmit: (values, action) => {
      handleSubmit(values)
      action.resetForm()
    }
  })

  return (
    <div className="flex flex-col w-screen items-center justify-center h-screen gap-5 bg-[#edf7f4]">
      <form onSubmit={formik.handleSubmit}>
        <div className="border-2 rounded-2xl shadow-sm p-16 bg-white">
          <div className="flex flex-col items-center justify-center gap-3">
            <img src={logo} alt="logo" className="hidden h-[50px] object-cover md:block mb-8"></img>
            <Typography className="text-[#41907a] mb-5" variant="h2">
              Reset password
            </Typography>
            <Input
              name="password"
              label="New Password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            {formik.touched.password && formik.errors.password ? <div className=" text-red-900 text-xs">{formik.errors.password}</div> : null}
            <Input
              name="confirmPassword"
              label="Confirm password"
              onChange={formik.handleChange}
              type="password"
              value={formik.values.confirmPassword}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className=" text-red-900 text-xs">{formik.errors.confirmPassword}</div> : null}
            <div className="flex w-full">
              <Button type="submit" color="green" className="rounded-full" variant="outlined" fullWidth>
                Reset
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
