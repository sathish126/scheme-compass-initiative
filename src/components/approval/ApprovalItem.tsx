
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Check, X } from "lucide-react";

interface Approval {
  id: string;
  patientName: string;
  schemeName: string;
  date: string;
  status: string;
  facilityName: string;
  disease?: string;
  history?: string;
  notes?: string;
}

interface ApprovalItemProps {
  approval: Approval;
  userRole: string;
  onDetailsClick: (approval: Approval) => void;
  onApprove: (approval: Approval) => void;
  onReject: (approval: Approval) => void;
}

const ApprovalItem: React.FC<ApprovalItemProps> = ({
  approval,
  userRole,
  onDetailsClick,
  onApprove,
  onReject,
}) => {
  return (
    <TableRow key={approval.id}>
      <TableCell className="font-medium">{approval.patientName}</TableCell>
      <TableCell>{approval.schemeName}</TableCell>
      <TableCell>{approval.disease}</TableCell>
      {userRole !== "facility" && <TableCell>{approval.facilityName}</TableCell>}
      <TableCell>{approval.date}</TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Pending
        </Badge>
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => onDetailsClick(approval)}>
          <Info className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0" 
          onClick={() => onApprove(approval)}
        >
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0"
          onClick={() => onReject(approval)}
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ApprovalItem;
