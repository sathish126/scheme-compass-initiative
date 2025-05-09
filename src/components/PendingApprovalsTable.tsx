import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ApprovalItem from "./approval/ApprovalItem";
import EmptyApprovals from "./approval/EmptyApprovals";
import ApprovalDetailsDialog from "./approval/ApprovalDetailsDialog";
import RejectApprovalDialog from "./approval/RejectApprovalDialog";
import { Approval, getNextLevel, exportApprovalsToCSV } from "@/utils/approvalUtils";

// Sample data - in a real app this would come from an API
const sampleApprovals: Approval[] = [
  { 
    id: "1", 
    patientName: "John Doe", 
    schemeName: "Health For All", 
    date: "2023-05-01", 
    status: "pending", 
    facilityName: "City Hospital",
    disease: "Diabetes",
    history: "Type 2 diabetes diagnosed 2 years ago. Currently on medication."
  },
  { 
    id: "2", 
    patientName: "Mary Johnson", 
    schemeName: "Senior Care Plus", 
    date: "2023-05-02", 
    status: "pending", 
    facilityName: "City Hospital",
    disease: "Hypertension",
    history: "High blood pressure, on medication for 5 years."
  },
  { 
    id: "3", 
    patientName: "Raj Patel", 
    schemeName: "Universal Health Coverage", 
    date: "2023-05-03", 
    status: "pending", 
    facilityName: "Rural Clinic",
    disease: "Tuberculosis",
    history: "Recently diagnosed, starting treatment."
  },
  { 
    id: "4", 
    patientName: "Priya Singh", 
    schemeName: "Health For All", 
    date: "2023-05-04", 
    status: "pending", 
    facilityName: "District Hospital",
    disease: "Malaria",
    history: "Recurrent episodes, currently stable."
  },
  { 
    id: "5", 
    patientName: "David Kim", 
    schemeName: "Child Health Initiative", 
    date: "2023-05-05", 
    status: "pending", 
    facilityName: "Community Center",
    disease: "Dengue",
    history: "First episode, recovering."
  },
  { 
    id: "6", 
    patientName: "Sarah Wilson", 
    schemeName: "Mental Health Support", 
    date: "2023-05-06", 
    status: "pending", 
    facilityName: "City Hospital",
    disease: "Anxiety",
    history: "Recently diagnosed with generalized anxiety disorder."
  },
  { 
    id: "7", 
    patientName: "Michael Brown", 
    schemeName: "Senior Care Plus", 
    date: "2023-05-07", 
    status: "pending", 
    facilityName: "Elder Care Center",
    disease: "Arthritis",
    history: "Chronic joint pain for over a decade."
  },
];

interface PendingApprovalsTableProps {
  title?: string;
  userRole?: string;
  // Additional props to handle global approval state
  externalApprovals?: Approval[];
  onApprove?: (approval: Approval) => void;
  onReject?: (approval: Approval, reason: string) => void;
}

const PendingApprovalsTable: React.FC<PendingApprovalsTableProps> = ({ 
  title = "Pending Approvals", 
  userRole = "hospital",
  externalApprovals,
  onApprove,
  onReject
}) => {
  // Use external approvals if provided, otherwise use sample data
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>(
    externalApprovals || sampleApprovals
  );
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Handle approval
  const handleApprove = (approval: Approval) => {
    const nextLevel = getNextLevel(userRole);
    
    // If we have external approval handler, use that
    if (onApprove) {
      onApprove(approval);
    } else {
      // Otherwise handle locally
      setPendingApprovals(pendingApprovals.filter(item => item.id !== approval.id));
    }
    
    toast.success(`Scheme recommendation for ${approval.patientName} approved successfully`, {
      description: `The recommendation has been sent to ${nextLevel === "approved" ? "the patient" : `${nextLevel} admin`} for ${nextLevel === "approved" ? "implementation" : "further review"}.`
    });
  };

  // Handle rejection dialog
  const openRejectDialog = (approval: Approval) => {
    setSelectedApproval(approval);
    setIsRejectDialogOpen(true);
  };

  // Handle rejection submission
  const handleReject = () => {
    if (!selectedApproval) return;
    
    // If we have external rejection handler, use that
    if (onReject) {
      onReject(selectedApproval, rejectionReason);
    } else {
      // Otherwise handle locally
      setPendingApprovals(pendingApprovals.filter(item => item.id !== selectedApproval.id));
    }
    
    toast.error(`Scheme recommendation for ${selectedApproval.patientName} rejected`, {
      description: rejectionReason || "The recommendation has been rejected."
    });
    
    // Close dialog and reset state
    setIsRejectDialogOpen(false);
    setRejectionReason("");
    setSelectedApproval(null);
  };

  // Handle opening details
  const openDetails = (approval: Approval) => {
    setSelectedApproval(approval);
    setIsDetailsOpen(true);
  };

  // Export data as CSV
  const exportData = () => {
    exportApprovalsToCSV(pendingApprovals, title);
    toast.success("Export successful", {
      description: "The data has been exported as a CSV file."
    });
  };

  // Limit the number of items shown for facility role to 5
  const displayedApprovals = userRole === "facility" 
    ? pendingApprovals.slice(0, 5) 
    : pendingApprovals;

  return (
    <>
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button 
            variant="outline"
            size="sm"
            onClick={exportData}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" /> Export Data
          </Button>
        </CardHeader>
        <CardContent>
          {pendingApprovals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Scheme</TableHead>
                    <TableHead>Disease</TableHead>
                    {userRole !== "facility" && <TableHead>Facility</TableHead>}
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedApprovals.map((approval) => (
                    <ApprovalItem 
                      key={approval.id}
                      approval={approval}
                      userRole={userRole}
                      onDetailsClick={openDetails}
                      onApprove={handleApprove}
                      onReject={openRejectDialog}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyApprovals />
          )}
        </CardContent>
      </Card>

      <ApprovalDetailsDialog 
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        approval={selectedApproval}
      />

      <RejectApprovalDialog 
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirmReject={handleReject}
      />
    </>
  );
};

export default PendingApprovalsTable;
