/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, Chip, IconButton, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { IoMdAdd } from 'react-icons/io'

import ModalEditProduct from '../productManagement/components/modalEditProduct'
import ModalDelete from './modalDelete'
import axios from '../../../api/axios'
import { convertToIDR } from '../../../functions/functions'

export default function ProductCard({ productData, adminDataRedux, handleRefreshTable }) {
  const [clickedData, setClickedData] = useState([])
  const [openModalEdit, setOpenEdit] = useState(false) //Modal Edit
  const [openDelete, setDelete] = useState(false) //Modal Delete
  const handleEdit = (item) => {
    setClickedData(item)
    setOpenEdit(!openModalEdit)
  }
  const handleDelete = (item) => {
    setClickedData(item)
    setDelete(!openDelete)
  }
  const [productImage, setProductImage] = useState()

  const getProductImage = async () => {
    try {
      const response = await axios.get(`products/images/${productData?.id}`)
      setProductImage(response.data?.imageProduct.image)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getProductImage()
  }, [productData?.id])

  return (
    <>
      <div className="flex flex-col gap-2 bg-white rounded-lg shadow-sm md:w-[17vw]">
        <img
          src={productImage ? productImage : 'https://th.bing.com/th/id/R.3156efdb345eadfa73224a6a32531124?rik=sFtdqrFD%2f60DrA&pid=ImgRaw&r=0&sres=1&sresct=1'}
          alt="product image"
          className="rounded-2xl h-[140px] md:h-[145px] xl:h-[200px] w-full object-cover p-2"
        />
        <div className="flex flex-col gap-2 p-5 -mt-4 h-full justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-bold tracking-tight line-clamp-1 text-[#4eaf94] text-lg">{productData?.name}</p>
            <p className="text-[14px] md:text-[16px] font-bold text-rose-600 tracking-tight line-clamp-1">Rp{convertToIDR(productData?.price)}</p>
            <p className="leading-relaxed text-gray-700 text-[14px] md:text-[16px] line-clamp-1">{productData?.weight} gr</p>
            <p className="leading-relaxed text-gray-700 text-[14px] md:text-[16px] line-clamp-3">{productData?.description}</p>
            <div className="flex flex-row gap-1 leading-relaxed text-gray-700">
              <p className="leading-relaxed text-gray-700 text-[14px] md:text-[16px] line-clamp-1">{productData?.Category?.name}</p>
              {productData?.SubCategory && <p className="leading-relaxed text-gray-700 text-[14px] md:text-[16px] line-clamp-1">/ {productData?.SubCategory?.name}</p>}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center md:justify-end gap-2">
            {adminDataRedux?.isSuperAdmin === true ? (
              <>
                <Chip variant="ghost" size="sm" value={productData?.isDisabled != false ? 'Disabled' : 'Active'} color={productData?.isDisabled ? 'red' : 'green'} />
                <div className="flex flex-row gap-2 justify-end">
                  <IconButton variant="text" onClick={() => handleDelete(productData)} className="bg-[#ea4335]">
                    <TrashIcon className="h-4 md:h-4 w-4 md:w-4" color="white" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    onClick={() => handleEdit(productData)}
                    className="bg-[#4eaf94] hover:shadow-[#333333]/20 focus:shadow-[#333333]/20 active:shadow-[#333333]/10">
                    <PencilIcon className="h-4 md:h-4 w-4 md:w-4" color="white" />
                  </IconButton>
                </div>
              </>
            ) : (
              <IconButton
                variant="text"
                onClick={() => handleEdit(productData)}
                className="bg-[#333333] hover:shadow-[#333333]/20 focus:shadow-[#333333]/20 active:shadow-[#333333]/10">
                <IoMdAdd className="h-5 w-5" color="white" />
              </IconButton>
            )}
          </div>
        </div>
      </div>
      <ModalEditProduct
        openModalEdit={openModalEdit}
        handleEdit={handleEdit}
        clickedData={clickedData}
        adminDataRedux={adminDataRedux}
        handleRefreshTable={handleRefreshTable}
      />
      <ModalDelete api={'/products'} openDelete={openDelete} handleDelete={handleDelete} clickedData={clickedData} handleRefreshTable={handleRefreshTable} />
    </>
  )
}
