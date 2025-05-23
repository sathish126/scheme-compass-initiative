import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import PendingApprovalsTable from "@/components/PendingApprovalsTable";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ClipboardList, 
  Users, 
  UserCheck, 
  PlusCircle, 
  ArrowRight, 
  Building, 
  CheckCircle,
  BookOpen 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Patient } from "@/types";
import { getDashboardStats, getApprovalsByLevel, getPatients, PatientApproval, approveRecommendation, rejectRecommendation } from "@/utils/localStorageUtils";
import { exportPatientsToCSV } from "@/utils/approvalUtils";
import Loading from "@/components/ui/loading";

const FacilityDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [facilityPatients, setFacilityPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    registeredToday: 0,
    pendingApprovals: 0,
    patientFollowups: 0
  });
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState<PatientApproval[]>([]);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get patients and approvals data
        const patients = getPatients();
        setFacilityPatients(patients);
        
        // Get stats from localStorage
        const data = getDashboardStats("facility");
        setStats(data);
        
        // Get facility-level approvals
        const approvals = getApprovalsByLevel("facility");
        setPendingApprovals(approvals);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        toast.error("Error loading dashboard data", {
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user, navigate]);
  
  // Handle approval
  const handleApprove = (approval: PatientApproval) => {
    approveRecommendation(approval.id);
    setPendingApprovals(pendingApprovals.filter(item => item.id !== approval.id));
    
    toast.success(`Scheme recommendation for ${approval.patientName} approved`, {
      description: "The recommendation has been sent to the hospital for review."
    });
  };

  // Handle rejection
  const handleReject = (approval: PatientApproval, reason: string) => {
    rejectRecommendation(approval.id, reason);
    setPendingApprovals(pendingApprovals.filter(item => item.id !== approval.id));
    
    toast.success(`Scheme recommendation for ${approval.patientName} rejected`, {
      description: reason
    });
  };
  
  const handleExportPatientData = () => {
    if (facilityPatients.length === 0) {
      toast.error("No patient data to export");
      return;
    }
    
    exportPatientsToCSV(facilityPatients, "Patient-Records");
    toast.success("Patient records exported successfully");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loading size="large" text="Loading dashboard data..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">{user?.facility} - Facility Dashboard</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/get-started")}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <BookOpen className="mr-2 h-4 w-4" /> Integration Guide
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportPatientData}
            >
              <ClipboardList className="mr-2 h-4 w-4" /> Export Patient Records
            </Button>
            <Button 
              className="bg-healthcare-600 hover:bg-healthcare-700"
              onClick={() => navigate("/patient-entry")}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Patient
            </Button>
          </div>
        </div>

        {/* Approval Workflow Status */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-healthcare-100 flex items-center justify-center border-2 border-healthcare-500">
                  <ClipboardList className="h-6 w-6 text-healthcare-600" />
                </div>
                <p className="text-sm font-medium mt-2">Facility</p>
                <p className="text-xs text-muted-foreground">Current</p>
              </div>
              <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Building className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium mt-2">Hospital</p>
                <p className="text-xs text-muted-foreground">Next</p>
              </div>
              <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium mt-2">District</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium mt-2">State</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients.toString()}
            icon={<Users className="h-4 w-4" />}
            description={{
              value: 0,
              isPositive: true
            }}
            trend="up"
          />
          <StatsCard
            title="Registered Today"
            value={stats.registeredToday.toString()}
            icon={<ClipboardList className="h-4 w-4" />}
            description={{
              value: stats.registeredToday,
              isPositive: true
            }}
            trend="up"
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals.toString()}
            icon={<ClipboardList className="h-4 w-4" />}
            description={{
              value: stats.pendingApprovals,
              isPositive: false
            }}
            trend="down"
          />
          <StatsCard
            title="Patient Follow-ups"
            value={stats.patientFollowups.toString()}
            icon={<UserCheck className="h-4 w-4" />}
            description={{
              value: stats.patientFollowups,
              isPositive: true
            }}
            trend="up"
          />
        </div>

        <PendingApprovalsTable 
          title="Patient Scheme Recommendations" 
          userRole="facility" 
          externalApprovals={pendingApprovals} 
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </DashboardLayout>
  );
};

export default FacilityDashboard;
