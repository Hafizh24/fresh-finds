import { PresentationChartBarIcon } from '@heroicons/react/24/solid'
import { FaPlateWheat } from 'react-icons/fa6'
import { GoPeople } from 'react-icons/go'
import { GrUserAdmin } from 'react-icons/gr'
import { MdOutlineDiscount } from 'react-icons/md'
import { VscGraphLine } from 'react-icons/vsc'
import { LuStore } from 'react-icons/lu'

export const sidebarData = [
  {
    title: 'Overview',
    path: '/admin-overview',
    icon: <PresentationChartBarIcon className="h-5 w-5" />,
    admin: true
  },
  {
    title: 'Admin Management',
    path: '/admin-management',
    icon: <GrUserAdmin className="h-5 w-5" />
  },
  {
    title: 'Customer Management',
    path: '/customer-management',
    icon: <GoPeople className="h-5 w-5" />,
    admin: true
  },
  {
    title: 'Product Management',
    icon: <FaPlateWheat className="h-5 w-5" />,
    admin: true,
    subMenus: [
      {
        title: 'Products',
        path: '/product-management',
        icon: <FaPlateWheat className="h-5 w-5" />
      },
      {
        title: 'Categories',
        path: '/category-management',
        icon: <FaPlateWheat className="h-5 w-5" />
      },
      {
        title: 'Stock',
        path: '/stock-management',
        icon: <FaPlateWheat className="h-5 w-5" />
      }
    ]
  },
  {
    title: 'Store Management',
    path: '/store-management',
    icon: <LuStore className="h-5 w-5" />
  },
  {
    title: 'Discount Management',
    path: '/discount-management',
    icon: <MdOutlineDiscount className="h-5 w-5" />,
    admin: true
  },
  {
    title: 'Reports',
    path: '/report-management',
    icon: <VscGraphLine className="h-5 w-5" />
  }
]
