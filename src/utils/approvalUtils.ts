
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
