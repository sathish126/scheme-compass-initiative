
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Database, FileText, TrendingUp, Users, Link, Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        setIsRedirecting(true);
        
        // Add a small delay for animation
        const timer = setTimeout(() => {
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
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [navigate, user, isAuthenticated, isLoading]);

  if (isLoading || isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-24 h-24 mb-6 relative">
          <div className="animate-spin rounded-full h-full w-full border-b-2 border-healthcare-600 absolute"></div>
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl font-bold text-healthcare-800">HD</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-healthcare-900 mb-2">HDIMS Mobile</h1>
        <p className="text-healthcare-700 text-center text-sm mb-4">Health Data Information Management System</p>
        <p className="text-healthcare-600 text-sm animate-pulse">
          {isRedirecting ? "Redirecting to your dashboard..." : "Initializing..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center mb-8">
          <div className="w-20 h-20 bg-healthcare-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Database className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-healthcare-900 mb-2">HDIMS Mobile</h1>
          <p className="text-healthcare-700 mb-8">
            Health Data Information Management System for healthcare professionals
          </p>
          <Button 
            className="w-full py-6 bg-healthcare-600 hover:bg-healthcare-700 mb-4 text-lg"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
          <p className="text-sm text-muted-foreground">
            Access the healthcare data management platform
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-healthcare-600" />
            <h3 className="font-medium">Data Input</h3>
            <p className="text-xs text-muted-foreground">Update health data</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100 text-center">
            <Database className="h-8 w-8 mx-auto mb-2 text-healthcare-600" />
            <h3 className="font-medium">Real-time Access</h3>
            <p className="text-xs text-muted-foreground">Instant data visibility</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100 text-center">
            <Link className="h-8 w-8 mx-auto mb-2 text-healthcare-600" />
            <h3 className="font-medium">Integration</h3>
            <p className="text-xs text-muted-foreground">With existing systems</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-healthcare-600" />
            <h3 className="font-medium">Performance</h3>
            <p className="text-xs text-muted-foreground">Track health schemes</p>
          </div>
        </div>
        
        <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <Shield className="h-5 w-5 mr-2 text-healthcare-600" />
            <p className="font-medium">Secure Access</p>
          </div>
          <p className="text-sm text-muted-foreground">
            The HDIMS Mobile application provides secure access for authorized healthcare personnel 
            at facility, hospital, district, and state levels.
          </p>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Health Department. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
