/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, Card, Chip, Input, Typography } from '@material-tailwind/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

import axios from '../../../../api/axios'
import { setDataAdmin } from '../../../../redux/adminSlice'

export default function AdminProfileForm({ adminData }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const token = localStorage.getItem('admtoken')
  const dispatch = useDispatch()

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleSubmit = async (data) => {
    try {
      const response = await axios.patch('admins/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      keepLoginAdmin()
      toast.success(response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
    } catch (err) {
      console.error(err)
      // toast.error(err.response.data.message, { position: "top-center" });
    }
  }

  const PasswordSchema = Yup.object().shape({
    password: Yup.string().min(3, 'Must be at least 3 characters long'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match the confirmation password') // Validasi konfirmasi password
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: PasswordSchema,
    onSubmit: (values, action) => {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('username', values.username)
      if (values.password) {
        formData.append('password', values.password)
      }
      formData.append('image', selectedFile)
      formData.append('id', adminData.id)
      handleSubmit(formData)
      action.resetForm()
    }
  })

  const keepLoginAdmin = async () => {
    try {
      const response = await axios.get('admins/keep-login', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      dispatch(setDataAdmin(response.data.result))
    } catch (err) {
      toast.error(err.response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
    }
  }

  return (
    <div className="flex flex-col p-8 bg-white shadow-sm rounded-3xl w-max md:w-max h-auto items-center">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-4 w-[80vw] md:w-max">
          <Typography variant="h3">Edit profile</Typography>
          <Typography className="-mb-2" variant="h6">
            Name
          </Typography>
          <Input name="name" autoComplete="new" label="name" onChange={formik.handleChange} value={formik.values.name} />
          <Typography className="-mb-2" variant="h6">
            Username
          </Typography>
          <Input name="username" autoComplete="new" label="Username" onChange={formik.handleChange} value={formik.values.username} />
          <Typography className="-mb-2" variant="h6">
            Profile Picture
          </Typography>
          {selectedFile && <img src={selectedFile ? URL.createObjectURL(selectedFile) : ''} className="w-32 h-32 rounded-lg object-cover"></img>}
          <label>
            <input
              type="file"
              name="image"
              autoComplete="new"
              size="sm"
              onChange={handleFileChange}
              className="file:mr-5 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#72c1ac] file:text-white hover:file:cursor-pointer hover:file:bg-[#41907a] hover:file:text-white"
            />
          </label>
          <Typography className="-mb-2" variant="h6">
            Password
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
          <Button type="submit" fullWidth className="bg-[#41907a] text-white">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}
