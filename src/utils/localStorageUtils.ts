import { Patient } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Define types for approval workflow
export interface PatientApproval {
  id: string;
  patientId: string;
  patientName: string;
  schemeName: string;
  disease: string;
  facilityName: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
  history?: string;
  currentLevel: "facility" | "hospital" | "district" | "state";
}

// Save a new patient to localStorage
export const savePatient = (patient: Omit<Patient, "id" | "createdAt">): Patient => {
  // Get existing patients
  const patients = getPatients();
  
  // Create new patient with ID and timestamp
  const newPatient: Patient = {
    ...patient,
    id: uuidv4(),
    createdAt: new Date(),
  };
  
  // Add to array and save
  patients.push(newPatient);
  localStorage.setItem('patients', JSON.stringify(patients));
  
  // Create initial approval entries for recommended schemes
  if (patient.recommendedSchemes && patient.recommendedSchemes.length > 0) {
    patient.recommendedSchemes.forEach(scheme => {
      addApproval({
        id: uuidv4(),
        patientId: newPatient.id,
        patientName: newPatient.name,
        schemeName: scheme.name,
        disease: patient.disease || "Not specified",
        facilityName: "Primary Health Center", // Would come from auth context in real app
        date: new Date().toISOString().split('T')[0],
        status: "pending",
        notes: scheme.description || "",
        currentLevel: "facility"
      });
    });
  }
  
  return newPatient;
};

// Get all patients from localStorage
export const getPatients = (): Patient[] => {
  const patientsJson = localStorage.getItem('patients');
  if (!patientsJson) return [];
  
  try {
    return JSON.parse(patientsJson);
  } catch (e) {
    console.error("Failed to parse patients from localStorage:", e);
    return [];
  }
};

// Save approvals to localStorage
export const addApproval = (approval: PatientApproval): void => {
  const approvals = getApprovals();
  approvals.push(approval);
  localStorage.setItem('approvals', JSON.stringify(approvals));
};

// Get all approvals from localStorage
export const getApprovals = (): PatientApproval[] => {
  const approvalsJson = localStorage.getItem('approvals');
  if (!approvalsJson) return [];
  
  try {
    return JSON.parse(approvalsJson);
  } catch (e) {
    console.error("Failed to parse approvals from localStorage:", e);
    return [];
  }
};

// Get approvals filtered by role level
export const getApprovalsByLevel = (level: string): PatientApproval[] => {
  const approvals = getApprovals();
  return approvals.filter(approval => approval.currentLevel === level);
};

// Approve a recommendation and move to next level
export const approveRecommendation = (id: string): void => {
  const approvals = getApprovals();
  const approvalIndex = approvals.findIndex(a => a.id === id);
  
  if (approvalIndex !== -1) {
    const approval = approvals[approvalIndex];
    
    // Determine next level
    let nextLevel: "facility" | "hospital" | "district" | "state" | null = null;
    
    switch (approval.currentLevel) {
      case "facility":
        nextLevel = "hospital";
        break;
      case "hospital":
        nextLevel = "district";
        break;
      case "district":
        nextLevel = "state";
        break;
      case "state":
        // Final approval
        approval.status = "approved";
        break;
    }
    
    if (nextLevel) {
      approval.currentLevel = nextLevel;
    }
    
    // Update approval
    approvals[approvalIndex] = approval;
    localStorage.setItem('approvals', JSON.stringify(approvals));
  }
};

// Reject a recommendation
export const rejectRecommendation = (id: string): void => {
  const approvals = getApprovals();
  const approvalIndex = approvals.findIndex(a => a.id === id);
  
  if (approvalIndex !== -1) {
    approvals[approvalIndex].status = "rejected";
    localStorage.setItem('approvals', JSON.stringify(approvals));
  }
};

// Get dashboard statistics based on localStorage data
export const getDashboardStats = (role: string) => {
  const patients = getPatients();
  const approvals = getApprovals();
  
  const today = new Date().toDateString();
  
  return {
    totalPatients: patients.length,
    registeredToday: patients.filter(p => new Date(p.createdAt).toDateString() === today).length,
    pendingApprovals: approvals.filter(a => a.currentLevel === role && a.status === "pending").length,
    patientFollowups: Math.floor(patients.length / 3) // Mocked data for followups
  };
};
