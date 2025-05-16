import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DownloadIcon, Plus, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { PatientApproval, getApprovalsByLevel, approveRecommendation, rejectRecommendation, getPatients } from '@/utils/localStorageUtils';
import { toast } from '@/hooks/use-toast';

const exportToCSV = (data: any[], fileName: string) => {
  // Convert data to CSV format
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => Object.values(item).join('\n')).join('\n');
  const csvContent = `${headers}\n${rows}`;
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const DistrictDashboard = () => {
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState<PatientApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<PatientApproval | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [comment, setComment] = useState('');
  
  // Load pending approvals
  useEffect(() => {
    const loadApprovals = () => {
      const approvals = getApprovalsByLevel('district');
      setPendingApprovals(approvals);
      setLoading(false);
    };
    
    loadApprovals();
    // Set up interval to refresh data
    const interval = setInterval(loadApprovals, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const handleApprove = (approval: PatientApproval) => {
    setIsApproving(true);
    try {
      approveRecommendation(approval.id, comment);
      setPendingApprovals(prev => prev.filter(a => a.id !== approval.id));
      toast({
        title: "Recommendation Approved",
        description: `${approval.schemeName} for ${approval.patientName} has been forwarded to state level.`,
        variant: "default",
      });
      setComment('');
      setSelectedApproval(null);
    } catch (error) {
      console.error("Error approving recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to approve recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };
  
  const handleReject = (approval: PatientApproval) => {
    setIsRejecting(true);
    try {
      rejectRecommendation(approval.id, comment);
      setPendingApprovals(prev => prev.filter(a => a.id !== approval.id));
      toast({
        title: "Recommendation Rejected",
        description: `${approval.schemeName} for ${approval.patientName} has been rejected.`,
        variant: "destructive",
      });
      setComment('');
      setSelectedApproval(null);
    } catch (error) {
      console.error("Error rejecting recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to reject recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };
  
  const handleExportData = () => {
    const patients = getPatients();
    if (patients.length > 0) {
      exportToCSV(patients, 'district_patients_data.csv');
      toast({
        title: "Export Complete",
        description: "Patient data has been exported to CSV.",
      });
    } else {
      toast({
        title: "No Data",
        description: "There is no patient data to export.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">District Dashboard</h1>
            <p className="text-muted-foreground">{user?.district} District Health Department</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleExportData}
            >
              <DownloadIcon size={16} />
              Export Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Patients" 
            value={Math.floor(Math.random() * 1000) + 5000} 
            description={{
              value: 12,
              isPositive: true
            }}
            trend="up"
          />
          <StatsCard 
            title="Facilities" 
            value={Math.floor(Math.random() * 20) + 50} 
            description={{
              value: 3,
              isPositive: true
            }}
            trend="up"
          />
          <StatsCard 
            title="Pending" 
            value={pendingApprovals.length} 
            description={{
              value: pendingApprovals.length > 5 ? 5 : pendingApprovals.length,
              isPositive: pendingApprovals.length <= 5
            }}
            trend={pendingApprovals.length > 5 ? "down" : "up"}
          />
          <StatsCard 
            title="Coverage" 
            value={Math.floor(Math.random() * 10) + 85} 
            description={{
              value: 2,
              isPositive: true
            }}
            trend="up"
          />
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Pending Approvals</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : pendingApprovals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No pending approvals at district level</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{approval.patientName}</h3>
                    <div className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">Pending</div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-2 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Scheme</p>
                      <p>{approval.schemeName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Disease</p>
                      <p>{approval.disease}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Facility</p>
                      <p>{approval.facilityName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p>{approval.date}</p>
                    </div>
                  </div>
                  
                  {selectedApproval?.id === approval.id ? (
                    <div className="border-t pt-3 mt-3">
                      <textarea 
                        className="w-full p-2 border rounded mb-3 text-sm"
                        placeholder="Add comment (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="ghost"
                          disabled={isApproving || isRejecting}
                          onClick={() => setSelectedApproval(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-1 border-red-600 text-red-600 hover:bg-red-50"
                          disabled={isApproving || isRejecting}
                          onClick={() => handleReject(approval)}
                        >
                          <XCircle size={16} />
                          Reject
                        </Button>
                        <Button 
                          className="flex items-center gap-1"
                          disabled={isApproving || isRejecting}
                          onClick={() => handleApprove(approval)}
                        >
                          <CheckCircle size={16} />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1 border-red-600 text-red-600 hover:bg-red-50"
                        onClick={() => setSelectedApproval(approval)}
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                      <Button 
                        className="flex items-center gap-1"
                        onClick={() => setSelectedApproval(approval)}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DistrictDashboard;
