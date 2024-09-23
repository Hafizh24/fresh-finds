/* eslint-disable react/prop-types */
import { Card, Typography, Button, CardBody, CardFooter, Input, Tabs, TabsHeader, Tab, Select, Option } from '@material-tailwind/react'
import { UserPlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { FaFileCsv } from 'react-icons/fa6'
import { IoMdAdd } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'

import axios from '../../../api/axios'
import { AdminCSVHeaders, CustomerCSVHeaders, ProductBranchCSVHeaders, ProductCSVHeaders, TABS, TABS_DISCOUNT_VOUCHER } from './tableHeaderData'

export function TableHeader({
  title,
  description,
  page,
  showAddButton,
  addButtonText,
  handleOpenAdd = () => {},
  handleReset = () => {},
  csvData,
  searchValue,
  setSearchValue,
  onTabChange,
  handleFilterByBranch = () => {}
}) {
  const adminDataRedux = useSelector((state) => state.admin.value)
  const [branchData, setBranchData] = useState([])
  const token = localStorage.getItem('admtoken')

  const handleTabChange = (value) => {
    onTabChange(value)
  }

  const fetchDataBranch = async () => {
    try {
      if (page === 'stock') {
        const response = await axios.get(`/branches/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setBranchData(response.data.result)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (page === 'stock') {
      fetchDataBranch()
    }
  }, [])

  return (
    <div className="w-screen md:w-5/6">
      <Card className="md:mt-6 md-w-full shadow-sm">
        <CardBody>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex flex-col">
              <Typography variant="h5" color="blue-gray" className="mb-2">
                {title}
              </Typography>
              <Typography>{description}</Typography>
            </div>
            {(addButtonText === 'category' || addButtonText === 'sub category') && (
              <Tabs value={0} className="md:w-96">
                <TabsHeader className="bg-[#cae7df]">
                  {TABS.map(({ label, value }) => (
                    <Tab key={value} value={value} onClick={() => handleTabChange(value)}>
                      &nbsp;&nbsp;{label}&nbsp;&nbsp;
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
            )}
            {(addButtonText === 'discount' || addButtonText === 'voucher') && (
              <Tabs value={0} className="md:w-96">
                <TabsHeader className="bg-[#cae7df]">
                  {TABS_DISCOUNT_VOUCHER.map(({ label, value }) => (
                    <Tab key={value} value={value} onClick={() => handleTabChange(value)}>
                      &nbsp;&nbsp;{label}&nbsp;&nbsp;
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
            )}
            {page === 'admin-management' && (
              <Button variant="outlined" size="sm" color="blue" className="flex flex-row gap-2 items-center mt-2 md:mt-0 rounded-xl h-[37px] md:h-[2rem]">
                <CSVLink data={csvData} headers={AdminCSVHeaders} filename={'Admin Data.csv'}>
                  Export data
                </CSVLink>
                <FaFileCsv className="h-4 w-4" />
              </Button>
            )}
            {page === 'customer-management' && (
              <Button variant="outlined" size="sm" color="blue" className="flex flex-row gap-2 items-center mt-2 md:mt-0 rounded-xl h-[37px] md:h-[2rem]">
                <CSVLink data={csvData} headers={CustomerCSVHeaders} filename={'Customer Data.csv'}>
                  Export data
                </CSVLink>
                <FaFileCsv className="h-4 w-4" />
              </Button>
            )}
            {page === 'product-management' && (
              <Button variant="outlined" size="sm" color="blue" className="flex flex-row gap-2 items-center mt-2 md:mt-0 rounded-xl h-[37px] md:h-[2rem]">
                <CSVLink data={csvData} headers={ProductCSVHeaders} filename={'Product Data.csv'}>
                  Export data
                </CSVLink>
                <FaFileCsv className="h-4 w-4" />
              </Button>
            )}
            {page === 'stock' && (
              <Button variant="outlined" size="sm" color="blue" className="flex flex-row gap-2 items-center mt-2 md:mt-0 rounded-xl h-[37px] md:h-[2rem]">
                <CSVLink data={csvData} headers={ProductBranchCSVHeaders} filename={'Product Branch data.csv'}>
                  Export data
                </CSVLink>
                <FaFileCsv className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            {showAddButton && (
              <Button onClick={handleOpenAdd} className="whitespace-nowrap rounded-2xl bg-[#41907a] shadow-sm w-full md:w-[220px] justify-center">
                <div className="flex items-center gap-2">
                  {addButtonText === 'admin' ? <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> : <IoMdAdd strokeWidth={2} className="h-4 w-4" />}
                  <span>Add {addButtonText}</span>
                </div>
              </Button>
            )}
            <Button onClick={handleReset} variant="outlined" color="green" className="flex rounded-2xl whitespace-nowrap w-full md:w-[230px] justify-center">
              Reset Filter
            </Button>
            <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
            {page === 'stock' && adminDataRedux.isSuperAdmin === true && (
              <Select label="Filter by branch" onChange={(value) => handleFilterByBranch(value)}>
                {branchData?.map((item, index) => (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
