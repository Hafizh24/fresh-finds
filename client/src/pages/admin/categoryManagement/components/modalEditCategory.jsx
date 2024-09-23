/* eslint-disable react/prop-types */
import { Button, Dialog, Card, CardBody, CardFooter, Typography, Input, Select, Option } from '@material-tailwind/react'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from '../../../../api/axios'
import { useEffect, useState } from 'react'

export default function ModalEditCategory({ api, tabValueFromChild, openModalEdit, handleEdit, clickedData, handleRefreshTable }) {
  const [subCategory, setSubCategory] = useState([])
  const [subCategoryInCategory, setSubCategoryInCategory] = useState([])
  const [refreshModal, setRefreshModal] = useState(false)
  const handleRefreshModal = () => setRefreshModal(!refreshModal)
  const token = localStorage.getItem('admtoken')
  const handleClose = () => {
    formik.resetForm()
    handleEdit()
  }
  const handleSubmit = async (data) => {
    data.id = clickedData.id
    try {
      const response = await axios.patch(api, data, {
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
      toast.error(err.response.data.message, { position: 'top-center' })
    }
  }
  const formik = useFormik({
    initialValues: {
      name: '',
      sub_category: ''
    },
    onSubmit: (values, action) => {
      handleSubmit(values)
      action.resetForm()
    }
  })

  const fetchData = async () => {
    try {
      const response = await axios.get(`/categories/sub-category?all=`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const response2 = await axios.get(`/categories/sub-category/${clickedData?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSubCategory(response.data.result)
      setSubCategoryInCategory(response2.data.result)
    } catch (error) {
      console.log(error)
    }
  }

  const removeSubCategoryFromCategory = async (item) => {
    try {
      const fields = {}
      fields.subId = item
      const response = await axios.patch('categories/sub-category/remove', fields, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      handleRefreshModal()
      toast.success(response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [openModalEdit, refreshModal])

  return (
    <>
      <Dialog size="xs" open={openModalEdit} handler={handleEdit} dismiss={{ outsidePress: () => handleClose() }} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={formik.handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Edit {clickedData?.name}
              </Typography>
              {subCategoryInCategory && subCategoryInCategory.length > 0 && (
                <>
                  <Typography className="-mb-2" variant="h6">
                    Subcategory
                  </Typography>
                  <div className="flex flex-col gap-2">
                    {subCategoryInCategory.map((item, index) => (
                      <div key={index} className="flex flex-row gap-2">
                        <Typography>{item.name}</Typography>
                        <Button onClick={() => removeSubCategoryFromCategory(item.id)} variant="text" size="sm" color="red">
                          remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <Typography className="-mb-2" variant="h6">
                Name
              </Typography>
              <Input name="name" autoComplete="new" label={clickedData?.name} size="lg" onChange={formik.handleChange} value={formik.values.name} />
              {tabValueFromChild === 0 && (
                <>
                  {subCategory && subCategory.length > 0 && (
                    <>
                      <Typography className="-mb-2" variant="h6">
                        Add subcategory to {clickedData?.name}
                      </Typography>
                      <Select
                        name="sub_category"
                        color="teal"
                        label="Select available subcategory"
                        value={formik.values.sub_category}
                        onChange={(value) => formik.setFieldValue('sub_category', value)}>
                        {subCategory?.map((item, index) => (
                          <Option key={index} value={item.name}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </>
                  )}
                </>
              )}
            </CardBody>
            <CardFooter className="pt-0">
              <div className="flex flex-row gap-3">
                <Button onClick={handleClose} variant="text" fullWidth>
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#41907a' }} variant="filled" fullWidth>
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
