
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import PendingApprovalsTable from "@/components/PendingApprovalsTable";
import { useAuth } from "@/contexts/AuthContext";
import { UsersRound, ClipboardList, CheckCheck, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FacilityDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">{user?.facility} - Facility Dashboard</p>
          </div>
          <div>
            <Button 
            className="bg-healthcare-600 hover:bg-healthcare-700"
            onClick={() => navigate("/patient-entry")}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Patient
          </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Patients"
            value="48"
            icon={<Users className="h-4 w-4" />}
            description="4 new patients this week"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Scheme Recommendations"
            value="38"
            icon={<ClipboardList className="h-4 w-4" />}
            description="10 pending approval"
          />
          <StatsCard
            title="Approved Schemes"
            value="24"
            icon={<CheckCheck className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Patient Follow-ups"
            value="12"
            icon={<UserCheck className="h-4 w-4" />}
            description="Due this week"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Scheme Recommendations</CardTitle>
              <CardDescription>Your latest patient scheme recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">Patient {i + 1}</p>
                      <p className="text-sm text-muted-foreground">Recommended for Health Scheme {i + 1}</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Tasks that require your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center p-2 border-b last:border-0">
                    <div className="w-2 h-2 rounded-full bg-healthcare-500 mr-2"></div>
                    <p className="text-sm">Follow-up with patient {i + 1}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <PendingApprovalsTable title="Patient Scheme Recommendations" userRole="facility" />
      </div>
    </DashboardLayout>
  );
};

export default FacilityDashboard;
