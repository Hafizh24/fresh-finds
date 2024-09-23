/* eslint-disable react/prop-types */
import { Button, Dialog, Card, CardBody, CardFooter, Typography, Input } from '@material-tailwind/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { GrSubtractCircle } from 'react-icons/gr'

import axios from '../../../../api/axios'

export default function ModalEditStock({ api, openModalEdit, handleEdit, clickedData, handleRefreshTable }) {
  const adminDataRedux = useSelector((state) => state.admin.value)
  const token = localStorage.getItem('admtoken')
  const handleClose = () => {
    formik.resetForm()
    handleEdit()
  }

  const handleSubmit = async (data) => {
    try {
      data.id = clickedData.id
      data.updater = adminDataRedux.name
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

  const editSchema = Yup.object({
    stock_input: Yup.string().required('Please enter the stock quantity you want to add or subtract.')
  })

  const formik = useFormik({
    initialValues: {
      stock_input: '',
      operation: ''
    },
    validationSchema: editSchema,
    onSubmit: (values, action) => {
      handleSubmit(values)
      action.resetForm()
    }
  })

  return (
    <>
      <Dialog size="xs" open={openModalEdit} handler={handleEdit} dismiss={{ outsidePress: () => handleClose() }} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={formik.handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Edit stock {clickedData?.Product?.name}
              </Typography>
              <Typography className="-mb-2" variant="h6">
                Current stock is <span style={{ color: 'green' }}>{clickedData?.stock}</span>
              </Typography>
              {/* <Typography className="-mb-2" variant="h6">
                                Stock
                            </Typography> */}
              <Input
                type="number"
                name="stock_input"
                label="Insert number"
                autoComplete="new"
                size="lg"
                onChange={formik.handleChange}
                value={formik.values.stock_input}
                error={formik.touched.stock_input && Boolean(formik.errors.stock_input)}
              />
              {formik.touched.stock_input && formik.errors.stock_input ? <div className=" text-red-900 text-xs">{formik.errors.stock_input}</div> : null}
            </CardBody>
            <CardFooter className="pt-0">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row-reverse gap-2 items-center justify-center">
                  <Button type="submit" style={{ backgroundColor: '#41907a' }} variant="filled" fullWidth onClick={() => formik.setFieldValue('operation', 'add')}>
                    <div className="flex flex-row items-center justify-center gap-2">
                      Add <IoMdAddCircleOutline className="h-4 w-4" />
                    </div>
                  </Button>
                  <Button type="submit" color="red" variant="filled" fullWidth onClick={() => formik.setFieldValue('operation', 'subtract')}>
                    <div className="flex flex-row items-center justify-center gap-2">
                      Subtract <GrSubtractCircle className="h-4 w-4" />
                    </div>
                  </Button>
                </div>
                <Button onClick={handleClose} variant="text" fullWidth>
                  Cancel
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  )
}
