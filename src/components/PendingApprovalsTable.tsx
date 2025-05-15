import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ApprovalItem from "./approval/ApprovalItem";
import EmptyApprovals from "./approval/EmptyApprovals";
import ApprovalDetailsDialog from "./approval/ApprovalDetailsDialog";
import RejectApprovalDialog from "./approval/RejectApprovalDialog";
import { Approval, exportApprovalsToCSV } from "@/utils/approvalUtils";
import { approveRecommendation, rejectRecommendation } from "@/utils/localStorageUtils";

interface PendingApprovalsTableProps {
  title?: string;
  userRole?: string;
  // Additional props to handle global approval state
  externalApprovals?: any[];
  onApprove?: (approval: Approval) => void;
  onReject?: (approval: Approval, reason: string) => void;
}

const PendingApprovalsTable: React.FC<PendingApprovalsTableProps> = ({ 
  title = "Pending Approvals", 
  userRole = "hospital",
  externalApprovals = [],
  onApprove,
  onReject
}) => {
  // Use external approvals if provided
  const [pendingApprovals, setPendingApprovals] = useState<any[]>(externalApprovals);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Update approvals when external approvals change
  useEffect(() => {
    setPendingApprovals(externalApprovals);
  }, [externalApprovals]);

  // Handle approval
  const handleApprove = (approval: any) => {
    // If we have external approval handler, use that
    if (onApprove) {
      onApprove(approval);
    } else {
      // Otherwise handle locally with localStorage
      approveRecommendation(approval.id);
      setPendingApprovals(pendingApprovals.filter(item => item.id !== approval.id));
    }
    
    toast.success(`Scheme recommendation for ${approval.patientName} approved successfully`, {
      description: `The recommendation has been sent to the next level for review.`
    });
  };

  // Handle rejection dialog
  const openRejectDialog = (approval: any) => {
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
      // Otherwise handle locally with localStorage
      rejectRecommendation(selectedApproval.id);
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
  const openDetails = (approval: any) => {
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
            disabled={pendingApprovals.length === 0}
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
