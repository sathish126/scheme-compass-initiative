import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, FileText, Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const StateStats = () => {
  const { user } = useAuth();

  // Sample stats data - would come from the backend in a real implementation
  const schemePerformance = [
    { 
      name: "Maternal Health Program", 
      progress: 78, 
      trend: "up",
      change: 12
    },
    { 
      name: "Child Vaccination", 
      progress: 92, 
      trend: "up",
      change: 8
    },
    { 
      name: "TB Prevention", 
      progress: 65, 
      trend: "down",
      change: 3
    },
    { 
      name: "Cancer Screening", 
      progress: 42, 
      trend: "up",
      change: 15
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">State Performance</h1>
        <p className="text-muted-foreground">{user?.state} State Health Statistics</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-2xl font-bold">3.2M</div>
            <p className="text-xs text-center text-muted-foreground">Population Covered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Database className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-center text-muted-foreground">Active Health Schemes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <FileText className="h-8 w-8 text-purple-500 mb-2" />
            <div className="text-2xl font-bold">4.8K</div>
            <p className="text-xs text-center text-muted-foreground">Monthly Registrations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <TrendingUp className="h-8 w-8 text-amber-500 mb-2" />
            <div className="text-2xl font-bold">81%</div>
            <p className="text-xs text-center text-muted-foreground">Avg Program Efficiency</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheme Performance</CardTitle>
          <CardDescription>Health scheme progress across districts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schemePerformance.map((scheme, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{scheme.name}</span>
                  <span className="flex items-center text-sm">
                    {scheme.progress}%
                    {scheme.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 ml-1" />
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${scheme.trend === "up" ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${scheme.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {scheme.change}% {scheme.trend === "up" ? "increase" : "decrease"} since last month
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regional Coverage</CardTitle>
          <CardDescription>Health scheme coverage by districts</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="space-y-4">
            {["North District", "South District", "East District", "West District", "Central District"].map((region, i) => (
              <div key={i} className="flex items-center p-2 justify-between border-b last:border-0">
                <span className="font-medium">{region}</span>
                <div>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                    {65 + (i * 5)}%
                  </span>
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
