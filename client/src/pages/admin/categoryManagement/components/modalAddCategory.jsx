/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, Dialog, Card, CardBody, CardFooter, Typography, Input, Tabs, TabsHeader, TabsBody, Tab, TabPanel } from '@material-tailwind/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SyncLoader } from 'react-spinners'
import { useState } from 'react'

import axios from '../../../../api/axios'

export default function ModalAddCategory({ openModalAdd, handleOpenAdd, handleRefreshTable, defaultValue }) {
  const token = localStorage.getItem('admtoken')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await axios.post('categories/', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsLoading(false)
      toast.success(response.data.message, {
        position: 'top-center',
        hideProgressBar: true,
        theme: 'colored'
      })
      handleOpenAdd()
      handleRefreshTable()
    } catch (err) {
      setIsLoading(false)
      toast.error(err.response.data.message, { position: 'top-center' })
    }
  }

  const handleClose = () => {
    handleOpenAdd()
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues: {
      category_name: '',
      sub_category_name: ''
    },
    onSubmit: (values, action) => {
      handleSubmit(values)
      action.resetForm()
    }
  })

  const data = [
    {
      label: 'Add category',
      value: 0
    },
    {
      label: 'Add Sub Category',
      value: 1
    }
  ]

  return (
    <>
      <Dialog size="xs" open={openModalAdd} handler={handleOpenAdd} dismiss={{ outsidePress: () => handleClose() }} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col p-5">
              <Tabs value={defaultValue}>
                <TabsHeader className="bg-[#cae7df]">
                  {data.map(({ label, value }) => (
                    <Tab key={value} value={value}>
                      {label}
                    </Tab>
                  ))}
                </TabsHeader>
                <TabsBody>
                  {data.map(({ value }) => (
                    <TabPanel key={value} value={value}>
                      <CardBody className="flex flex-col gap-4">
                        {value === 0 ? (
                          <>
                            <Typography variant="h4" color="blue-gray">
                              Add Category
                            </Typography>
                            <Typography className="-mb-2" variant="h6">
                              Category Name
                            </Typography>
                            <Input
                              name="category_name"
                              autoComplete="new"
                              label="Name"
                              size="lg"
                              onChange={formik.handleChange}
                              value={formik.values.category_name}
                              error={formik.touched.category_name && Boolean(formik.errors.category_name)}
                            />
                            {formik.touched.category_name && formik.errors.category_name ? (
                              <div className=" text-red-900 text-xs">{formik.errors.category_name}</div>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <Typography variant="h4" color="blue-gray">
                              Add Sub Category
                            </Typography>
                            <Typography className="-mb-2" variant="h6">
                              Sub-category Name
                            </Typography>
                            <Input
                              name="sub_category_name"
                              autoComplete="new"
                              label="Name"
                              size="lg"
                              onChange={formik.handleChange}
                              value={formik.values.sub_category_name}
                              error={formik.touched.sub_category_name && Boolean(formik.errors.sub_category_name)}
                            />
                            {formik.touched.sub_category_name && formik.errors.sub_category_name ? (
                              <div className=" text-red-900 text-xs">{formik.errors.sub_category_name}</div>
                            ) : null}
                          </>
                        )}
                      </CardBody>
                    </TabPanel>
                  ))}
                </TabsBody>
              </Tabs>
            </div>
            <CardFooter className="pt-0">
              <div className="flex flex-row gap-3">
                <Button disabled={isLoading} onClick={handleClose} variant="text" fullWidth>
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit" style={{ backgroundColor: '#41907a' }} variant="filled" fullWidth>
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <SyncLoader color="#c0cac2" size={9} />
                    </div>
                  ) : (
                    <>Add</>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  )
}
