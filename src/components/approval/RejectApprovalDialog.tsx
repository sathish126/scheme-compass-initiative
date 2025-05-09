
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RejectApprovalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onConfirmReject: () => void;
}

const RejectApprovalDialog: React.FC<RejectApprovalDialogProps> = ({
  isOpen,
  onOpenChange,
  rejectionReason,
  onReasonChange,
  onConfirmReject,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          onChange={(e) => onReasonChange(e.target.value)}
          className="min-h-[100px]"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirmReject}>Reject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectApprovalDialog;
