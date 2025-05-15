
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import SchemeRecommendationsChart from "@/components/SchemeRecommendationsChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Globe, UserCog, Building2, BarChart2, Download, PlusCircle, Settings, MapPin } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getPatients, getApprovals, getApprovalsByLevel } from "@/utils/localStorageUtils";
import { exportPatientsToCSV, exportApprovalsToCSV } from "@/utils/approvalUtils";
import PendingApprovalsTable from "@/components/PendingApprovalsTable";
import Loading from "@/components/ui/loading";
import { Scheme } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Transform real data for the chart
const generateMonthlyData = () => {
  const approvals = getApprovals();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, index) => {
    // Only include data up to current month
    if (index > currentMonth) return { month, beneficiaries: 0 };
    
    // Base value + random growth + actual approved patients
    const base = index * 5000;
    const approved = approvals.filter(a => a.status === "approved").length * 100;
    return {
      month,
      beneficiaries: base + approved
    };
  });
};

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [newSchemeName, setNewSchemeName] = useState("");
  const [schemeDescription, setSchemeDescription] = useState("");
  const [schemeCategory, setSchemeCategory] = useState("general");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDistricts: 0,
    totalStates: 0,
    totalHospitals: 0
  });
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = () => {
      try {
        const patients = getPatients();
        const approvals = getApprovalsByLevel("super");
        
        // Get unique district/state/hospital counts from patient data
        const districts = new Set();
        const states = new Set();
        const hospitals = new Set();
        
        patients.forEach(patient => {
          if (patient.district) districts.add(patient.district);
          if (patient.state) states.add(patient.state);
          if (patient.hospital) hospitals.add(patient.hospital);
        });
        
        // Set stats
        setStats({
          totalPatients: patients.length,
          totalDistricts: districts.size || 0,
          totalStates: states.size || 0,
          totalHospitals: hospitals.size || 0
        });
        
        // Set approvals
        setPendingApprovals(approvals);
        
        // Set chart data
        setChartData(generateMonthlyData());
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleAddNewScheme = () => {
    if (!newSchemeName.trim()) {
      toast.error("Please enter a scheme name");
      return;
    }

    try {
      // Get existing schemes from localStorage or create an empty array
      const existingSchemes = JSON.parse(localStorage.getItem('schemes') || '[]');
      
      // Create new scheme
      const newScheme: Scheme = {
        id: uuidv4(),
        name: newSchemeName,
        description: schemeDescription,
        eligibilityCriteria: {
          category: schemeCategory === "general" ? ["general", "obc", "sc", "st"] : [schemeCategory as any]
        },
        benefits: ["Healthcare coverage", "Medical subsidies"],
        documents: ["Identity proof", "Income certificate"]
      };
      
      // Add to schemes and save
      existingSchemes.push(newScheme);
      localStorage.setItem('schemes', JSON.stringify(existingSchemes));
      
      toast.success(`New scheme "${newSchemeName}" added successfully`, {
        description: "The scheme has been added to the database and is now available for recommendations."
      });

      // Reset form
      setNewSchemeName("");
      setSchemeDescription("");
      setSchemeCategory("general");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add new scheme");
      console.error("Error adding scheme:", error);
    }
  };

  const handleExportAnnualReport = () => {
    const patients = getPatients();
    
    if (patients.length === 0) {
      toast.error("No patient data to export");
      return;
    }
    
    exportPatientsToCSV(patients, "Annual-Patient-Report");
    
    toast.success("Annual report export initiated", {
      description: "Your report is being generated and will download shortly."
    });
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
            <p className="text-muted-foreground">Super Admin Dashboard</p>
          </div>
          <div>
            <Button variant="outline" className="mr-2" onClick={handleExportAnnualReport}>
              <Download className="mr-2 h-4 w-4" /> Export Annual Report
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-healthcare-600 hover:bg-healthcare-700">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Scheme
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Healthcare Scheme</DialogTitle>
                  <DialogDescription>
                    Create a new healthcare scheme to be available for patient recommendations.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="scheme-name" className="text-right">Scheme Name</Label>
                    <Input 
                      id="scheme-name" 
                      value={newSchemeName} 
                      onChange={(e) => setNewSchemeName(e.target.value)} 
                      className="col-span-3" 
                      placeholder="Enter scheme name" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="scheme-category" className="text-right">Category</Label>
                    <Select 
                      value={schemeCategory} 
                      onValueChange={setSchemeCategory}
                    >
                      <SelectTrigger className="col-span-3" id="scheme-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="chronic">Chronic Disease</SelectItem>
                        <SelectItem value="maternal">Maternal Care</SelectItem>
                        <SelectItem value="pediatric">Pediatric Care</SelectItem>
                        <SelectItem value="elderly">Elderly Care</SelectItem>
                        <SelectItem value="emergency">Emergency Care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="scheme-description" className="text-right pt-2">Description</Label>
                    <Textarea 
                      id="scheme-description" 
                      value={schemeDescription} 
                      onChange={(e) => setSchemeDescription(e.target.value)} 
                      className="col-span-3" 
                      placeholder="Describe the scheme benefits and eligibility criteria" 
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddNewScheme} className="bg-healthcare-600 hover:bg-healthcare-700">Add Scheme</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total States"
            value={stats.totalStates.toString()}
            icon={<Globe className="h-4 w-4" />}
            description="Connected to platform"
          />
          <StatsCard
            title="Total Districts"
            value={stats.totalDistricts.toString()}
            icon={<MapPin className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients.toString()}
            icon={<UserCog className="h-4 w-4" />}
            description="Nationwide coverage"
          />
          <StatsCard
            title="Total Hospitals"
            value={stats.totalHospitals.toString()}
            icon={<Building2 className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>National Scheme Beneficiary Growth</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => exportPatientsToCSV(getPatients(), "Scheme-Beneficiaries")}
            >
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="beneficiaries" 
                    stroke="#0284c7" 
                    fill="#0ea5e9" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>State Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["State A", "State B", "State C", "State D", "State E"].map((state, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full bg-healthcare-500 mr-2"></div>
                        <p className="font-medium">{state}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm">
                          <span className="font-medium">{7000 - i * 800}</span> patients
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">{92 - i * 3}%</span> coverage
                        </p>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="bg-healthcare-500 h-full rounded-full transition-all" 
                        style={{ width: `${92 - i * 3}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Schemes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {JSON.parse(localStorage.getItem('schemes') || '[]').slice(0, 5).map((scheme, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-2 ${
                        i === 0 ? "bg-green-500" : 
                        i === 1 ? "bg-blue-500" : 
                        i === 2 ? "bg-purple-500" : 
                        i === 3 ? "bg-orange-500" : "bg-red-500"
                      }`}></div>
                      <p className="text-sm font-medium">{scheme.name}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Scheme
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <PendingApprovalsTable 
          title="Final State Approved Cases" 
          userRole="super" 
          externalApprovals={pendingApprovals}
        />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
