
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import FacilityDashboard from "@/pages/FacilityDashboard";
import HospitalDashboard from "@/pages/HospitalDashboard";
import DistrictDashboard from "@/pages/DistrictDashboard";
import StateDashboard from "@/pages/StateDashboard";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import PatientEntry from "@/pages/PatientEntry";
import PatientList from "@/pages/PatientList";
import DistrictStats from "@/pages/DistrictStats";
import StateStats from "@/pages/StateStats";
import SystemSettings from "@/pages/SystemSettings";
import GetStartedPage from "@/pages/GetStartedPage";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            
            {/* Protected Routes */}
            <Route path="/facility-dashboard" element={
              <ProtectedRoute allowedRoles={["facility"]}>
                <FacilityDashboard />
              </ProtectedRoute>
            } />
            <Route path="/hospital-dashboard" element={
              <ProtectedRoute allowedRoles={["hospital"]}>
                <HospitalDashboard />
              </ProtectedRoute>
            } />
            <Route path="/district-dashboard" element={
              <ProtectedRoute allowedRoles={["district"]}>
                <DistrictDashboard />
              </ProtectedRoute>
            } />
            <Route path="/state-dashboard" element={
              <ProtectedRoute allowedRoles={["state"]}>
                <StateDashboard />
              </ProtectedRoute>
            } />
            <Route path="/super-admin-dashboard" element={
              <ProtectedRoute allowedRoles={["super"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/patient-entry" element={
              <ProtectedRoute allowedRoles={["facility"]}>
                <PatientEntry />
              </ProtectedRoute>
            } />
            <Route path="/patient-list" element={
              <ProtectedRoute>
                <PatientList />
              </ProtectedRoute>
            } />
            <Route path="/district-stats" element={
              <ProtectedRoute allowedRoles={["district", "state", "super"]}>
                <DistrictStats />
              </ProtectedRoute>
            } />
            <Route path="/state-stats" element={
              <ProtectedRoute allowedRoles={["state", "super"]}>
                <StateStats />
              </ProtectedRoute>
            } />
            <Route path="/system-settings" element={
              <ProtectedRoute allowedRoles={["super"]}>
                <SystemSettings />
              </ProtectedRoute>
            } />
            
            {/* Fallback routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
