/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Dialog, Card, CardBody, CardFooter, Typography, Input, Select, Option, Switch } from '@material-tailwind/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'

import axios from '../../../../api/axios'

export default function ModalEditProduct({ openModalEdit, handleEdit, clickedData, adminDataRedux, handleRefreshTable }) {
  const token = localStorage.getItem('admtoken')
  const [categoryId, setCategoryId] = useState(0)
  const [subCategoryData, setSubCategoryData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [branchData, setBranchData] = useState([])
  const [branchId, setBranchId] = useState(0)
  const [enable, setEnable] = useState(clickedData?.isDisabled)
  const [productImages, setProductImages] = useState()
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleSwitch = () => {
    setEnable(!enable)
  }

  const handleClose = () => {
    setCategoryId(0)
    setBranchId(0)
    setSelectedFile(null)
    formik.resetForm()
    handleEdit()
  }

  const handleSubmit = async (data) => {
    try {
      const response = await axios.patch('products/', data, {
        'Content-Type': 'multipart/form-data',
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
      console.log(err)
      toast.error(err.response.data.message, { position: 'top-center' })
    }
  }

  const handleDeleteImage = async (id) => {
    try {
      const response = await axios.delete(`products/images?id=${id}&product_id=${clickedData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      getProductImage()
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

  // const EditSchema = Yup.object({
  //     stock: Yup.number().required("Please enter the stock quantity."),
  // });

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      description: '',
      weight: '',
      stock: '',
      price: '',
      branch_id: '',
      category_id: '',
      subcategory_id: ''
    },
    // validationSchema: EditSchema,
    onSubmit: (values, action) => {
      const formData = new FormData()
      formData.append('id', clickedData.id)
      formData.append('name', values.name)
      formData.append('description', values.description)
      formData.append('weight', values.weight)
      formData.append('price', values.price)
      formData.append('stock', values.stock)
      formData.append('category_id', values.category_id)
      formData.append('subcategory_id', values.subcategory_id)
      formData.append('updatedBy', adminDataRedux?.name)
      formData.append('isDisabled', enable)
      formData.append('branch_id', branchId)
      formData.append('product_image', selectedFile)
      handleSubmit(formData)
      action.resetForm()
    }
  })

  const fetchData = async () => {
    try {
      const response = await axios.get(`/categories?all=true}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCategoryData(response.data.result.rows)
      if (categoryId) {
        const response2 = await axios.get(`/categories/sub-category/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setSubCategoryData(response2.data.result)
      }
      const response_branch = await axios.get(`products/images/${clickedData?.id}`)
      if (adminDataRedux?.isSuperAdmin === true) {
        const response_branch = await axios.get(`/branches/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setBranchData(response_branch.data.result)
      } else {
        const response_branch = await axios.get(`/branches/assigned?id=${adminDataRedux?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setBranchData(response_branch.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getProductImage = async () => {
    try {
      const response = await axios.get(`products/images-all/${clickedData?.id}`)
      setProductImages(response.data?.imageProduct)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getProductImage()
    setEnable(clickedData?.isDisabled)
  }, [clickedData?.id])

  useEffect(() => {
    fetchData()
  }, [categoryId])

  return (
    <>
      <Dialog
        size={adminDataRedux?.isSuperAdmin === false ? 'sm' : 'md'}
        open={openModalEdit}
        handler={handleEdit}
        dismiss={{ outsidePress: () => handleClose() }}
        className="bg-transparent shadow-none">
        <Card id="modal-scroll" className={'mx-auto w-full overflow-auto md:p-5 md:pl-12 md:pr-12' + (adminDataRedux?.isSuperAdmin === false ? ' h-auto' : ' h-[80vh]')}>
          <form onSubmit={formik.handleSubmit}>
            <CardBody className="flex flex-col gap-6">
              {adminDataRedux?.isSuperAdmin === true && (
                <>
                  <Typography variant="h4" color="blue-gray">
                    Edit {clickedData?.name}
                  </Typography>
                  <Typography className="-mb-4" variant="h6">
                    Product Name
                  </Typography>
                  <input
                    name="name"
                    autoComplete="off"
                    placeholder={clickedData?.name}
                    size="lg"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    className="block w-full rounded-lg border-2 border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                  />
                  <Typography className="-mb-4" variant="h6">
                    Price
                  </Typography>
                  <input
                    name="price"
                    type="number"
                    autoComplete="off"
                    placeholder={clickedData?.price}
                    size="lg"
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10)
                      if (isNaN(value)) {
                        value = ''
                      } else if (value < 1) {
                        value = 1
                      }
                      formik.setFieldValue('price', value)
                    }}
                    value={formik.values.price}
                    className="block w-full rounded-lg border-2 border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                  />
                  <Typography className="-mb-4" variant="h6">
                    {'Weight (gram)'}
                  </Typography>
                  <input
                    name="weight"
                    type="number"
                    autoComplete="off"
                    placeholder={clickedData?.weight}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10)
                      if (isNaN(value)) {
                        value = ''
                      } else if (value < 1) {
                        value = 1
                      }
                      formik.setFieldValue('weight', value)
                    }}
                    value={formik.values.weight}
                    className="block w-full rounded-lg border-2 border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                  />
                  <Typography className="-mb-4" variant="h6">
                    Description
                  </Typography>
                  <textarea
                    name="description"
                    type="text"
                    autoComplete="off"
                    placeholder={clickedData?.description}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    className="block w-full rounded-lg border-2 border-gray-300 bg-[#FCFCFC] p-2.5 text-gray-900 focus:outline-[#4ECCA3] sm:text-sm"
                  />
                  <Typography className="-mb-4" variant="h6">
                    Product images
                  </Typography>
                  <div className="flex flex-row gap-2">
                    {productImages?.map((item, index) => (
                      <div className="relative" key={index}>
                        <img
                          key={index}
                          src={item.image}
                          alt=""
                          className="rounded-2xl h-[12vh] w-[10rem] md:h-[40vh] md:w-[70vw] lg:h-[12vh] lg:w-[10rem] object-cover"
                        />
                        {productImages.length != 1 && (
                          <div
                            onClick={() => handleDeleteImage(item.id)}
                            className="absolute right-[-0.3rem] bottom-[-0.5rem] bg-[#F44336] text-white text-[14.5px] py-1 px-2 rounded-lg shadow-md cursor-pointer hover:bg-red-600">
                            Delete
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Typography className="-mb-4" variant="h6">
                    Add image
                  </Typography>
                  {selectedFile && <img src={selectedFile ? URL.createObjectURL(selectedFile) : ''} className="w-32 h-32 rounded-lg object-cover" />}
                  {productImages?.length < 3 ? (
                    <label>
                      <input
                        type="file"
                        name="product_image"
                        autoComplete="off"
                        size="sm"
                        onChange={handleFileChange}
                        className="bg-[#FCFCFC] file:mr-5 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#72c1ac] file:text-white hover:file:cursor-pointer hover:file:bg-[#41907a]hover:file:text-white"
                      />
                    </label>
                  ) : (
                    <Typography>Please delete one image before adding a new one, as the maximum allowed is three images.</Typography>
                  )}
                  {categoryData && categoryData.length > 0 && (
                    <>
                      <Typography className="-mb-4" variant="h6">
                        Category
                      </Typography>
                      <Select
                        name="category_id"
                        color="teal"
                        label={'Select Category'}
                        value={formik.values.category_id}
                        onChange={(value) => {
                          formik.setFieldValue('category_id', value)
                          setCategoryId(value)
                        }}
                        className="bg-[#FCFCFC]">
                        {categoryData?.map((item, index) => (
                          <Option key={index} value={item.id} className="font-bold">
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </>
                  )}
                  {subCategoryData && subCategoryData.length > 0 && categoryId != 0 && (
                    <>
                      <Typography className="-mb-4" variant="h6">
                        Sub Category
                      </Typography>
                      <Select
                        name="subcategory_id"
                        color="teal"
                        label="Select sub category"
                        value={formik.values.subcategory_id}
                        onChange={(value) => formik.setFieldValue('subcategory_id', value)}
                        className="bg-[#FCFCFC]">
                        {subCategoryData?.map((item, index) => (
                          <Option key={index} value={item.id} className="font-bold">
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </>
                  )}
                </>
              )}

              {branchData && branchData.length > 0 && (
                <>
                  <Typography className="-mb-4" variant="h6">
                    Add to branch
                  </Typography>
                  <Select
                    name="branch_id"
                    color="teal"
                    label="Select available branch"
                    value={formik.values.branch_id}
                    onChange={(value) => {
                      formik.setFieldValue('branch_id', value)
                      setBranchId(value)
                    }}
                    className="bg-[#FCFCFC]">
                    {branchData?.map((item, index) => (
                      <Option key={index} value={item.id} className="font-bold">
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </>
              )}
              {branchData.length === 0 && adminDataRedux.isSuperAdmin === false && (
                <div className=" text-red-900 text-md">You haven't been assigned to any branches. Please contact the super admin.</div>
              )}
              {branchId > 0 && (
                <>
                  <Typography variant="h6">Stock</Typography>
                  <Input
                    type="number"
                    name="stock"
                    autoComplete="new"
                    label="Stock"
                    size="lg"
                    onChange={formik.handleChange}
                    value={formik.values.stock}
                    error={formik.touched.stock && Boolean(formik.errors.stock)}
                  />
                  {formik.touched.stock && formik.errors.stock ? <div className=" text-red-900 text-xs">{formik.errors.stock}</div> : null}
                </>
              )}
              {adminDataRedux?.isSuperAdmin === true && (
                <Switch
                  color="green"
                  onChange={handleSwitch}
                  defaultChecked={clickedData?.isDisabled ? false : true}
                  label={enable === true ? 'Disabled' : 'Active'}></Switch>
              )}
            </CardBody>
            <CardFooter className="pt-0">
              <div className="flex flex-row gap-3">
                <Button onClick={handleClose} variant="text" fullWidth>
                  Cancel
                </Button>
                <Button
                  className={adminDataRedux.isSuperAdmin === false && branchData.length === 0 ? 'hidden' : ''}
                  type="submit"
                  style={{ backgroundColor: '#41907a' }}
                  variant="filled"
                  fullWidth>
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
