
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/DashboardLayout';
import { Check, Download, Plus, Settings, Trash } from 'lucide-react';
import { PatientApproval, getApprovalsByLevel, approveRecommendation, rejectRecommendation, getPatients } from '@/utils/localStorageUtils';
import { toast } from '@/hooks/use-toast';

interface SchemeType {
  id: string;
  name: string;
  description: string;
}

const SuperAdminDashboard = () => {
  const [pendingApprovals, setPendingApprovals] = useState<PatientApproval[]>([]);
  const [schemes, setSchemes] = useState<SchemeType[]>([]);
  const [newSchemeName, setNewSchemeName] = useState('');
  const [newSchemeDescription, setNewSchemeDescription] = useState('');
  const [isAddingScheme, setIsAddingScheme] = useState(false);
  
  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      // Get pending approvals for super admin
      const approvals = getApprovalsByLevel('super');
      setPendingApprovals(approvals);
      
      // Load schemes from localStorage
      const savedSchemes = localStorage.getItem('schemes');
      if (savedSchemes) {
        setSchemes(JSON.parse(savedSchemes));
      } else {
        // Initialize with some default schemes if none exist
        const defaultSchemes = [
          { id: '1', name: 'Ayushman Bharat', description: 'National health insurance scheme' },
          { id: '2', name: 'Janani Suraksha Yojana', description: 'Safe motherhood intervention' },
        ];
        localStorage.setItem('schemes', JSON.stringify(defaultSchemes));
        setSchemes(defaultSchemes);
      }
    };
    
    loadData();
  }, []);
  
  const handleApprove = (approval: PatientApproval) => {
    try {
      approveRecommendation(approval.id);
      setPendingApprovals(prev => prev.filter(a => a.id !== approval.id));
      toast({
        title: "Final Approval Granted",
        description: `${approval.schemeName} for ${approval.patientName} has been approved.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error approving recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to approve. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleReject = (approval: PatientApproval) => {
    try {
      rejectRecommendation(approval.id);
      setPendingApprovals(prev => prev.filter(a => a.id !== approval.id));
      toast({
        title: "Recommendation Rejected",
        description: `${approval.schemeName} for ${approval.patientName} has been rejected.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error rejecting recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to reject. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddScheme = () => {
    if (!newSchemeName.trim()) {
      toast({
        title: "Error",
        description: "Scheme name is required",
        variant: "destructive",
      });
      return;
    }
    
    const newScheme = {
      id: Date.now().toString(),
      name: newSchemeName,
      description: newSchemeDescription,
    };
    
    const updatedSchemes = [...schemes, newScheme];
    setSchemes(updatedSchemes);
    localStorage.setItem('schemes', JSON.stringify(updatedSchemes));
    
    // Reset form
    setNewSchemeName('');
    setNewSchemeDescription('');
    setIsAddingScheme(false);
    
    toast({
      title: "Success",
      description: "New health scheme added successfully",
      variant: "default",
    });
  };
  
  const deleteScheme = (id: string) => {
    const updatedSchemes = schemes.filter(scheme => scheme.id !== id);
    setSchemes(updatedSchemes);
    localStorage.setItem('schemes', JSON.stringify(updatedSchemes));
    
    toast({
      title: "Scheme Deleted",
      description: "Health scheme has been removed",
      variant: "default",
    });
  };
  
  const exportData = () => {
    const patients = getPatients();
    const approvals = JSON.parse(localStorage.getItem('approvals') || '[]');
    
    // Create JSON data
    const exportData = {
      patients,
      approvals,
      schemes,
      exportDate: new Date().toISOString(),
    };
    
    // Convert to string
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create download link
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hdims_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Export Complete",
      description: "System data has been exported successfully",
      variant: "default",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Health Department Information Management System</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={exportData}
            >
              <Download size={16} />
              Export All Data
            </Button>
            
            <Button
              className="flex items-center gap-2"
              onClick={() => setIsAddingScheme(!isAddingScheme)}
            >
              <Plus size={16} />
              {isAddingScheme ? 'Cancel' : 'Add Scheme'}
            </Button>
          </div>
        </div>
        
        {isAddingScheme && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Health Scheme</CardTitle>
              <CardDescription>Create a new health scheme for patient recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="scheme-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Scheme Name
                  </label>
                  <input
                    type="text"
                    id="scheme-name"
                    className="w-full p-2 border rounded"
                    placeholder="Enter scheme name"
                    value={newSchemeName}
                    onChange={(e) => setNewSchemeName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="scheme-desc" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="scheme-desc"
                    className="w-full p-2 border rounded"
                    placeholder="Enter scheme description"
                    value={newSchemeDescription}
                    onChange={(e) => setNewSchemeDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button className="flex items-center gap-2" onClick={handleAddScheme}>
                    <Plus size={16} />
                    Create Scheme
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Final Approvals</CardTitle>
              <CardDescription>Scheme recommendations needing final approval</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="border rounded p-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{approval.patientName}</h3>
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Final Approval
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">{approval.schemeName}</p>
                      <p className="text-sm mt-1">{approval.disease}</p>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t">
                        <span className="text-xs text-muted-foreground">
                          From: {approval.facilityName}
                        </span>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="h-8 text-sm border-red-600 text-red-600 hover:bg-red-50"
                            onClick={() => handleReject(approval)}
                          >
                            Reject
                          </Button>
                          <Button 
                            className="h-8 text-sm flex items-center gap-1"
                            onClick={() => handleApprove(approval)}
                          >
                            <Check size={14} />
                            Final Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Health Schemes</CardTitle>
              <CardDescription>Manage available health schemes for recommendation</CardDescription>
            </CardHeader>
            <CardContent>
              {schemes.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No health schemes added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schemes.map((scheme) => (
                    <div key={scheme.id} className="flex items-start justify-between p-3 border rounded">
                      <div>
                        <h3 className="font-medium">{scheme.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{scheme.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteScheme(scheme.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
