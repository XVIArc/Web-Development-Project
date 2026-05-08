import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * Wraps a route so it redirects unauthenticated users to /login.
 * Pass adminOnly={true} to also block non-admin users (redirects to /).
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
