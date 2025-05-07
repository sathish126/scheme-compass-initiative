
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import SchemeRecommendationsChart from "@/components/SchemeRecommendationsChart";
import PendingApprovalsTable from "@/components/PendingApprovalsTable";
import { Button } from "@/components/ui/button";
import { statsMap } from "@/lib/mock-data";
import { Building2, Users, CheckCircle, AlertCircle, Download } from "lucide-react";

const HospitalDashboard = () => {
  const { user } = useAuth();
  const stats = statsMap.hospital;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">{user?.hospital} - Hospital Admin Dashboard</p>
          </div>
          <div>
            <Button variant="outline" className="mr-2">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Button className="bg-healthcare-600 hover:bg-healthcare-700">
              View All Facilities
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<Users className="h-4 w-4" />}
            description="From all facilities"
          />
          <StatsCard
            title="Total Recommendations"
            value={stats.totalRecommendations}
            icon={<Building2 className="h-4 w-4" />}
          />
          <StatsCard
            title="Approved Recommendations"
            value={stats.approvedRecommendations}
            icon={<CheckCircle className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={<AlertCircle className="h-4 w-4" />}
            description="Requiring your attention"
          />
        </div>

        <SchemeRecommendationsChart />
        <PendingApprovalsTable title="Pending Hospital Approvals" userRole="hospital" />
      </div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
