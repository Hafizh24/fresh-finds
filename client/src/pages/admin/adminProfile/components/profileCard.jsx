/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Avatar, CardHeader, Chip, Tooltip, Typography } from '@material-tailwind/react'
import { MdOutlineEmail } from 'react-icons/md'
import { WiTime4 } from 'react-icons/wi'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { BiStore } from 'react-icons/bi'

export function AdminProfileCard({ adminData }) {
  return (
    <div className="flex flex-col p-8 bg-white shadow-sm rounded-3xl w-96 h-auto items-center">
      <div className="flex flex-col items-center">
        <CardHeader floated={false}>
          <img
            src={adminData.profile_picture ? adminData.profile_picture : 'https://th.bing.com/th/id/OIP.0CZd1ESLnyWIHdO38nyJDAAAAA?rs=1&pid=ImgDetMain'}
            alt="profile-picture"
          />
        </CardHeader>
        <div className="flex flex-row w-full -mb-3 p-3 gap-2 items-center">
          <Typography variant="h3" className="text-gray-700">
            {adminData?.name}
          </Typography>
          <Chip
            variant="filled"
            size="sm"
            value={adminData?.isVerified ? 'Verified' : 'not verified'}
            color={adminData?.isVerified ? 'green' : 'blue-gray'}
            className="h-1/2"
          />
        </div>
        <div className="flex flex-col w-full p-3 gap-2">
          <div className="flex flex-row items-center gap-1">
            <MdOutlineAdminPanelSettings className="w-5 h-5 text-[#41907a]" />
            <Typography className="-mb-1 text-[#41907a]" variant="h6">
              Role
            </Typography>
          </div>
          <Typography className="text-gray-700">{adminData?.isSuperAdmin ? <>Super Admin</> : <>Admin</>}</Typography>
          <div className="flex flex-row items-center gap-1">
            <MdOutlineEmail className="w-5 h-5 text-[#41907a]" />
            <Typography className="-mb-1 text-[#41907a]" variant="h6">
              Email
            </Typography>
          </div>
          <Typography className="text-gray-700">{adminData?.email}</Typography>
          {adminData?.isSuperAdmin === false && (
            <>
              <div className="flex flex-row items-center gap-1">
                <BiStore className="w-5 h-5 text-[#41907a]" />
                <Typography className="-mb-1 text-[#41907a]" variant="h6">
                  Branch
                </Typography>
              </div>
              <div className="flex flex-row items-center gap-1">
                <Typography className="text-gray-700">{adminData?.Branches[0]?.name}</Typography>
                <Tooltip
                  content={
                    <div className="w-80">
                      <Typography variant="small" color="white" className="font-normal opacity-80">
                        <div className="flex flex-col">
                          <Typography variant="small">{adminData?.Branches[0]?.name}</Typography>
                          <Typography variant="small">{adminData?.Branches[0]?.address}</Typography>
                          <Typography variant="small">{adminData?.Branches[0]?.contactNumber}</Typography>
                          <Typography variant="small">{adminData?.Branches[0]?.isActive === true ? 'Active' : 'Disabled'}</Typography>
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
            </>
          )}
          <div className="flex flex-row items-center gap-1">
            <WiTime4 className="w-5 h-5 text-[#41907a]" />
            <Typography className="-mb-1 text-[#41907a]" variant="h6">
              Registered at
            </Typography>
          </div>
          <Typography className="text-gray-700">{adminData?.formattedCreatedAt}</Typography>
        </div>
      </div>
    </div>
  )
}
