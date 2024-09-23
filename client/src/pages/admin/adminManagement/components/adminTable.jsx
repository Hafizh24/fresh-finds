/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Card, Typography, Button, CardBody, Chip, CardFooter, Avatar, IconButton, Tooltip } from '@material-tailwind/react'
import { PencilIcon, TrashIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import { Helper } from '../../components/icons'

export default function AdminTable({ handleDelete, handleEdit, adminData, currentPage, handlePageChange, totalPages, handleSortBy }) {
  const TABLE_HEAD = ['Name', 'Username', 'Email', 'Branch', 'Action']
  const navigate = useNavigate()

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Verification code copied', {
      position: 'top-center',
      hideProgressBar: true,
      theme: 'colored'
    })
  }

  return (
    <div className="w-screen md:w-5/6">
      <Card className="h-full w-full shadow-sm">
        <CardBody className="overflow-auto px-0 py-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    onClick={() => {
                      handleSortBy(head)
                    }}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-[#dff1ec]">
                    <Typography variant="small" color="blue-gray" className="flex items-center justify-between font-bold leading-none opacity-70">
                      {head}
                      {index !== TABLE_HEAD.length - 1 && <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminData?.map((item, index) => {
                const isLast = index === adminData.length - 1
                const classes = isLast ? 'p-5' : 'p-5 border-b border-blue-gray-50'
                return (
                  <tr key={item.name}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={
                            item.profile_picture
                              ? item.profile_picture
                              : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'
                          }
                          alt={item.name}
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {item.name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item.username}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col md:w-1/2">
                        <div className="flex flex-row items-center gap-1">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {item.email}
                          </Typography>
                          <div onClick={() => copyToClipboard(item.verification_code)}>
                            <Helper content={`Verification code: ${item.verification_code}`} />
                          </div>
                        </div>
                        <Chip variant="ghost" size="sm" value={item.isVerified ? 'Verified' : 'not verified'} color={item.isVerified ? 'green' : 'blue-gray'} />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal cursor-pointer hover:underline hover:underline-offset-2"
                          onClick={() => {
                            if (item.Branches[0]?.id) {
                              navigate(`/store-management/${item.Branches[0]?.id}`)
                            }
                          }}>
                          {item.Branches[0]?.name ? item.Branches[0]?.name : 'Empty'}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      {/* <Tooltip content="Edit User">
                                                        <IconButton onClick={() => handleEdit(item)} variant="text">
                                                            <PencilIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip> */}
                      <Tooltip content={`Delete ${item.name}`}>
                        <IconButton onClick={() => handleDelete(item)} variant="text">
                          <TrashIcon className="h-4 w-4" color="red" />
                        </IconButton>
                      </Tooltip>
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
            <Button className="rounded-2xl" onClick={() => handlePageChange(currentPage - 1)} variant="outlined" size="sm" disabled={currentPage === 1}>
              Previous
            </Button>
            <Button className="rounded-2xl" onClick={() => handlePageChange(currentPage + 1)} variant="outlined" size="sm" disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
