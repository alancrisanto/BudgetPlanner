import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "./components/Spinner";

function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spinner />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
