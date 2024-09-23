/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip } from '@material-tailwind/react'
import { PencilIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/react/24/solid'
import { TbReportAnalytics } from 'react-icons/tb'

export default function VoucherTable({ handleEdit, handleHistory, handleDelete, voucherData, currentPage, handlePageChange, totalPages, handleSortBy }) {
  const TABLE_HEAD = ['ID', 'Code', 'Type', 'Value', 'Discount Amount', 'Start Date', 'End Date', 'Action']

  return (
    <div className="w-screen md:w-5/6">
      <Card className="h-full w-full shadow-sm">
        <CardBody className="overflow-scroll px-0 py-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    onClick={() => {
                      handleSortBy(head)
                    }}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 hover:bg-[#dff1ec]">
                    <Typography variant="small" color="blue-gray" className="flex items-center justify-between font-bold leading-none opacity-70">
                      {head}
                      {index !== TABLE_HEAD.length - 1 && <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {voucherData?.map((item, index) => {
                const isLast = index === voucherData.length - 1
                const classes = isLast ? 'p-5' : 'p-5 border-b border-blue-gray-50'
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {item.id}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-row gap-2">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          <span style={{ fontWeight: 'bold' }}>{item.code}</span>
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-row gap-2">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          <span>{item.type}</span>
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          <span>{item.value}</span>
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item.value === 'percentage' ? <span>{item.amount}%</span> : <span>{item.amount}</span>}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          <span>{item.formattedStartDate}</span>
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          <span>{item.formattedEndDate}</span>
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <IconButton onClick={() => handleDelete(item)} variant="text">
                        <TrashIcon className="h-4 w-4" color="red" />
                      </IconButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {totalPages}
          </Typography>
          <div className="flex gap-2">
            <Button onClick={() => handlePageChange(currentPage - 1)} variant="outlined" size="sm" disabled={currentPage === 1}>
              Previous
            </Button>
            <Button onClick={() => handlePageChange(currentPage + 1)} variant="outlined" size="sm" disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
