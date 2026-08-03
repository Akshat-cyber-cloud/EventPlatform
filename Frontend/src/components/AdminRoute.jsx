import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export const ADMIN_UID = "pijoc1HoHnW89CSLJN1LJdpxwri2";
export const ADMIN_EMAIL = "aakshat10g@gmail.com";

export default function AdminRoute({ children }) {
  const user = auth.currentUser;

  if (!user) return <Navigate to="/signin" />;

  const isAdmin = user.uid === ADMIN_UID || 
                  user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
                  user.email?.toLowerCase().includes("aakshat10g") ||
                  user.displayName?.toLowerCase().includes("aakshat10g");

  if (!isAdmin) return <Navigate to="/" />;

  return children;
}
