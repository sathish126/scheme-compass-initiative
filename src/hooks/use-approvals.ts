
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { getApprovals, approveRecommendation, rejectRecommendation } from "@/api";
import { SchemeRecommendation } from "@/types";

export const useApprovals = (userRole: string) => {
  const [approvals, setApprovals] = useState<SchemeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const data = await getApprovals(userRole);
      setApprovals(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch approvals");
      toast.error("Failed to load approvals");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, comments?: string) => {
    try {
      await approveRecommendation(id, comments);
      toast.success("Recommendation approved successfully");
      fetchApprovals();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve recommendation");
    }
  };

  const handleReject = async (id: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    
    try {
      await rejectRecommendation(id, reason);
      toast.success("Recommendation rejected");
      fetchApprovals();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject recommendation");
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [userRole]);

  return {
    approvals,
    loading,
    error,
    refresh: fetchApprovals,
    handleApprove,
    handleReject,
  };
};
