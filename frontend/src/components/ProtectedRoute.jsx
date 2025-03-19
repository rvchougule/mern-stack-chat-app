import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import useRefreshToken from "../hooks/useRefreshToken";
import axios from "axios";
const ProtectedRoute = () => {
  useRefreshToken();
  const token = useSelector((state) => state.user.token);
  axios.defaults.headers.common["Authorization"] = token;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
