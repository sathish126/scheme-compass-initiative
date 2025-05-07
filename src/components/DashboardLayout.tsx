
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, User, UserCircle, Users, BarChart2, FileText, Home, Settings, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  roles: string[];
}

const navigation: NavigationItem[] = [
  { title: "Dashboard", icon: <Home className="w-5 h-5" />, href: "/", roles: ["facility", "hospital", "district", "state", "super"] },
  { title: "Patients", icon: <Users className="w-5 h-5" />, href: "/patients", roles: ["facility", "hospital"] },
  { title: "Scheme Recommendations", icon: <FileText className="w-5 h-5" />, href: "/recommendations", roles: ["facility", "hospital", "district", "state", "super"] },
  { title: "Reports", icon: <BarChart2 className="w-5 h-5" />, href: "/reports", roles: ["hospital", "district", "state", "super"] },
  { title: "Settings", icon: <Settings className="w-5 h-5" />, href: "/settings", roles: ["facility", "hospital", "district", "state", "super"] },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const getRoleTitle = () => {
    switch (user?.role) {
      case "facility":
        return "Facility User";
      case "hospital":
        return "Hospital Admin";
      case "district":
        return "District Admin";
      case "state":
        return "State Admin";
      case "super":
        return "Super Admin";
      default:
        return "User";
    }
  };
  
  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold text-healthcare-800">Healthcare Compass</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href || 
                               (item.href !== "/" && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.title}
                  to={item.href === "/" ? 
                      user?.role === "facility" ? "/facility-dashboard" : 
                      user?.role === "hospital" ? "/hospital-dashboard" : 
                      user?.role === "district" ? "/district-dashboard" : 
                      user?.role === "state" ? "/state-dashboard" : 
                      user?.role === "super" ? "/super-admin-dashboard" : "/" : item.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-healthcare-100 text-healthcare-800"
                      : "text-gray-600 hover:bg-healthcare-50 hover:text-healthcare-700"
                  )}
                >
                  <div className={cn(
                    "mr-3",
                    isActive ? "text-healthcare-600" : "text-gray-400"
                  )}>
                    {item.icon}
                  </div>
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 border-t p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCircle className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{getRoleTitle()}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="bg-white shadow z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Open sidebar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </Button>
              </div>
              
              {/* Left part */}
              <div className="flex md:hidden">
                <h2 className="text-lg font-semibold text-healthcare-800">Healthcare Compass</h2>
              </div>
              
              {/* Right part */}
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Bell className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
