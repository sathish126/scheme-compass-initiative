
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";

interface Approval {
  id: string;
  patientName: string;
  schemeName: string;
  date: string;
  status: string;
  facilityName: string;
}

const pendingApprovals: Approval[] = [
  { id: "1", patientName: "John Doe", schemeName: "Health For All", date: "2023-05-01", status: "pending", facilityName: "City Hospital" },
  { id: "2", patientName: "Mary Johnson", schemeName: "Senior Care Plus", date: "2023-05-02", status: "pending", facilityName: "City Hospital" },
  { id: "3", patientName: "Raj Patel", schemeName: "Universal Health Coverage", date: "2023-05-03", status: "pending", facilityName: "Rural Clinic" },
  { id: "4", patientName: "Priya Singh", schemeName: "Health For All", date: "2023-05-04", status: "pending", facilityName: "District Hospital" },
  { id: "5", patientName: "David Kim", schemeName: "Child Health Initiative", date: "2023-05-05", status: "pending", facilityName: "Community Center" },
];

interface PendingApprovalsTableProps {
  title?: string;
  userRole?: string;
}

const PendingApprovalsTable: React.FC<PendingApprovalsTableProps> = ({ 
  title = "Pending Approvals", 
  userRole = "hospital" 
}) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Scheme</TableHead>
                {userRole !== "facility" && <TableHead>Facility</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApprovals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell className="font-medium">{approval.patientName}</TableCell>
                  <TableCell>{approval.schemeName}</TableCell>
                  {userRole !== "facility" && <TableCell>{approval.facilityName}</TableCell>}
                  <TableCell>{approval.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingApprovalsTable;
