import { Navigate, Outlet } from "react-router-dom";

function AdminRequired() {
    const token = localStorage.getItem("admtoken")
    return (
        <>
            {
                token ? <Outlet></Outlet> : <Navigate to='/login-admin' />
            }
        </>
    )
}

export default AdminRequired;