import * as fs from "fs";
import * as path from "path";
import { Medicine, TestResult } from "@/types";

export interface MockDataResult {
  doctorName: string;
  date: string;
  patientCase: string;
  respiratoryRate?: string;
  bloodPressure?: string;
  medicines: Medicine[];
  testResults: TestResult[];
}

// generates mock extraction result based on the filename or random selection
export function getMockExtraction(fileName?: string): MockDataResult {
  const cleanName = fileName
    ? fileName.toLowerCase().replace(/[\s\-_()]/g, "")
    : "";

  // load mock prescriptions data dynamically from json file
  const jsonPath = path.join(
    process.cwd(),
    "public",
    "data",
    "mock-prescriptions.json",
  );
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const mockData = JSON.parse(raw);

  const staticScenarios = mockData.staticScenarios as any;

  // 1. check for predefined files (1, 2, or 3)
  if (cleanName.includes("1") || cleanName.includes("one"))
    return staticScenarios["1"] as MockDataResult;
  if (cleanName.includes("2") || cleanName.includes("two"))
    return staticScenarios["2"] as MockDataResult;
  if (cleanName.includes("3") || cleanName.includes("three"))
    return staticScenarios["3"] as MockDataResult;

  // 2. fallback: pick one of the three scenarios randomly
  const keys = Object.keys(staticScenarios);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const selected = staticScenarios[randomKey];
  const randomDate = new Date(
    Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .split("T")[0];

  return {
    ...selected,
    date: randomDate,
    patientCase: `[Sandbox Mode] ${selected.patientCase} (Simulated extraction for ${fileName || "custom_document"})`,
  } as MockDataResult;
}
