import { Navigate } from "react-router-dom";
import {logout} from "../api"
export default function LogOut() {
  logout();
  return <Navigate to="/login" />;
}