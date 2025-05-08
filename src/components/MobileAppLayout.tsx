
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, FileText, Database, TrendingUp, Users, Link, ArrowLeftRight, Settings } from "lucide-react";
import { UserRole } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileAppLayoutProps {
  children: React.ReactNode;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const getNavItems = (role: UserRole) => {
    const commonItems = [
      { 
        label: "Dashboard", 
        icon: <Database className="h-5 w-5" />, 
        onClick: () => navigateBasedOnRole(role)
      },
    ];

    switch (role) {
      case "facility":
        return [
          ...commonItems,
          { 
            label: "Patient Entry", 
            icon: <FileText className="h-5 w-5" />, 
            onClick: () => navigate("/patient-entry") 
          },
          { 
            label: "Patient List", 
            icon: <Users className="h-5 w-5" />, 
            onClick: () => navigate("/patients") 
          },
        ];
      case "hospital":
        return [
          ...commonItems,
          { 
            label: "Patient Entry", 
            icon: <FileText className="h-5 w-5" />, 
            onClick: () => navigate("/patient-entry") 
          },
          { 
            label: "Patient List", 
            icon: <Users className="h-5 w-5" />, 
            onClick: () => navigate("/patients") 
          },
          { 
            label: "Approvals", 
            icon: <ArrowLeftRight className="h-5 w-5" />, 
            onClick: () => navigate("/hospital-dashboard") 
          },
        ];
      case "district":
        return [
          ...commonItems,
          { 
            label: "Hospitals", 
            icon: <Link className="h-5 w-5" />, 
            onClick: () => navigate("/district-dashboard") 
          },
          { 
            label: "District Stats", 
            icon: <TrendingUp className="h-5 w-5" />, 
            onClick: () => navigate("/district-stats") 
          },
        ];
      case "state":
        return [
          ...commonItems,
          { 
            label: "Districts", 
            icon: <Link className="h-5 w-5" />, 
            onClick: () => navigate("/state-dashboard") 
          },
          { 
            label: "State Stats", 
            icon: <TrendingUp className="h-5 w-5" />, 
            onClick: () => navigate("/state-stats") 
          },
        ];
      case "super":
        return [
          ...commonItems,
          { 
            label: "User Management", 
            icon: <Users className="h-5 w-5" />, 
            onClick: () => navigate("/super-admin-dashboard") 
          },
          { 
            label: "System Settings", 
            icon: <Settings className="h-5 w-5" />, 
            onClick: () => navigate("/system-settings") 
          },
        ];
      default:
        return commonItems;
    }
  };

  const navigateBasedOnRole = (role: UserRole) => {
    switch (role) {
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
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] sm:w-[350px]">
                <div className="py-4">
                  <div className="px-3 py-2">
                    <div className="mb-2 flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {user?.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                      </div>
                    </div>
                  </div>
                  <nav className="space-y-1 px-3">
                    {user && getNavItems(user.role).map((item, index) => (
                      <button
                        key={index}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          item.onClick();
                          setOpen(false);
                        }}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </button>
                    ))}
                    <button
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      onClick={logout}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span className="ml-3">Logout</span>
                    </button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold">
              HDIMS 
              <span className="text-xs ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Mobile
              </span>
            </h1>
          </div>
          <div className="flex items-center">
            {user && (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {user.name.substring(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="container p-4 pb-16">
        {children}
      </main>
    </div>
  );
};

export default MobileAppLayout;
