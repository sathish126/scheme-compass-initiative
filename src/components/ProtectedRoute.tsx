
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import MobileAppLayout from "./MobileAppLayout";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600"></div>
        <p className="ml-3 text-healthcare-800">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on role
    switch (user.role) {
      case "facility":
        return <Navigate to="/facility-dashboard" replace />;
      case "hospital":
        return <Navigate to="/hospital-dashboard" replace />;
      case "district":
        return <Navigate to="/district-dashboard" replace />;
      case "state":
        return <Navigate to="/state-dashboard" replace />;
      case "super":
        return <Navigate to="/super-admin-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Use mobile layout for mobile devices
  if (isMobile) {
    return <MobileAppLayout>{children}</MobileAppLayout>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
