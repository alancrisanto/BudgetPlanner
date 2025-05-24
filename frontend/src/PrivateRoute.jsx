import { useAuth } from "./context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"


function PrivateRoute() {
  const { isAuthenticated } = useAuth()

  // Check if the user is authenticated
  if (!isAuthenticated) {
    // Redirect to the login page or show an error message
    return <Navigate to="/login" replace />
  }
  return (
    <Outlet />
  )
}

export default PrivateRoute