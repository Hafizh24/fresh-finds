/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, Dialog, Card, CardBody, CardFooter, Typography, Input, Tabs, TabsHeader, TabsBody, Tab, TabPanel, Select, Option } from '@material-tailwind/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { SyncLoader } from 'react-spinners'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import axios from '../../../../api/axios'

export default function ModalAddDiscount({ openModalAdd, handleOpenAdd, handleRefreshTable, defaultValue }) {
  const token = localStorage.getItem('admtoken')
  const [isLoading, setIsLoading] = useState(false)
  const [discountType, setDiscountType] = useState('')
  const [discountValue, setDiscountValue] = useState('')
  const [branchProductData, setBranchProductData] = useState([])
  const adminDataRedux = useSelector((state) => state.admin.value)
  const [tabValue, setTabValue] = useState(0)

  const handleSubmit = async (data) => {
    try {
      if (!data.code) {
        setIsLoading(true)
        const response = await axios.post('products/discount', data, {
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
      } else {
        setIsLoading(true)
        const response = await axios.post('vouchers/', data, {
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

  const handleClose = () => {
    handleOpenAdd()
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues: {
      type: '',
      value: '',
      amount: '',
      code: '',
      min_purchase_amount: '',
      max_discount: '',
      productbranchid: '',
      start_date: '',
      end_date: ''
    },
    onSubmit: (values, action) => {
      handleSubmit(values)
      action.resetForm()
    }
  })

  const data = [
    {
      label: 'Discount',
      value: 0
    },
    {
      label: 'Voucher',
      value: 1
    }
  ]

  const getBranchProductData = async () => {
    try {
      const response = await axios.get(`products/branch-product?cond=${'disc'}&admid=${adminDataRedux.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setBranchProductData(response.data?.result.rows)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (openModalAdd === true) {
      getBranchProductData()
    }
  }, [openModalAdd])

  return (
    <>
      <Dialog size="xs" open={openModalAdd} handler={handleOpenAdd} dismiss={{ outsidePress: () => handleClose() }} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full h-[80vh] overflow-auto">
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
                            <Typography className="-mb-2" variant="h6">
                              Product
                            </Typography>
                            <Select
                              name="productbranchid"
                              color="teal"
                              label="Select product"
                              value={formik.values.productbranchid}
                              onChange={(value) => {
                                formik.setFieldValue('productbranchid', value)
                              }}
                              error={formik.touched.productbranchid && Boolean(formik.errors.productbranchid)}>
                              {branchProductData?.map((item, index) => (
                                <Option key={index} value={item.id}>
                                  {item.Product?.name} | Price: Rp.{item.Product?.price} | Branch.{item.Branch?.name}
                                </Option>
                              ))}
                            </Select>
                            {formik.touched.productbranchid && formik.errors.productbranchid ? (
                              <div className=" text-red-900 text-xs">{formik.errors.productbranchid}</div>
                            ) : null}
                            <Typography className="-mb-2" variant="h6">
                              Discount type
                            </Typography>
                            <Select
                              name="type"
                              color="teal"
                              label="Select discount type"
                              value={formik.values.type}
                              onChange={(value) => {
                                formik.setFieldValue('type', value)
                                setDiscountType(value)
                              }}
                              error={formik.touched.type && Boolean(formik.errors.type)}>
                              <Option value="regular">Regular</Option>
                              <Option value="buy1get1">Buy 1 Get 1</Option>
                              <Option value="minimum_purchase">Minimum purchase amount</Option>
                            </Select>
                            {formik.touched.type && formik.errors.type ? <div className=" text-red-900 text-xs">{formik.errors.type}</div> : null}
                            <Typography className="-mb-2" variant="h6">
                              Value
                            </Typography>
                            <Select
                              name="type"
                              color="teal"
                              label="Select value"
                              value={formik.values.value}
                              onChange={(value) => {
                                formik.setFieldValue('value', value)
                                setDiscountValue(value)
                              }}
                              error={formik.touched.value && Boolean(formik.errors.type)}
                              className="overflow-auto">
                              <Option value="nominal">Nominal</Option>
                              <Option value="percentage">Percentage</Option>
                            </Select>
                            {formik.touched.value && formik.errors.value ? <div className=" text-red-900 text-xs">{formik.errors.value}</div> : null}
                            <Typography className="-mb-2" variant="h6">
                              Discount Amount
                            </Typography>
                            {discountValue === 'percentage' ? (
                              <Input
                                name="amount"
                                type="number"
                                autoComplete="new"
                                min={1}
                                max={100}
                                label="Amount in (%)"
                                size="lg"
                                onChange={(e) => {
                                  let value = parseInt(e.target.value, 10)
                                  if (isNaN(value)) {
                                    value = ''
                                  } else if (value < 1) {
                                    value = 1
                                  } else if (value > 100) {
                                    value = 100
                                  }
                                  formik.setFieldValue('amount', value)
                                }}
                                value={formik.values.amount}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                              />
                            ) : (
                              <Input
                                name="amount"
                                type="number"
                                autoComplete="new"
                                label="Amount"
                                size="lg"
                                onChange={formik.handleChange}
                                value={formik.values.amount}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                              />
                            )}
                            {formik.touched.amount && formik.errors.amount ? <div className=" text-red-900 text-xs">{formik.errors.amount}</div> : null}
                            <Typography className="-mb-2" variant="h6">
                              Min. Purchase Amount
                            </Typography>
                            <Input
                              name="min_purchase_amount"
                              type="number"
                              autoComplete="new"
                              label="Min. purchase amount"
                              size="lg"
                              onChange={formik.handleChange}
                              value={formik.values.min_purchase_amount}
                              error={formik.touched.min_purchase_amount && Boolean(formik.errors.min_purchase_amount)}
                            />
                            {formik.touched.min_purchase_amount && formik.errors.min_purchase_amount ? (
                              <div className=" text-red-900 text-xs">{formik.errors.min_purchase_amount}</div>
                            ) : null}
                            <Typography className="-mb-2" variant="h6">
                              Max. Discount
                            </Typography>
                            <Input
                              name="max_discount"
                              type="number"
                              autoComplete="new"
                              label="Max discount"
                              size="lg"
                              onChange={formik.handleChange}
                              value={formik.values.max_discount}
                              error={formik.touched.max_discount && Boolean(formik.errors.max_discount)}
                            />
                            {formik.touched.max_discount && formik.errors.max_discount ? <div className=" text-red-900 text-xs">{formik.errors.max_discount}</div> : null}
                          </>
                        ) : (
                          <>
                            <Typography className="-mb-2" variant="h6">
                              Voucher Code
                            </Typography>
                            <Input
                              name="code"
                              autoComplete="new"
                              label="Code"
                              size="lg"
                              onChange={formik.handleChange}
                              value={formik.values.code}
                              error={formik.touched.code && Boolean(formik.errors.code)}
                            />
                            {formik.touched.code && formik.errors.code ? <div className=" text-red-900 text-xs">{formik.errors.code}</div> : null}
                            <Typography className="-mb-2" variant="h6">
                              Voucher type
                            </Typography>
                            <Select
                              name="type"
                              color="teal"
                              label="Select discount type"
                              value={formik.values.type}
                              onChange={(value) => {
                                formik.setFieldValue('type', value)
                                setDiscountType(value)
                              }}
                              error={formik.touched.type && Boolean(formik.errors.type)}>
                              <Option value="product">Product</Option>
                              <Option value="shipping_cost">Shipping cost</Option>
                              <Option value="referral_code">Referral code</Option>
                            </Select>
                            {formik.touched.type && formik.errors.type ? <div className=" text-red-900 text-xs">{formik.errors.type}</div> : null}
                            <Typography className="-mb-2" variant="h6">
                              Value
                            </Typography>
                            <Select
                              name="type"
                              color="teal"
                              label="Select value"
                              value={formik.values.value}
                              onChange={(value) => {
                                formik.setFieldValue('value', value)
                                setDiscountValue(value)
                              }}
                              error={formik.touched.value && Boolean(formik.errors.type)}
                              className="overflow-auto">
                              <Option value="nominal">Nominal</Option>
                              <Option value="percentage">Percentage</Option>
                            </Select>
                            {formik.touched.value && formik.errors.value ? <div className=" text-red-900 text-xs">{formik.errors.value}</div> : null}
                            <Typography className="-mb-2" variant="h6">
                              Discount Amount
                            </Typography>
                            {discountValue === 'percentage' ? (
                              <Input
                                name="amount"
                                type="number"
                                autoComplete="new"
                                min={1}
                                max={100}
                                label="Amount in (%)"
                                size="lg"
                                onChange={(e) => {
                                  let value = parseInt(e.target.value, 10)
                                  if (isNaN(value)) {
                                    value = ''
                                  } else if (value < 1) {
                                    value = 1
                                  } else if (value > 100) {
                                    value = 100
                                  }
                                  formik.setFieldValue('amount', value)
                                }}
                                value={formik.values.amount}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                              />
                            ) : (
                              <Input
                                name="amount"
                                type="number"
                                autoComplete="new"
                                label="Amount"
                                size="lg"
                                onChange={formik.handleChange}
                                value={formik.values.amount}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                              />
                            )}
                            {formik.touched.amount && formik.errors.amount ? <div className=" text-red-900 text-xs">{formik.errors.amount}</div> : null}
                            <Typography className="-mb-2" variant="h6">
                              Start date
                            </Typography>
                            <Input
                              name="start_date"
                              type="date"
                              autoComplete="new"
                              label="Start date"
                              size="lg"
                              onChange={formik.handleChange}
                              value={formik.values.start_date}
                              error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                            />
                            <Typography className="-mb-2" variant="h6">
                              End date
                            </Typography>
                            <Input
                              name="end_date"
                              type="date"
                              autoComplete="new"
                              label="End date"
                              size="lg"
                              onChange={formik.handleChange}
                              value={formik.values.end_date}
                              error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                            />
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
                <Button disabled={isLoading || (branchProductData.length === 0 && true)} type="submit" style={{ backgroundColor: '#41907a' }} variant="filled" fullWidth>
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
