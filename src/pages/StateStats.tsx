
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, FileMedical, Database, Link } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const StateStats = () => {
  const { user } = useAuth();

  // Sample district data - would come from the backend in a real implementation
  const districtData = [
    { name: "North District", coverage: 87, trend: "up", patients: "32K" },
    { name: "South District", coverage: 72, trend: "up", patients: "41K" },
    { name: "East District", coverage: 64, trend: "down", patients: "28K" },
    { name: "West District", coverage: 89, trend: "up", patients: "38K" },
    { name: "Central District", coverage: 76, trend: "down", patients: "47K" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">State Dashboard</h1>
        <p className="text-muted-foreground">{user?.state} Health Performance</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-2xl font-bold">4.2M</div>
            <p className="text-xs text-center text-muted-foreground">Population Covered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Link className="h-8 w-8 text-indigo-500 mb-2" />
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-center text-muted-foreground">Districts Connected</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Database className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-center text-muted-foreground">Active Health Schemes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <TrendingUp className="h-8 w-8 text-amber-500 mb-2" />
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-center text-muted-foreground">Overall Healthcare Index</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>District Performance</CardTitle>
          <CardDescription>Healthcare coverage by district</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {districtData.map((district, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">{district.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({district.patients} patients)</span>
                  </div>
                  <span className="flex items-center text-sm">
                    {district.coverage}%
                    {district.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 ml-1" />
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${district.trend === "up" ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${district.coverage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Healthcare Initiatives</CardTitle>
          <CardDescription>Top performing health programs</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="space-y-0">
            {[
              "Maternal Health Program", 
              "Child Immunization Initiative", 
              "TB Control Program", 
              "Diabetes Awareness Campaign",
              "Rural Healthcare Access"
            ].map((program, i) => (
              <div key={i} className="flex items-center p-3 justify-between border-b last:border-0">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full bg-healthcare-${500 + (i * 100)}`}></div>
                  <span className="ml-2 text-sm">{program}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">{90 - (i * 7)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StateStats;
