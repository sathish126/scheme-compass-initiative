
import { Patient, SchemeRecommendation, User } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Auth APIs
export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to login");
  }

  return response.json();
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to logout");
  }
};

// Patient APIs
export const getPatients = async (): Promise<Patient[]> => {
  const response = await fetch(`${API_URL}/patients`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch patients");
  }

  return response.json();
};

export const addPatient = async (patient: Omit<Patient, "id" | "createdAt" | "updatedBy">): Promise<Patient> => {
  const response = await fetch(`${API_URL}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(patient),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add patient");
  }

  return response.json();
};

// Approval APIs
export const getApprovals = async (role: string): Promise<SchemeRecommendation[]> => {
  const response = await fetch(`${API_URL}/approvals?role=${role}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch approvals");
  }

  return response.json();
};

export const approveRecommendation = async (id: string, comments?: string): Promise<SchemeRecommendation> => {
  const response = await fetch(`${API_URL}/approvals/${id}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ comments }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to approve recommendation");
  }

  return response.json();
};

export const rejectRecommendation = async (id: string, reason: string): Promise<SchemeRecommendation> => {
  const response = await fetch(`${API_URL}/approvals/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to reject recommendation");
  }

  return response.json();
};

// Statistics APIs
export const getDashboardStats = async (role: string): Promise<any> => {
  const response = await fetch(`${API_URL}/stats/dashboard?role=${role}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch dashboard statistics");
  }

  return response.json();
};
