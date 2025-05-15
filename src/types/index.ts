
export type UserRole = 'facility' | 'hospital' | 'district' | 'state' | 'super';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  facility?: string;
  hospital?: string;
  district?: string;
  state?: string;
  avatar?: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibilityCriteria: {
    age?: { min?: number; max?: number };
    income?: { max: number };
    category?: Array<'general' | 'obc' | 'sc' | 'st'>;
    gender?: Array<'male' | 'female' | 'other'>;
  };
  benefits: string[];
  documents: string[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  contact: string;
  medicalHistory: string;
  income: number;
  category: 'general' | 'obc' | 'sc' | 'st';
  insuranceStatus: boolean;
  createdAt: Date;
  updatedBy: string;
  disease?: string;
  recommendedSchemes?: Scheme[];
}

export interface SchemeRecommendation {
  id: string;
  patientId: string;
  schemeId: string;
  status: 'suggested' | 'hospital_approved' | 'district_approved' | 'state_approved' | 'rejected';
  hospitalApprovedAt?: Date;
  districtApprovedAt?: Date;
  stateApprovedAt?: Date;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stats {
  totalPatients: number;
  totalRecommendations: number;
  pendingApprovals: number;
  approvedRecommendations: number;
  rejectedRecommendations: number;
}
