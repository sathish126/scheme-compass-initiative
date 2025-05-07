
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import SchemeRecommendationsChart from "@/components/SchemeRecommendationsChart";
import PendingApprovalsTable from "@/components/PendingApprovalsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { statsMap } from "@/lib/mock-data";
import { Building, UserCheck, CheckCircle, AlertCircle, Download, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc"];

const data = [
  { name: "Hospital A", value: 35 },
  { name: "Hospital B", value: 25 },
  { name: "Hospital C", value: 20 },
  { name: "Hospital D", value: 15 },
];

const DistrictDashboard = () => {
  const { user } = useAuth();
  const stats = statsMap.district;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">{user?.district} District - Admin Dashboard</p>
          </div>
          <div>
            <Button variant="outline" className="mr-2">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Button className="bg-healthcare-600 hover:bg-healthcare-700">
              <BarChart3 className="mr-2 h-4 w-4" /> Generate Analytics
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<UserCheck className="h-4 w-4" />}
            description="Across all hospitals"
          />
          <StatsCard
            title="Hospitals"
            value="8"
            icon={<Building className="h-4 w-4" />}
            description="In your district"
          />
          <StatsCard
            title="Approved Recommendations"
            value={stats.approvedRecommendations}
            icon={<CheckCircle className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
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
              <CardTitle>Hospital Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Recommended Schemes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Health For All</p>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="bg-healthcare-500 h-full rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Senior Care Plus</p>
                      <span className="text-sm text-muted-foreground">48%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="bg-healthcare-500 h-full rounded-full" style={{ width: "48%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Child Health Initiative</p>
                      <span className="text-sm text-muted-foreground">42%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="bg-healthcare-500 h-full rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Maternal Welfare Scheme</p>
                      <span className="text-sm text-muted-foreground">35%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="bg-healthcare-500 h-full rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <SchemeRecommendationsChart />
        <PendingApprovalsTable title="Pending District Approvals" userRole="district" />
      </div>
    </DashboardLayout>
  );
};

export default DistrictDashboard;
