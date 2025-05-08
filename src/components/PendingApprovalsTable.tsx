
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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
];

interface PendingApprovalsTableProps {
  title?: string;
  userRole?: string;
}

const PendingApprovalsTable: React.FC<PendingApprovalsTableProps> = ({ 
  title = "Pending Approvals", 
  userRole = "hospital" 
}) => {
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>(sampleApprovals);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Define the next level based on current role
  const getNextLevel = (currentRole: string): string => {
    switch (currentRole) {
      case "facility":
        return "hospital";
      case "hospital":
        return "district";
      case "district":
        return "state";
      case "state":
        return "super";
      default:
        return "approved";
    }
  };

  // Handle approval
  const handleApprove = (approval: Approval) => {
    const nextLevel = getNextLevel(userRole);
    
    // In a real app, this would make an API call
    toast.success(`Scheme recommendation for ${approval.patientName} approved successfully`, {
      description: `The recommendation has been sent to ${nextLevel === "approved" ? "the patient" : `${nextLevel} admin`} for ${nextLevel === "approved" ? "implementation" : "further review"}.`
    });
    
    // Remove from the current list
    setPendingApprovals(pendingApprovals.filter(item => item.id !== approval.id));
  };

  // Handle rejection dialog
  const openRejectDialog = (approval: Approval) => {
    setSelectedApproval(approval);
    setIsRejectDialogOpen(true);
  };

  // Handle rejection submission
  const handleReject = () => {
    if (!selectedApproval) return;
    
    // In a real app, this would make an API call
    toast.error(`Scheme recommendation for ${selectedApproval.patientName} rejected`, {
      description: rejectionReason || "The recommendation has been rejected."
    });
    
    // Remove from the current list
    setPendingApprovals(pendingApprovals.filter(item => item.id !== selectedApproval.id));
    
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

  return (
    <>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
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
                  {pendingApprovals.map((approval) => (
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
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => openDetails(approval)}>
                          <Info className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleApprove(approval)}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => openRejectDialog(approval)}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No pending approvals</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There are no scheme recommendations awaiting your approval at this time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm">Patient Information</h3>
                <p className="text-sm mt-1">Name: {selectedApproval.patientName}</p>
                <p className="text-sm mt-1">Disease: {selectedApproval.disease}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Medical History</h3>
                <p className="text-sm mt-1">{selectedApproval.history}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Recommended Scheme</h3>
                <p className="text-sm mt-1">{selectedApproval.schemeName}</p>
              </div>
              
              {selectedApproval.notes && (
                <div>
                  <h3 className="font-medium text-sm">Additional Notes</h3>
                  <p className="text-sm mt-1">{selectedApproval.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Recommendation</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this scheme recommendation.
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            placeholder="Enter reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingApprovalsTable;
