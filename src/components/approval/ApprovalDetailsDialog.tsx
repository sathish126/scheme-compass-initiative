
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface ApprovalDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  approval: Approval | null;
}

const ApprovalDetailsDialog: React.FC<ApprovalDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  approval,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>
        {approval && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm">Patient Information</h3>
              <p className="text-sm mt-1">Name: {approval.patientName}</p>
              <p className="text-sm mt-1">Disease: {approval.disease}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm">Medical History</h3>
              <p className="text-sm mt-1">{approval.history}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm">Recommended Scheme</h3>
              <p className="text-sm mt-1">{approval.schemeName}</p>
            </div>
            
            {approval.notes && (
              <div>
                <h3 className="font-medium text-sm">Additional Notes</h3>
                <p className="text-sm mt-1">{approval.notes}</p>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalDetailsDialog;
