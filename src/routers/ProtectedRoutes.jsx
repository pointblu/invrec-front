import { Navigate, Outlet } from "react-router-dom";

import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/ingreso" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  requiredRole: PropTypes.string,
};
