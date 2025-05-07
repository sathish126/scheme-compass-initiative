
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import SchemeRecommendationsChart from "@/components/SchemeRecommendationsChart";
import PendingApprovalsTable from "@/components/PendingApprovalsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { statsMap } from "@/lib/mock-data";
import { Map, UserCheck, BuildingIcon, BarChart3, Download, FileBarChart, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const trendData = [
  { name: "Jan", approvals: 65, beneficiaries: 42 },
  { name: "Feb", approvals: 78, beneficiaries: 50 },
  { name: "Mar", approvals: 90, beneficiaries: 65 },
  { name: "Apr", approvals: 85, beneficiaries: 70 },
  { name: "May", approvals: 120, beneficiaries: 85 },
  { name: "Jun", approvals: 150, beneficiaries: 105 },
];

const StateDashboard = () => {
  const { user } = useAuth();
  const stats = statsMap.state;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">{user?.state} - State Admin Dashboard</p>
          </div>
          <div>
            <Button variant="outline" className="mr-2">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Button className="bg-healthcare-600 hover:bg-healthcare-700">
              <FileBarChart className="mr-2 h-4 w-4" /> Policy Analysis
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Districts"
            value="12"
            icon={<Map className="h-4 w-4" />}
            description="In your state"
          />
          <StatsCard
            title="Total Hospitals"
            value="86"
            icon={<BuildingIcon className="h-4 w-4" />}
            description="Across all districts"
          />
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<UserCheck className="h-4 w-4" />}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={<BarChart3 className="h-4 w-4" />}
            description="Requiring your attention"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="approvals" name="Scheme Approvals" stroke="#0284c7" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="beneficiaries" name="Beneficiaries" stroke="#0ea5e9" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>District Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Central", "Northern", "Eastern", "Western", "Southern"].map((district, i) => (
                  <div key={i} className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-healthcare-500" />
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{district} District</p>
                        <span className="text-sm text-muted-foreground">{85 - i * 5}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="bg-healthcare-500 h-full rounded-full" style={{ width: `${85 - i * 5}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheme Coverage by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">General</p>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">OBC</p>
                      <span className="text-sm text-muted-foreground">72%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">SC</p>
                      <span className="text-sm text-muted-foreground">83%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: "83%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">ST</p>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <SchemeRecommendationsChart />
        <PendingApprovalsTable title="Pending State Approvals" userRole="state" />
      </div>
    </DashboardLayout>
  );
};

export default StateDashboard;
