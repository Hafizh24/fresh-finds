import { Card, Input, Checkbox, Button, Typography } from '@material-tailwind/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SyncLoader } from 'react-spinners'

import ModalForgotPassword from './components/modalForgotPassword'
import adminLogin from '../../assets/admin/admin_login.png'
import { setDataAdmin } from '../../redux/adminSlice'
import axios from '../../api/axios'

export default function LoginAdmin() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const handleOpen = () => setOpen(!open)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const LoginSchema = Yup.object({
    username: Yup.string().required('Username or Email is required'),
    password: Yup.string().required('Password is required').min(3, 'Minimum 3 characters')
  })

  const response_process = (response) => {
    if (response.data.token) {
      dispatch(setDataAdmin(response.data.result))
      localStorage.setItem('admtoken', response.data.token)
      toast.success(response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
      navigate('/admin-overview')
    }
  }

  const handleSubmit = async (data) => {
    try {
      data.rememberMe = rememberMe
      if (/^\S+@\S+\.\S+$/.test(data.username)) {
        data.email = data.username
        delete data.username
        setIsLoading(true)
        const response = await axios.post(`admins/login`, data)
        setIsLoading(false)
        response_process(response)
      } else {
        setIsLoading(true)
        const response = await axios.post(`admins/login`, data)
        setIsLoading(false)
        response_process(response)
      }
    } catch (err) {
      setIsLoading(false)
      toast.error(err.response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
    }
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: (values, action) => {
      handleSubmit(values)
      action.resetForm()
    }
  })

  const handleRememberMe = () => {
    setRememberMe(!rememberMe)
  }

  return (
    <div className="h-screen flex items-center justify-center p-9 bg-[#edf7f4]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <Card color="white" shadow={true} className="p-9">
          <Typography variant="h4" color="blue-gray">
            Sign In
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Enter your details to sign in.
          </Typography>
          <form onSubmit={formik.handleSubmit} className="mt-8 mb-2 max-w-screen-lg sm:w-96">
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Email or Username
              </Typography>
              <Input
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
                size="lg"
                placeholder="Type your email or username"
                autoComplete="off"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: 'before:content-none after:content-none'
                }}
                error={formik.touched.username && Boolean(formik.errors.username)}
              />
              {formik.touched.username && formik.errors.username ? <div className=" text-red-900 text-xs">{formik.errors.username}</div> : null}

              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
              </Typography>
              <Input
                type="password"
                size="lg"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: 'before:content-none after:content-none'
                }}
                error={formik.touched.password && Boolean(formik.errors.password)}
              />
              {formik.touched.password && formik.errors.password ? <div className=" text-red-900 text-xs">{formik.errors.password}</div> : null}
            </div>
            <div className="flex flex-row items-center justify-between gap-2">
              <Checkbox
                label={
                  <Typography variant="small" color="gray" className="flex items-center font-normal">
                    Remember Me
                  </Typography>
                }
                containerProps={{ className: '-ml-2.5' }}
                onClick={handleRememberMe}
              />
              <div onClick={handleOpen} className="text-sm md:text-[15px] cursor-pointer">
                Forgot Password
              </div>
            </div>
            <Button disabled={isLoading} type="submit" style={{ backgroundColor: '#41907a' }} variant="filled" className="mt-6 rounded-full" fullWidth>
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <SyncLoader color="#c0cac2" size={9} />
                </div>
              ) : (
                <>Log In</>
              )}
            </Button>
          </form>
        </Card>
        <img className="h-96 rounded-lg object-cover hidden md:block" src={adminLogin} alt="admin image" />
      </div>

      <ModalForgotPassword open={open} handleOpen={handleOpen} />
    </div>
  )
}
