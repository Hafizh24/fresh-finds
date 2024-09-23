/* eslint-disable react/prop-types */
import { Card, Typography, Button, CardBody, Chip, CardFooter, Avatar } from '@material-tailwind/react'
import { MdContentCopy } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { ChevronUpDownIcon } from '@heroicons/react/24/solid'

export default function CustomerTable({ customerData, currentPage, handlePageChange, totalPages, handleSortBy }) {
  const TABLE_HEAD = ['First Name', 'Last Name', 'Email', 'Referral Code', 'Status', 'Gender', 'Phone Number']

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Item copied', {
      position: 'top-center',
      hideProgressBar: true,
      theme: 'colored'
    })
  }

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
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 hover:bg-[#dff1ec]"
                    onClick={() => {
                      handleSortBy(head)
                    }}>
                    <Typography variant="small" color="blue-gray" className="flex font-bold leading-none opacity-70">
                      {head}
                      {index !== TABLE_HEAD.length - 1 && <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customerData?.map((item, index) => {
                const isLast = index === customerData.length - 1
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
                            {item.firstname}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item.lastname}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <div className="flex flex-row gap-2 items-center">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {item.email}
                          </Typography>
                          <MdContentCopy onClick={() => copyToClipboard(item.email)} className="h-4 w-4 cursor-pointer" color="gray" />
                        </div>
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={item.isVerified ? 'Verified' : 'not verified'}
                          color={item.isVerified ? 'green' : 'blue-gray'}
                          className="md:w-[7rem]"
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item.referral_code}
                        </Typography>
                      </div>
                    </td>

                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          <Chip variant="ghost" size="sm" value={item.isDeleted ? 'Deleted' : 'Active'} color={item.isDeleted ? 'red' : 'green'} />
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={item.firebaseUID != null ? 'Social Register' : 'Regular Register'}
                            color="blue"
                            icon={item.firebaseUID != null ? <FcGoogle className="h-4 w-4" /> : null}
                          />
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item.gender ? item.gender : '-'}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-row gap-2">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item.phoneNumber ? item.phoneNumber : '-'}
                        </Typography>
                        {item.phoneNumber && <MdContentCopy onClick={() => copyToClipboard(item.phoneNumber)} className="h-4 w-4 cursor-pointer" color="gray" />}
                      </div>
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
