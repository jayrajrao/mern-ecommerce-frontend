import { Navigate } from "react-router-dom";

// This app authenticates via a JWT in localStorage (see api.js interceptor,
// NavBar.jsx) — AuthContext.user is not populated anywhere, so we read the
// role straight off the token instead of depending on AuthContext.
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const payload = parseJwt(token);

  if (!payload) {
    // malformed token — treat as logged out
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (payload.exp && Date.now() >= payload.exp * 1000) {
    // expired token
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;