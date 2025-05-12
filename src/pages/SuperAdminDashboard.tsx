
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import SchemeRecommendationsChart from "@/components/SchemeRecommendationsChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { statsMap } from "@/lib/mock-data";
import { Globe, UserCog, Building2, BarChart2, Download, PlusCircle, Settings, MapPin } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const data = [
  { month: "Jan", beneficiaries: 5000 },
  { month: "Feb", beneficiaries: 8000 },
  { month: "Mar", beneficiaries: 12000 },
  { month: "Apr", beneficiaries: 15000 },
  { month: "May", beneficiaries: 18000 },
  { month: "Jun", beneficiaries: 24000 },
  { month: "Jul", beneficiaries: 28000 },
  { month: "Aug", beneficiaries: 32000 },
  { month: "Sep", beneficiaries: 38000 },
  { month: "Oct", beneficiaries: 42000 },
  { month: "Nov", beneficiaries: 45000 },
  { month: "Dec", beneficiaries: 50000 },
];

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const stats = statsMap.super;
  const [newSchemeName, setNewSchemeName] = useState("");
  const [schemeDescription, setSchemeDescription] = useState("");
  const [schemeCategory, setSchemeCategory] = useState("general");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddNewScheme = () => {
    if (!newSchemeName.trim()) {
      toast.error("Please enter a scheme name");
      return;
    }

    toast.success(`New scheme "${newSchemeName}" added successfully`, {
      description: "The scheme has been added to the database and is now available for recommendations."
    });

    // Reset form
    setNewSchemeName("");
    setSchemeDescription("");
    setSchemeCategory("general");
    setIsDialogOpen(false);
  };

  const handleExportAnnualReport = () => {
    toast.success("Annual report export initiated", {
      description: "Your report is being generated and will download shortly."
    });
    
    // Simulate download delay
    setTimeout(() => {
      const link = document.createElement("a");
      link.setAttribute("href", "#");
      link.setAttribute("download", `annual-report-${new Date().getFullYear()}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Annual report downloaded successfully");
    }, 1500);
  };

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
            value="8"
            icon={<Globe className="h-4 w-4" />}
            description="Connected to platform"
          />
          <StatsCard
            title="Total Districts"
            value="62"
            icon={<MapPin className="h-4 w-4" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<UserCog className="h-4 w-4" />}
            description="Nationwide coverage"
          />
          <StatsCard
            title="Total Hospitals"
            value="586"
            icon={<Building2 className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>National Scheme Beneficiary Growth</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
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
                {["Health For All", "Senior Care Plus", "Maternal Welfare Scheme", "Child Health Initiative", "Universal Health Coverage"].map((scheme, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-2 ${
                        i === 0 ? "bg-green-500" : 
                        i === 1 ? "bg-blue-500" : 
                        i === 2 ? "bg-purple-500" : 
                        i === 3 ? "bg-orange-500" : "bg-red-500"
                      }`}></div>
                      <p className="text-sm font-medium">{scheme}</p>
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

        <SchemeRecommendationsChart />
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
