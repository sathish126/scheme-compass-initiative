
export interface Approval {
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

// Define the next level based on current role
export const getNextLevel = (currentRole: string): string => {
  switch (currentRole) {
    case "facility":
      return "hospital";
    case "hospital":
      return "district";
    case "district":
      return "state";
    case "state":
      return "super";
    default:
      return "approved";
  }
};

// Export data as CSV
export const exportApprovalsToCSV = (approvals: Approval[], title: string): void => {
  // Create CSV content
  let csvContent = "ID,Patient Name,Scheme,Disease,Facility,Date,Status\r\n";
  
  approvals.forEach(item => {
    const row = [
      item.id,
      item.patientName,
      item.schemeName,
      item.disease || "N/A",
      item.facilityName,
      item.date,
      item.status
    ];
    csvContent += row.map(field => `"${field}"`).join(",") + "\r\n";
  });
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export patient data as CSV for reports
export const exportPatientsToCSV = (patients: any[], title: string): void => {
  // Create CSV content
  let csvContent = "ID,Patient Name,Age,Gender,Disease,Contact,Medical History,Category,Insurance\r\n";
  
  patients.forEach(item => {
    const row = [
      item.id,
      item.name,
      item.age,
      item.gender,
      item.disease || "N/A",
      item.contact,
      item.medicalHistory,
      item.category,
      item.insuranceStatus ? "Insured" : "Uninsured"
    ];
    csvContent += row.map(field => `"${field}"`).join(",") + "\r\n";
  });
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Get alternative scheme recommendations based on disease
export const getAlternativeSchemes = (disease: string): string[] => {
  const diseaseSchemeMap: Record<string, string[]> = {
    "diabetes": ["Health For All", "Chronic Disease Management", "Universal Health Coverage"],
    "hypertension": ["Health For All", "Cardiovascular Care Scheme", "Senior Care Plus"],
    "malaria": ["Infectious Disease Control", "Rural Health Initiative", "Emergency Care Initiative"],
    "tuberculosis": ["TB Elimination Program", "Respiratory Health Scheme", "Health For All"],
    "dengue": ["Vector-Borne Disease Control", "Emergency Care Initiative", "Rural Health Initiative"],
    "covid19": ["COVID Relief Scheme", "Pandemic Response Program", "Respiratory Health Scheme"],
    "cancer": ["Cancer Care Initiative", "Critical Illness Support", "Health For All"],
    "malnutrition": ["Child Health Initiative", "Nutrition Support Program", "Rural Health Initiative"],
    "pregnancy": ["Maternal Welfare Scheme", "Women's Health Initiative", "Health For All"],
    "mental_health": ["Mental Health Support", "Psychological Wellness Scheme", "Universal Health Coverage"]
  };
  
  return diseaseSchemeMap[disease] || ["Health For All", "Universal Health Coverage"];
};
