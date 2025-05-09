
import React from "react";
import { AlertCircle } from "lucide-react";

const EmptyApprovals: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No pending approvals</h3>
      <p className="text-sm text-muted-foreground mt-1">
        There are no scheme recommendations awaiting your approval at this time.
      </p>
    </div>
  );
};

export default EmptyApprovals;
