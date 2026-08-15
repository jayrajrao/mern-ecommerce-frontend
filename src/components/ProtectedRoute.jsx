import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap any route element that should only be reachable by
 * logged-in users with an allowed role.
 *
 * Usage:
 *   <ProtectedRoute allowedRoles={["vendor", "admin"]}>
 *     <AddProduct />
 *   </ProtectedRoute>
 *
 * Assumes useAuth() exposes { user, loading } where user.role
 * is one of "user" | "vendor" | "admin". Adjust the field names
 * below if your AuthContext shape is different.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-10 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;