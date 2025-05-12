
import React from "react";
import { AlertCircle } from "lucide-react";

interface EmptyApprovalsProps {
  userRole?: string;
}

const EmptyApprovals: React.FC<EmptyApprovalsProps> = ({ userRole = "hospital" }) => {
  const getMessage = () => {
    switch (userRole) {
      case "facility":
        return "No patient scheme recommendations have been submitted yet";
      case "hospital":
        return "No scheme recommendations awaiting your approval at this time";
      case "district":
        return "No scheme recommendations forwarded from hospital level";
      case "state":
        return "No scheme recommendations forwarded from district level";
      case "super":
        return "No scheme recommendations forwarded from state level";
      default:
        return "No pending approvals";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No pending approvals</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {getMessage()}
      </p>
    </div>
  );
};

export default EmptyApprovals;
