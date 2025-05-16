
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import SchemeRecommendationsChart from "@/components/SchemeRecommendationsChart";
import PendingApprovalsTable from "@/components/PendingApprovalsTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, UserCheck, BuildingIcon, BarChart3, Download, FileBarChart, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAlternativeSchemes } from "@/utils/approvalUtils";
import { toast } from "@/components/ui/sonner";

// Empty trend data structure
const emptyTrendData = [
  { name: "Jan", approvals: 0, beneficiaries: 0 },
  { name: "Feb", approvals: 0, beneficiaries: 0 },
  { name: "Mar", approvals: 0, beneficiaries: 0 },
  { name: "Apr", approvals: 0, beneficiaries: 0 },
  { name: "May", approvals: 0, beneficiaries: 0 },
  { name: "Jun", approvals: 0, beneficiaries: 0 },
];

const StateDashboard = () => {
  const { user } = useAuth();
  const [selectedDisease, setSelectedDisease] = useState<string>("diabetes");
  const alternativeSchemes = getAlternativeSchemes(selectedDisease);
  
  // Empty stats object
  const stats = {
    totalPatients: 0,
    totalRecommendations: 0,
    pendingApprovals: 0,
    approvedRecommendations: 0,
    rejectedRecommendations: 0
  };

  const handleRecommendPolicy = () => {
    toast.success("Policy recommendation submitted", {
      description: `Your recommendation for additional schemes for ${selectedDisease} has been submitted to Super Admin.`
    });
  };

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
              <FileBarChart className="mr-2 h-4 w-4" /> Policy Recommendations
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Districts"
            value="0"
            icon={<Map className="h-4 w-4" />}
            description={{
              value: 0,
              isPositive: true
            }}
          />
          <StatsCard
            title="Total Hospitals"
            value="0"
            icon={<BuildingIcon className="h-4 w-4" />}
            description={{
              value: 0,
              isPositive: true
            }}
          />
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<UserCheck className="h-4 w-4" />}
            description={{
              value: 0,
              isPositive: true
            }}
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={<BarChart3 className="h-4 w-4" />}
            description={{
              value: 0,
              isPositive: false
            }}
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
                  data={emptyTrendData}
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
              <CardTitle>Policy Recommendations</CardTitle>
              <CardDescription>Recommend alternative schemes for patients based on disease</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Disease/Condition</label>
                  <Select 
                    value={selectedDisease} 
                    onValueChange={setSelectedDisease}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select disease" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="hypertension">Hypertension</SelectItem>
                      <SelectItem value="malaria">Malaria</SelectItem>
                      <SelectItem value="tuberculosis">Tuberculosis</SelectItem>
                      <SelectItem value="dengue">Dengue</SelectItem>
                      <SelectItem value="cancer">Cancer</SelectItem>
                      <SelectItem value="mental_health">Mental Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Recommended Alternative Schemes:</h4>
                  <div className="space-y-2">
                    {alternativeSchemes.map((scheme, idx) => (
                      <div key={idx} className="flex items-center p-2 border rounded-md">
                        <div className="w-2 h-2 rounded-full bg-healthcare-500 mr-2"></div>
                        <span>{scheme}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full mt-2 bg-healthcare-600 hover:bg-healthcare-700"
                  onClick={handleRecommendPolicy}
                >
                  Submit Policy Recommendation
                </Button>
              </div>
            </CardContent>
          </Card>

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
                        <span className="text-sm text-muted-foreground">0%</span>
                      </div>
                      <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="bg-healthcare-500 h-full rounded-full" style={{ width: "0%" }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <SchemeRecommendationsChart />
        <PendingApprovalsTable title="Pending State Approvals" userRole="state" externalApprovals={[]} />
      </div>
    </DashboardLayout>
  );
};

export default StateDashboard;
