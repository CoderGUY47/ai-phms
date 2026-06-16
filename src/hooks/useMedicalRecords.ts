"use client";

import { useState, useEffect, useCallback } from "react";
import { MedicalRecord, Patient, Doctor, AuditLog } from "@/types";
import { v4 as uuidv4 } from "uuid";

const PATIENTS_KEY = "ai-phms-patients";
const DOCTORS_KEY = "ai-phms-doctors";
const RECORDS_KEY = "ai-phms-records";
const AUDIT_KEY = "ai-phms-audit";

function readLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLS<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

function addAudit(
  action: string,
  entityType: AuditLog["entityType"],
  entityId: string,
  entityName: string,
  status: "SUCCESS" | "FAILED" = "SUCCESS"
) {
  const logs: AuditLog[] = readLS<AuditLog[]>(AUDIT_KEY) || [];
  logs.unshift({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    action,
    entityType,
    entityId,
    entityName,
    status,
    performedBy: "Prof. Dr. Md. Mahbubur Rahman",
  });
  writeLS(AUDIT_KEY, logs.slice(0, 100)); // keep last 100
}

export function useMedicalRecords() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // fetch seed json, then merge with localstorage
    fetch("/data/patients.json")
      .then((r) => r.json())
      .then((seedPatients: Patient[]) => {
        const lsPatients: Patient[] = readLS<Patient[]>(PATIENTS_KEY) || [];
        // merge: localstorage versions override seed for same id
        const lsMap = new Map(lsPatients.map((p) => [p.id, p]));
        const merged = seedPatients.map((sp) => lsMap.get(sp.id) ?? sp);
        // add any localstorage-only patients (registered by admin)
        lsPatients.forEach((lp) => {
          if (!merged.find((m) => m.id === lp.id)) merged.push(lp);
        });
        setPatients(merged);

        const lsRecords: MedicalRecord[] = readLS<MedicalRecord[]>(RECORDS_KEY) || [];
        const seedRecords = seedPatients.flatMap((p) => p.history);
        const allRecordIds = new Set(lsRecords.map((r) => r.recordId));
        const merged2 = [...lsRecords, ...seedRecords.filter((r) => !allRecordIds.has(r.recordId))];
        setRecords(merged2);

        setIsLoaded(true);
      })
      .catch(() => {
        const lsPatients: Patient[] = readLS<Patient[]>(PATIENTS_KEY) || [];
        const lsRecords: MedicalRecord[] = readLS<MedicalRecord[]>(RECORDS_KEY) || [];
        setPatients(lsPatients);
        setRecords(lsRecords);
        setIsLoaded(true);
      });
  }, []);

  const addRecord = useCallback(
    (record: MedicalRecord) => {
      const newRecords = [record, ...records];
      setRecords(newRecords);
      const lsRecords: MedicalRecord[] = readLS<MedicalRecord[]>(RECORDS_KEY) || [];
      writeLS(RECORDS_KEY, [record, ...lsRecords]);

      const updated = patients.map((p) => {
        if (p.id === record.patientId) {
          return { ...p, history: [record, ...p.history] };
        }
        return p;
      });
      setPatients(updated);
      writeLS(PATIENTS_KEY, updated);
      addAudit("DOCUMENT_PARSED", "Document", record.recordId, `Record for ${record.patientId}`);
    },
    [records, patients]
  );

  const deleteRecord = useCallback(
    (recordId: string, patientId: string) => {
      const newRecords = records.filter((r) => r.recordId !== recordId);
      setRecords(newRecords);
      writeLS(RECORDS_KEY, newRecords);

      const updatedPatients = patients.map((p) => {
        if (p.id === patientId) {
          return { ...p, history: p.history.filter((r) => r.recordId !== recordId) };
        }
        return p;
      });
      setPatients(updatedPatients);
      writeLS(PATIENTS_KEY, updatedPatients);
      addAudit("RECORD_DELETED", "Document", recordId, `Record deleted for patient ${patientId}`);
    },
    [records, patients]
  );

  const updateRecord = useCallback(
    (updatedRecord: MedicalRecord) => {
      const newRecords = records.map((r) => r.recordId === updatedRecord.recordId ? updatedRecord : r);
      setRecords(newRecords);
      writeLS(RECORDS_KEY, newRecords);

      const updatedPatients = patients.map((p) => {
        if (p.id === updatedRecord.patientId) {
          return {
            ...p,
            history: p.history.map((r) => r.recordId === updatedRecord.recordId ? updatedRecord : r)
          };
        }
        return p;
      });
      setPatients(updatedPatients);
      writeLS(PATIENTS_KEY, updatedPatients);
      addAudit("RECORD_UPDATED", "Document", updatedRecord.recordId, `Record updated for patient ${updatedRecord.patientId}`);
    },
    [records, patients]
  );

  const registerPatient = useCallback(
    (patient: Omit<Patient, "history" | "status">) => {
      const newPatient: Patient = { ...patient, status: "Active", history: [] };
      const updated = [newPatient, ...patients];
      setPatients(updated);
      writeLS(PATIENTS_KEY, updated);
      addAudit("PATIENT_REGISTERED", "Patient", newPatient.id, newPatient.name);
    },
    [patients]
  );

  const suspendPatient = useCallback(
    (id: string) => {
      const updated = patients.map((p) => (p.id === id ? { ...p, status: "Suspended" as const } : p));
      setPatients(updated);
      writeLS(PATIENTS_KEY, updated);
      const p = patients.find((x) => x.id === id);
      addAudit("PATIENT_SUSPENDED", "Patient", id, p?.name ?? id);
    },
    [patients]
  );

  const activatePatient = useCallback(
    (id: string) => {
      const updated = patients.map((p) => (p.id === id ? { ...p, status: "Active" as const } : p));
      setPatients(updated);
      writeLS(PATIENTS_KEY, updated);
      const p = patients.find((x) => x.id === id);
      addAudit("PATIENT_ACTIVATED", "Patient", id, p?.name ?? id);
    },
    [patients]
  );

  const deletePatient = useCallback(
    (id: string) => {
      const p = patients.find((x) => x.id === id);
      const updated = patients.filter((x) => x.id !== id);
      const updRecs = records.filter((r) => r.patientId !== id);
      setPatients(updated);
      setRecords(updRecs);
      writeLS(PATIENTS_KEY, updated);
      writeLS(RECORDS_KEY, updRecs);
      addAudit("PATIENT_DELETED", "Patient", id, p?.name ?? id);
    },
    [patients, records]
  );

  const clearAllData = useCallback(() => {
    localStorage.removeItem(PATIENTS_KEY);
    localStorage.removeItem(RECORDS_KEY);
    localStorage.removeItem(AUDIT_KEY);
    localStorage.removeItem(DOCTORS_KEY);
    addAudit("DATA_CLEARED", "System", "all", "All localStorage Data");
    window.location.reload();
  }, []);

  return {
    patients,
    records,
    isLoaded,
    addRecord,
    deleteRecord,
    updateRecord,
    registerPatient,
    suspendPatient,
    activatePatient,
    deletePatient,
    clearAllData,
  };
}

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  useEffect(() => {
    setLogs(readLS<AuditLog[]>(AUDIT_KEY) || []);
  }, []);
  return logs;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const reload = useCallback(() => {
    fetch("/data/doctors.json")
      .then((r) => r.json())
      .then((seed: Doctor[]) => {
        const lsDoctors: Doctor[] = readLS<Doctor[]>(DOCTORS_KEY) || [];
        const lsMap = new Map(lsDoctors.map((d) => [d.id, d]));
        const merged = seed.map((s) => lsMap.get(s.id) ?? s);
        lsDoctors.forEach((d) => { if (!merged.find((m) => m.id === d.id)) merged.push(d); });
        setDoctors(merged);
      })
      .catch(() => setDoctors(readLS<Doctor[]>(DOCTORS_KEY) || []));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const registerDoctor = useCallback(
    (doctor: Omit<Doctor, "status" | "totalPatients">) => {
      const newDoc: Doctor = { ...doctor, status: "Active", totalPatients: 0 };
      const updated = [newDoc, ...doctors];
      setDoctors(updated);
      writeLS(DOCTORS_KEY, updated);
      addAudit("DOCTOR_REGISTERED", "Doctor", newDoc.id, newDoc.name);
    },
    [doctors]
  );

  const suspendDoctor = useCallback(
    (id: string) => {
      const updated = doctors.map((d) => (d.id === id ? { ...d, status: "Suspended" as const } : d));
      setDoctors(updated);
      writeLS(DOCTORS_KEY, updated);
      const d = doctors.find((x) => x.id === id);
      addAudit("DOCTOR_SUSPENDED", "Doctor", id, d?.name ?? id);
    },
    [doctors]
  );

  const activateDoctor = useCallback(
    (id: string) => {
      const updated = doctors.map((d) => (d.id === id ? { ...d, status: "Active" as const } : d));
      setDoctors(updated);
      writeLS(DOCTORS_KEY, updated);
      const d = doctors.find((x) => x.id === id);
      addAudit("DOCTOR_ACTIVATED", "Doctor", id, d?.name ?? id);
    },
    [doctors]
  );

  const deleteDoctor = useCallback(
    (id: string) => {
      const d = doctors.find((x) => x.id === id);
      const updated = doctors.filter((x) => x.id !== id);
      setDoctors(updated);
      writeLS(DOCTORS_KEY, updated);
      addAudit("DOCTOR_DELETED", "Doctor", id, d?.name ?? id);
    },
    [doctors]
  );

  return { doctors, registerDoctor, suspendDoctor, activateDoctor, deleteDoctor, reload };
}
