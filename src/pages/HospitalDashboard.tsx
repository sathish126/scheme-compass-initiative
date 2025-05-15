
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import SchemeRecommendationsChart from "@/components/SchemeRecommendationsChart";
import PendingApprovalsTable from "@/components/PendingApprovalsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, CheckCircle, AlertCircle, Download, ArrowRight, ClipboardList, Shield, Table } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats, getApprovalsByLevel, PatientApproval, approveRecommendation, rejectRecommendation } from "@/utils/localStorageUtils";
import { exportApprovalsToCSV } from "@/utils/approvalUtils";
import Loading from "@/components/ui/loading";
import { toast } from "@/components/ui/sonner";

const HospitalDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    registeredToday: 0,
    pendingApprovals: 0,
    patientFollowups: 0
  });
  const [pendingApprovals, setPendingApprovals] = useState<PatientApproval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage
    const loadDashboardData = () => {
      try {
        // Get stats from localStorage
        const dashboardStats = getDashboardStats("hospital");
        setStats(dashboardStats);
        
        // Get hospital-level approvals
        const approvals = getApprovalsByLevel("hospital");
        setPendingApprovals(approvals);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Handle approval
  const handleApprove = (approval: PatientApproval) => {
    approveRecommendation(approval.id);
    setPendingApprovals(pendingApprovals.filter(item => item.id !== approval.id));
    
    toast.success(`Scheme recommendation for ${approval.patientName} approved`, {
      description: "The recommendation has been sent to the district for review."
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

  // Export data
  const handleExportData = () => {
    if (pendingApprovals.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    exportApprovalsToCSV(pendingApprovals, "Hospital-Approvals");
    toast.success("Data exported successfully");
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">{user?.hospital} - Hospital Admin Dashboard</p>
          </div>
          <div>
            <Button variant="outline" className="mr-2" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Button className="bg-healthcare-600 hover:bg-healthcare-700" onClick={() => navigate("/patients")}>
              <Table className="mr-2 h-4 w-4" /> All Patient Records
            </Button>
          </div>
        </div>

        {/* Approval Workflow Status */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium mt-2">Facility</p>
                <p className="text-xs text-muted-foreground">Submitted</p>
              </div>
              <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-healthcare-100 flex items-center justify-center border-2 border-healthcare-500">
                  <Building2 className="h-6 w-6 text-healthcare-600" />
                </div>
                <p className="text-sm font-medium mt-2">Hospital</p>
                <p className="text-xs text-muted-foreground">Current</p>
              </div>
              <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium mt-2">District</p>
                <p className="text-xs text-muted-foreground">Next</p>
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
            description="From all facilities"
          />
          <StatsCard
            title="Total Recommendations"
            value={(stats.pendingApprovals + stats.patientFollowups).toString()}
            icon={<Building2 className="h-4 w-4" />}
          />
          <StatsCard
            title="Approved Recommendations"
            value={stats.patientFollowups.toString()}
            icon={<CheckCircle className="h-4 w-4" />}
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals.toString()}
            icon={<AlertCircle className="h-4 w-4" />}
            description="Requiring your attention"
          />
        </div>

        <SchemeRecommendationsChart />
        
        <div id="pending-approvals">
          <PendingApprovalsTable 
            title="Pending Hospital Approvals" 
            userRole="hospital"
            externalApprovals={pendingApprovals} 
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
