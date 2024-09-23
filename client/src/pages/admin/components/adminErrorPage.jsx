/* eslint-disable react/no-unescaped-entities */
import { Button, Typography } from '@material-tailwind/react'
import { Link } from 'react-router-dom'

import logo from '../../../assets/logo-app-1.png'

export default function AdminErrorPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5 p-28 bg-[#edf7f4]">
      <div className="flex flex-col w-1/2 items-center gap-6 h-full">
        <img src={logo} alt="logo" className="h-20 rounded-lg object-cover hidden md:block"></img>
        <div className="flex flex-col justify-center items-center gap-6 basis-1/2 mt-24">
          <Typography variant="h3">You don't have the right permissions to view this page.</Typography>
          <Link to={'/admin-overview'}>
            <Button variant="outlined" color="green">
              Back to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
