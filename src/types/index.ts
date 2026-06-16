export interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  classification: "Antibiotic" | "Vitamin" | "Calcium" | "Gastric" | "Painkiller" | "Other";
}

export interface TestResult {
  testName: string;
  value: string;
}

export interface MedicalRecord {
  recordId: string;
  patientId: string;
  date: string;
  doctorName: string;
  patientCase: string;
  respiratoryRate?: string;
  bloodPressure?: string;
  medicines: Medicine[];
  testResults: TestResult[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone?: string;
  status: "Active" | "Suspended";
  history: MedicalRecord[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  status: "Active" | "Suspended";
  totalPatients: number;
  experience: string;
  phone: string;
  email: string;
  designation?: string;
  counsellingTime?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entityType: "Patient" | "Doctor" | "Document" | "System";
  entityId: string;
  entityName: string;
  status: "SUCCESS" | "FAILED";
  performedBy: string;
}
