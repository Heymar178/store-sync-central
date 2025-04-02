
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  // Show loading state if auth is still being determined
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Redirect to unauthorized page if not in allowed roles
  if (!hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, show the requested route
  return <>{children}</>;
};

export default ProtectedRoute;
