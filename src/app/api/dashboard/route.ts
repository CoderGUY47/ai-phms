import { NextResponse } from "next/server";

const bodyCompositionData = [
  { name: "Oxygen", value: 45, color: "#22c55e" },
  { name: "Carbon", value: 20, color: "#f59e0b" },
  { name: "Hydrogen", value: 16, color: "#a855f7" },
  { name: "Nitrogen", value: 10, color: "#3b82f6" },
  { name: "Calcium", value: 7, color: "#ec4899" },
  { name: "Other", value: 5, color: "#10b981" },
];

const caloriesStatsData = [
  { month: "Jan", calories: 4.5 },
  { month: "Feb", calories: 8.2 },
  { month: "Mar", calories: 5.1 },
  { month: "Apr", calories: 7.8 },
  { month: "May", calories: 6.2 },
  { month: "Jun", calories: 9.0 },
  { month: "Jul", calories: 4.8 },
  { month: "Aug", calories: 7.1 },
  { month: "Sep", calories: 5.5 },
  { month: "Oct", calories: 8.5 },
  { month: "Nov", calories: 6.0 },
  { month: "Dec", calories: 7.5 },
];

const subTargetsData = [
  { name: "Dietary Plan", value: 80, color: "#22c55e" },
  { name: "Physical Exercise", value: 90, color: "#3b82f6" },
  { name: "Medication Adherence", value: 95, color: "#a855f7" },
  { name: "Sleep Quality Pattern", value: 75, color: "#f59e0b" },
  { name: "Hydration Intake", value: 85, color: "#06b6d4" },
  { name: "Mental Balance", value: 88, color: "#ec4899" },
];

const deptStatsData = [
  { name: "Cardiology", Doctors: 4, Patients: 32 },
  { name: "Neurology", Doctors: 3, Patients: 18 },
  { name: "Medicine", Doctors: 2, Patients: 45 },
  { name: "Surgery", Doctors: 3, Patients: 24 },
];

const triageLogs = [
  { id: "1", patient: "Rakibul Hasan", dept: "Cardiology", priority: "Emergency", time: "10:15 AM", status: "In Consultation" },
  { id: "2", patient: "Fatema Khanam", dept: "Medicine", priority: "Urgent", time: "11:00 AM", status: "Waiting" },
  { id: "3", patient: "Sabbir Ahmed", dept: "Neurology", priority: "Routine", time: "11:30 AM", status: "Completed" },
  { id: "4", patient: "Andrien Bertrand", dept: "Cardiology", priority: "Emergency", time: "11:45 AM", status: "In Consultation" },
  { id: "5", patient: "Hridoy Hossain", dept: "Surgery", priority: "Routine", time: "12:15 PM", status: "Waiting" },
];

const prescriptionScanLogs = [
  { id: "scan-101", name: "Ibn Sina Rx Scan #4920", patient: "Rakibul Hasan", parsedMeds: "Atorvastatin, Metformin", status: "Analyzed", matchRate: "98%" },
  { id: "scan-102", name: "Prescription Scan #4921", patient: "Fatema Khanam", parsedMeds: "Losartan, Omeprazole", status: "Analyzed", matchRate: "95%" },
  { id: "scan-103", name: "Rx Diagnostic #4922", patient: "Sabbir Ahmed", parsedMeds: "Gabapentin, Amitriptyline", status: "Review Required", matchRate: "88%" },
  { id: "scan-104", name: "Clinical Report #4923", patient: "Andrien Bertrand", parsedMeds: "Clopidogrel, Aspirin", status: "Analyzed", matchRate: "99%" },
  { id: "scan-105", name: "Ibn Sina Rx Scan #4924", patient: "Hridoy Hossain", parsedMeds: "Amoxicillin, Paracetamol", status: "Analyzed", matchRate: "94%" },
];

const organsInfo = {
  Brain: { 
    percentage: 85, 
    color: "#a855f7", 
    desc: "Cognitive functions and neural reflex speeds are within normal variance.", 
    icon: "🧠", 
    status: "Optimal",
    aiDiagnosis: "AI Inference: Synaptic network transmission speed normal. 0 anomalies detected in frontal lobe pattern recognition."
  },
  Lungs: { 
    percentage: 90, 
    color: "#22c55e", 
    desc: "Respiratory volumes normal. Oxygen perfusion rate remains at 98%.", 
    icon: "🫁", 
    status: "Optimal",
    aiDiagnosis: "AI Inference: Clear pulmonary fields. Residual capacity measured at 3.2L. Respiration cycle depth nominal."
  },
  Heart: { 
    percentage: 89, 
    color: "#3b82f6", 
    desc: "Sinus rhythm stable. Ejection fraction recorded at 62%.", 
    icon: "❤️", 
    status: "Stable",
    aiDiagnosis: "AI Inference: QRS complex duration 94ms. Average stroke volume 70mL. Minimal valvular calcification detected."
  },
  Stomach: { 
    percentage: 99, 
    color: "#22c55e", 
    desc: "Digestion rates normal. Gastric secretions and motility are excellent.", 
    icon: "🥣", 
    status: "Excellent",
    aiDiagnosis: "AI Inference: Gastrointestinal motility index at 9.8. Microbial microbiome balance index stands at 94% optimal."
  },
  Liver: { 
    percentage: 95, 
    color: "#22c55e", 
    desc: "Hepatic enzymes optimal. Complete clearance and toxin filtration operational.", 
    icon: "🪵", 
    status: "Healthy",
    aiDiagnosis: "AI Inference: Alkaline phosphatase (ALP) at 68 U/L. Hepatic vascular perfusion rate stands at 1.2L/min."
  },
};

export async function GET() {
  return NextResponse.json({
    bodyCompositionData,
    caloriesStatsData,
    subTargetsData,
    deptStatsData,
    triageLogs,
    prescriptionScanLogs,
    organsInfo,
  });
}
