
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "./pages/Login";
import Index from "./pages/Index";
import FacilityDashboard from "./pages/FacilityDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import DistrictDashboard from "./pages/DistrictDashboard";
import StateDashboard from "./pages/StateDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import PatientEntry from "./pages/PatientEntry";
import PatientList from "./pages/PatientList";
import NotFound from "./pages/NotFound";
import DistrictStats from "./pages/DistrictStats";
import StateStats from "./pages/StateStats";
import SystemSettings from "./pages/SystemSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Role-specific dashboards */}
            <Route 
              path="/facility-dashboard" 
              element={
                <ProtectedRoute allowedRoles={["facility"]}>
                  <FacilityDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hospital-dashboard" 
              element={
                <ProtectedRoute allowedRoles={["hospital"]}>
                  <HospitalDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/district-dashboard" 
              element={
                <ProtectedRoute allowedRoles={["district"]}>
                  <DistrictDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/district-stats" 
              element={
                <ProtectedRoute allowedRoles={["district"]}>
                  <DistrictStats />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/state-dashboard" 
              element={
                <ProtectedRoute allowedRoles={["state"]}>
                  <StateDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/state-stats" 
              element={
                <ProtectedRoute allowedRoles={["state"]}>
                  <StateStats />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={["super"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/system-settings" 
              element={
                <ProtectedRoute allowedRoles={["super"]}>
                  <SystemSettings />
                </ProtectedRoute>
              } 
            />
            
            {/* Common functionality */}
            <Route 
              path="/patient-entry" 
              element={
                <ProtectedRoute allowedRoles={["facility", "hospital"]}>
                  <PatientEntry />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <ProtectedRoute allowedRoles={["facility", "hospital"]}>
                  <PatientList />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 and redirect */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
