/* eslint-disable no-unused-vars */
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { toast } from 'react-toastify'

import { HomePage } from './pages/home'
import { Admin404 } from './pages/404admin'
import { About } from './pages/about'
import { UserSignIn } from './pages/userSignIn'
import { UserRegister } from './pages/userRegister'
import { AccountVerification } from './pages/accountVerification'
import { UserResetPassword } from './pages/userResetPassword'
import { UserUpdateEmail } from './pages/userUpdateEmail'
import { StoreLocator } from './pages/storeLocator'
import LoginAdmin from './pages/loginAdmin'
import AdminVerification from './pages/admin/components/adminVerification'
import AdminResetPassword from './pages/admin/components/adminResetPassword'
import { ProductCatalogue } from './pages/productCatalogue'
import { ProductDetail } from './pages/productDetail'
import Required from './components/required'
import { UserDashboard } from './pages/userDashboard'
import { UserVerification } from './pages/userVerification'
import { CheckoutPage } from './pages/checkout'
import AdminRequired from './components/adminRequired'
import AdminManagement from './pages/admin/adminManagement'
import Overview from './pages/admin/overview'
import CustomerManagement from './pages/admin/customerManagement'
import ProductManagement from './pages/admin/productManagement'
import AdminProfile from './pages/admin/adminProfile'
import CategoryManagement from './pages/admin/categoryManagement'
import AdminErrorPage from './pages/admin/components/adminErrorPage'
import { StoreManagement } from './pages/admin/storeManagement'
import { StoreBranchDetail } from './pages/admin/storeManagement/storeBranchDetail'
import StockManagement from './pages/admin/stockManagement'
import DiscountManagement from './pages/admin/discountManagement'
import ReportManagement from './pages/admin/reportManagement'
import { setDataAdmin } from './redux/adminSlice'
import { ExpiredToken } from './pages/admin/components/dialogs'
import { useGeoLocation } from './hooks/useGeoLocation'

const router = createBrowserRouter([
  //Untuk yang tidak butuh token
  { path: '/', element: <HomePage /> },
  { path: '/login-admin', element: <LoginAdmin></LoginAdmin> },
  { path: '/admin-verification/:token', element: <AdminVerification /> },
  { path: '/admin-reset-password/:token', element: <AdminResetPassword /> },
  { path: '/signin', element: <UserSignIn /> },
  { path: '/register', element: <UserRegister /> },
  { path: '/verify/:token', element: <AccountVerification /> },
  { path: '/user-reset-password/:token', element: <UserResetPassword /> },
  { path: '/user-update-email/:token', element: <UserUpdateEmail /> },
  { path: '/store-locator', element: <StoreLocator /> },
  { path: '/catalogue/:category_id?/:search?', element: <ProductCatalogue /> },
  { path: '/product-detail/:id?/:branch_id?', element: <ProductDetail /> },
  { path: '/about', element: <About /> },
  { path: '/404-admin', element: <Admin404 /> },
  {
    element: <Required />,
    children: [
      //untuk yang butuh customer
      { path: '/user-dashboard', element: <UserDashboard /> },
      { path: '/user-verification', element: <UserVerification /> },
      { path: '/checkout', element: <CheckoutPage /> }
    ]
  },
  {
    element: <AdminRequired />,
    children: [
      { path: '/admin-management', element: <AdminManagement /> },
      { path: '/admin-overview', element: <Overview /> },
      { path: '/customer-management', element: <CustomerManagement /> },
      { path: '/product-management', element: <ProductManagement /> },
      { path: '/admin-profile', element: <AdminProfile /> },
      { path: '/category-management', element: <CategoryManagement /> },
      { path: '/error', element: <AdminErrorPage /> },
      { path: '/store-management', element: <StoreManagement /> },
      { path: '/store-management/:id', element: <StoreBranchDetail /> },
      { path: '/stock-management', element: <StockManagement /> },
      { path: '/discount-management', element: <DiscountManagement /> },
      { path: '/report-management', element: <ReportManagement /> }
    ]
  }
])

function App() {
  const token = localStorage.getItem('token')
  const admtoken = localStorage.getItem('admtoken')
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)

  useGeoLocation()

  const keepLoginAdmin = async () => {
    try {
      const response = await axios.get('admins/keep-login', {
        headers: {
          Authorization: `Bearer ${admtoken}`
        }
      })
      console.log(response.data.result, 'keepLoginAdmin')

      dispatch(setDataAdmin(response.data.result))
    } catch (err) {
      console.log(err, 'keepLoginAdmin erorr')

      toast.error(err.response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
    }
  }

  // const keepLoginCustomer = async () => {
  //   try {
  //     const response = await axios.get('customer/keep-login', {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //     dispatch(setData(response.data.result))
  //   } catch (error) {
  //     console.log(error)

  //     localStorage.removeItem('token')
  //     history.push('/signin')
  //   }
  // }

  useEffect(() => {
    // if (token) {
    //   keepLoginCustomer()
    // }
    if (admtoken) {
      keepLoginAdmin()
    }
  }, [])

  return (
    <>
      <RouterProvider router={router}>
        <ExpiredToken content={'Please login again'} open={open} handleOpen={handleOpen} />{' '}
      </RouterProvider>
    </>
  )
}

export default App
