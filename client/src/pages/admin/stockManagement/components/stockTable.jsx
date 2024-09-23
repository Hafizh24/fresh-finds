/* eslint-disable react/prop-types */
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip } from '@material-tailwind/react'
import { PencilIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/react/24/solid'
import { TbReportAnalytics } from 'react-icons/tb'

export default function StockTable({ handleEdit, handleHistory, handleDelete, productBranchData, currentPage, handlePageChange, totalPages, handleSortBy }) {
  const TABLE_HEAD = ['ID', 'Product Name', 'Branch', 'Stock', 'Action']

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
              {productBranchData?.map((item, index) => {
                const isLast = index === productBranchData.length - 1
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
                          {item.Product.name.length > 30 ? `${item.Product.name.substring(0, 30)}...` : item.Product.name}
                        </Typography>
                        <Tooltip
                          content={
                            <div className="w-80">
                              <Typography color="white" className="font-medium">
                                {item.Product.name}
                              </Typography>
                              <Typography variant="small" color="white" className="font-normal opacity-80">
                                <div className="flex flex-col">
                                  <Typography variant="small">Price: Rp.{item.Product.price}</Typography>
                                  <Typography variant="small">Weight: {item.Product.weight}gr</Typography>
                                </div>
                              </Typography>
                            </div>
                          }
                          animate={{
                            mount: { scale: 1, y: 0 },
                            unmount: { scale: 0, y: 25 }
                          }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-5 w-5 cursor-pointer text-blue-gray-500">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                            />
                          </svg>
                        </Tooltip>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-row gap-2">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item.Branch.name}
                        </Typography>
                        <Tooltip
                          content={
                            <div className="w-80">
                              <Typography color="white" className="font-medium">
                                {item.Branch.name}
                              </Typography>
                              <Typography variant="small" color="white" className="font-normal opacity-80">
                                <div className="flex flex-col">
                                  <Typography variant="small">Contact number: {item.Branch.contactNumber}</Typography>
                                  <Typography variant="small">Address: {item.Branch.fullAddress}</Typography>
                                </div>
                              </Typography>
                            </div>
                          }
                          animate={{
                            mount: { scale: 1, y: 0 },
                            unmount: { scale: 0, y: 25 }
                          }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-5 w-5 cursor-pointer text-blue-gray-500">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                            />
                          </svg>
                        </Tooltip>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          <span style={{ fontWeight: 'bold' }}>{item.stock}</span>
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <IconButton onClick={() => handleEdit(item)} variant="text">
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton onClick={() => handleHistory(item)} variant="text">
                        <TbReportAnalytics className="h-4 w-4" />
                      </IconButton>
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
