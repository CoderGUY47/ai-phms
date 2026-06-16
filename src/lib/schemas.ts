import { Type, Schema } from "@google/genai";

// validation schema for google gemini structure extraction
export const responseSchemaGemini: Schema = {
  type: Type.OBJECT,
  properties: {
    doctorName: {
      type: Type.STRING,
      description: "Name of the doctor who issued the prescription",
    },
    date: {
      type: Type.STRING,
      description: "Date of the consultation in ISO 8601 format (YYYY-MM-DD)",
    },
    patientCase: {
      type: Type.STRING,
      description: "Summary of the patient's case or symptoms",
    },
    respiratoryRate: {
      type: Type.STRING,
      description: "Respiratory rate (RR) if available",
      nullable: true,
    },
    bloodPressure: {
      type: Type.STRING,
      description: "Blood pressure if available",
      nullable: true,
    },
    medicines: {
      type: Type.ARRAY,
      description: "List of prescribed medicines",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Name of the medicine",
          },
          dosage: {
            type: Type.STRING,
            description: "Dosage instructions (e.g., 500mg, 1 tablet)",
          },
          duration: {
            type: Type.STRING,
            description: "Duration for taking the medicine (e.g., 5 days, 1 month)",
          },
          classification: {
            type: Type.STRING,
            description: "Classification of the medicine",
            enum: ["Antibiotic", "Vitamin", "Calcium", "Gastric", "Painkiller", "Other"],
          },
        },
        required: ["name", "dosage", "duration", "classification"],
      },
    },
    testResults: {
      type: Type.ARRAY,
      description: "List of diagnostic test results mentioned",
      items: {
        type: Type.OBJECT,
        properties: {
          testName: {
            type: Type.STRING,
          },
          value: {
            type: Type.STRING,
          },
        },
        required: ["testName", "value"],
      },
    },
  },
  required: ["doctorName", "date", "patientCase", "medicines", "testResults"],
};

// validation schema for openai structure extraction
export const openAISchema = {
  type: "object",
  properties: {
    doctorName: { type: "string" },
    date: { type: "string" },
    patientCase: { type: "string" },
    respiratoryRate: { type: "string", nullable: true },
    bloodPressure: { type: "string", nullable: true },
    medicines: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          dosage: { type: "string" },
          duration: { type: "string" },
          classification: { type: "string", enum: ["Antibiotic", "Vitamin", "Calcium", "Gastric", "Painkiller", "Other"] }
        },
        required: ["name", "dosage", "duration", "classification"]
      }
    },
    testResults: {
      type: "array",
      items: {
        type: "object",
        properties: {
          testName: { type: "string" },
          value: { type: "string" }
        },
        required: ["testName", "value"]
      }
    }
  },
  required: ["doctorName", "date", "patientCase", "medicines", "testResults"],
  additionalProperties: false
};
