
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartData {
  name: string;
  suggested: number;
  approved: number;
  rejected: number;
}

// Empty data structure
const data: ChartData[] = [
  { name: "Health For All", suggested: 0, approved: 0, rejected: 0 },
  { name: "Senior Care", suggested: 0, approved: 0, rejected: 0 },
  { name: "Maternal", suggested: 0, approved: 0, rejected: 0 },
  { name: "Child Health", suggested: 0, approved: 0, rejected: 0 },
  { name: "Universal", suggested: 0, approved: 0, rejected: 0 },
];

const SchemeRecommendationsChart: React.FC = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Scheme Recommendations Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="suggested" name="Suggested" fill="#38bdf8" />
              <Bar dataKey="approved" name="Approved" fill="#22c55e" />
              <Bar dataKey="rejected" name="Rejected" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchemeRecommendationsChart;
