import { FaStoreAlt } from 'react-icons/fa'
import { GoPeople } from 'react-icons/go'
import { VscGraphLine } from 'react-icons/vsc'
import { MdOutlineDiscount } from 'react-icons/md'
import { TbFileInvoice } from 'react-icons/tb'
import { FaPlateWheat } from 'react-icons/fa6'

import axios from '../../../../api/axios'

export const apiTotalAdmin = async () => {
  const token = localStorage.getItem('admtoken')
  try {
    const response = await axios.get('admins/total', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (err) {
    console.log(err)
  }
}

export const apiTotalProduct = async () => {
  const token = localStorage.getItem('admtoken')
  try {
    const response = await axios.get('products/total', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.totalProduct
  } catch (err) {
    console.log(err)
  }
}

export const apiTotalCustomer = async () => {
  const token = localStorage.getItem('admtoken')
  try {
    const response = await axios.get('customer/total', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.totalCustomer
  } catch (err) {
    console.log(err)
  }
}

export const apiTotalBranch = async () => {
  const token = localStorage.getItem('admtoken')
  try {
    const response = await axios.get('branches/total', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.totalBranch
  } catch (err) {
    console.log(err)
  }
}

export const apiTotalDiscount = async (adminDataRedux) => {
  const token = localStorage.getItem('admtoken')
  try {
    const response = await axios.get(`products/discount/total?admid=${adminDataRedux.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.totalDiscount
  } catch (err) {
    console.log(err)
  }
}

export const getCardData = async (adminDataRedux) => {
  const totalAdmin = await apiTotalAdmin()
  const totalProduct = await apiTotalProduct()
  const totalCustomer = await apiTotalCustomer()
  const totalBranch = await apiTotalBranch()
  const totalDiscount = await apiTotalDiscount(adminDataRedux)

  const card_data = [
    {
      title: 'products',
      desc: 'Manage product',
      path: '/product-management',
      icon: <FaPlateWheat style={{ fontSize: '34px' }} />,
      data: totalProduct,
      admin: true
    },
    {
      title: 'branches',
      desc: 'Manage branch',
      path: '/store-management',
      icon: <FaStoreAlt style={{ fontSize: '34px' }} />,
      data: totalBranch
    },
    {
      title: 'admins',
      desc: 'Manage admin',
      path: '/admin-management',
      icon: <GoPeople style={{ fontSize: '34px' }} />,
      data: totalAdmin.totalAdmin,
      latest_data: totalAdmin.latestAdded
    },
    {
      title: 'customers',
      desc: 'See more',
      path: '/customer-management',
      icon: <GoPeople style={{ fontSize: '34px' }} />,
      data: totalCustomer,
      admin: true
    },
    {
      title: 'collected',
      desc: 'See reports',
      path: '/report-management',
      icon: <VscGraphLine style={{ fontSize: '34px' }} />,
      data: 'Rp.2.700.000'
    },
    {
      title: 'discounts',
      desc: 'Manage discount',
      path: '/discount-management',
      icon: <MdOutlineDiscount style={{ fontSize: '34px' }} />,
      data: totalDiscount,
      admin: true
    },
    {
      title: 'Recent orders',
      desc: 'Manage recent orders',
      path: '/',
      icon: <TbFileInvoice style={{ fontSize: '34px' }} />,
      data: '',
      admin: true
    }
  ]

  return card_data
}
