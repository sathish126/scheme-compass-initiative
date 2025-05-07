
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        switch (user.role) {
          case "facility":
            navigate("/facility-dashboard");
            break;
          case "hospital":
            navigate("/hospital-dashboard");
            break;
          case "district":
            navigate("/district-dashboard");
            break;
          case "state":
            navigate("/state-dashboard");
            break;
          case "super":
            navigate("/super-admin-dashboard");
            break;
          default:
            navigate("/login");
        }
      } else {
        navigate("/login");
      }
    }
  }, [navigate, user, isAuthenticated, isLoading]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600 mx-auto"></div>
        <p className="mt-4 text-healthcare-800">Redirecting to the appropriate dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
