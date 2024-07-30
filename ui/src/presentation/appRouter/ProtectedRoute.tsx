import { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../../domain/valueObjects/utils";

interface ProtectedPageRouteProps {
  adminOnly?: boolean
}

const ProtectedRoute: FC<PropsWithChildren<ProtectedPageRouteProps>> = ({ children, adminOnly }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") ?? 'false';

  const user = getUser();

  const isAdmin = (user?.role === "SuperAdmin" || user?.role === "Admin")

  if (isLoggedIn === "false") {
    return <Navigate to="/login" replace />;
  } else if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute