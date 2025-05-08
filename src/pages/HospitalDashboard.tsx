
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import SchemeRecommendationsChart from "@/components/SchemeRecommendationsChart";
import PendingApprovalsTable from "@/components/PendingApprovalsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { statsMap } from "@/lib/mock-data";
import { Building2, Users, CheckCircle, AlertCircle, Download, ArrowRight, ClipboardList, Shield, Table } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const { user } = useAuth();
  const stats = statsMap.hospital;
  const navigate = useNavigate();

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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recently Approved Schemes</CardTitle>
              <CardDescription>Schemes approved and sent to district level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">Patient {10-i}</p>
                      <p className="text-xs text-muted-foreground">Health For All Scheme</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs mr-2 text-muted-foreground">1 day ago</span>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4">View All Approvals</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pending From Facilities</CardTitle>
              <CardDescription>New recommendations awaiting your review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">Patient R-{100+i}</p>
                      <p className="text-xs text-muted-foreground">From: {["City Clinic", "Rural Health Center", "Primary PHC", "Community Hospital"][i]}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7"
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => document.getElementById('pending-approvals')?.scrollIntoView({ behavior: 'smooth' })}>
                View All Pending
              </Button>
            </CardContent>
          </Card>
        </div>

        <SchemeRecommendationsChart />
        
        <div id="pending-approvals">
          <PendingApprovalsTable title="Pending Hospital Approvals" userRole="hospital" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
