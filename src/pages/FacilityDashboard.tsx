
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import PendingApprovalsTable from "@/components/PendingApprovalsTable";
import { useAuth } from "@/contexts/AuthContext";
import { ClipboardList, CheckCheck, Users, UserCheck, PlusCircle, ArrowRight, Building, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

// Common diseases and associated schemes
const diseaseSchemeMap = {
  "diabetes": ["Health For All", "Chronic Disease Management"],
  "hypertension": ["Health For All", "Cardiovascular Care Scheme"],
  "malaria": ["Infectious Disease Control", "Rural Health Initiative"],
  "tuberculosis": ["TB Elimination Program", "Respiratory Health Scheme"],
  "dengue": ["Vector-Borne Disease Control", "Emergency Care Initiative"],
  "covid19": ["COVID Relief Scheme", "Pandemic Response Program"],
  "cancer": ["Cancer Care Initiative", "Critical Illness Support"],
  "malnutrition": ["Child Health Initiative", "Nutrition Support Program"],
  "pregnancy": ["Maternal Welfare Scheme", "Women's Health Initiative"],
  "mental_health": ["Mental Health Support", "Psychological Wellness Scheme"]
};

const FacilityDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");
  const [disease, setDisease] = useState("");
  const [recommendedSchemes, setRecommendedSchemes] = useState<string[]>([]);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Generate recommendations based on disease
  const generateRecommendations = () => {
    if (!patientName.trim()) {
      toast.error("Please enter patient name");
      return;
    }
    if (!disease) {
      toast.error("Please select a disease");
      return;
    }

    const schemes = diseaseSchemeMap[disease as keyof typeof diseaseSchemeMap] || ["Health For All"];
    setRecommendedSchemes(schemes);
    setSelectedScheme(schemes[0]);
    setShowRecommendations(true);
    toast.success("Schemes recommended based on patient condition");
  };

  // Submit recommendation to hospital
  const submitRecommendation = () => {
    if (!selectedScheme) {
      toast.error("Please select a scheme");
      return;
    }

    toast.success(`Recommendation for ${patientName} submitted to hospital for approval`, {
      description: `Scheme: ${selectedScheme}`,
    });

    // Reset form
    setPatientName("");
    setDisease("");
    setRecommendedSchemes([]);
    setSelectedScheme("");
    setShowRecommendations(false);
  };

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

        {/* Patient Data Entry & Scheme Recommendation */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Scheme Recommendation</CardTitle>
            <CardDescription>Enter patient details to get scheme recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input 
                    id="patientName" 
                    placeholder="Enter patient name" 
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disease">Disease/Condition</Label>
                  <Select 
                    value={disease} 
                    onValueChange={setDisease}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select disease or condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="hypertension">Hypertension</SelectItem>
                      <SelectItem value="malaria">Malaria</SelectItem>
                      <SelectItem value="tuberculosis">Tuberculosis</SelectItem>
                      <SelectItem value="dengue">Dengue</SelectItem>
                      <SelectItem value="covid19">COVID-19</SelectItem>
                      <SelectItem value="cancer">Cancer</SelectItem>
                      <SelectItem value="malnutrition">Malnutrition</SelectItem>
                      <SelectItem value="pregnancy">Pregnancy</SelectItem>
                      <SelectItem value="mental_health">Mental Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={generateRecommendations}
                  className="bg-healthcare-600 hover:bg-healthcare-700"
                >
                  Generate Recommendations
                </Button>
              </div>
              
              {showRecommendations && (
                <div className="mt-6 space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium">Recommended Schemes</h3>
                  <p className="text-sm text-muted-foreground">Based on the patient's condition, the following schemes are recommended:</p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scheme">Select Scheme to Recommend</Label>
                    <Select 
                      value={selectedScheme} 
                      onValueChange={setSelectedScheme}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        {recommendedSchemes.map((scheme) => (
                          <SelectItem key={scheme} value={scheme}>
                            {scheme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={submitRecommendation}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Submit Recommendation to Hospital
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
