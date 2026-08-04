import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export const ADMIN_EMAIL = "aakshat10g@gmail.com";

export default function AdminRoute({ children }) {
  const user = auth.currentUser;

  if (!user) return <Navigate to="/signin" />;

  const isAdmin = user.email && user.email.trim().toLowerCase() === ADMIN_EMAIL;

  if (!isAdmin) return <Navigate to="/" />;

  return children;
}
