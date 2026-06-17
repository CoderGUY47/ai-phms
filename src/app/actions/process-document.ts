"use server";

import { GoogleGenAI } from "@google/genai";
import { OpenAI } from "openai";
import { responseSchemaGemini, openAISchema } from "@/lib/schemas";
import { getMockExtraction } from "@/lib/mockData";

// Native JS execution engine calling APIs directly using official SDKs
async function processDirectJS(apiType: "gemini" | "openai", apiKey: string, base64Image: string, mimeType: string) {
  if (apiType === "openai") {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_schema", json_schema: { name: "medical_record", schema: openAISchema } },
      messages: [
        {
          role: "system",
          content: "You are a medical scribe AI. Extract the medical information from the uploaded prescription or test report into the requested JSON schema. If any field is not available, return null or empty array."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract information from this medical document."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ]
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("No response generated from OpenAI");
    return JSON.parse(text);
  } else {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            {
              text: "Extract the medical information from this prescription or test report. Ensure the output accurately reflects the data present in the document. Follow the provided schema strictly.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchemaGemini,
      },
    });

    if (!response.text) throw new Error("No response generated from Gemini");
    return JSON.parse(response.text);
  }
}

export async function processDocument(base64Image: string, mimeType: string, fileName?: string) {
  const isGeminiAvailable = !!process.env.GEMINI_API_KEY;
  const isOpenAIAvailable = !!process.env.OPENAI_API_KEY;

  const fs = require("fs");
  const path = require("path");
  const logPath = path.join(process.cwd(), "process-debug.log");
  const timestamp = new Date().toISOString();
  
  fs.appendFileSync(logPath, `\n--- [${timestamp}] processDocument called ---\n`);
  fs.appendFileSync(logPath, `fileName: ${fileName}, mimeType: ${mimeType}\n`);
  fs.appendFileSync(logPath, `isGeminiAvailable: ${isGeminiAvailable} (key: ${process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + "..." : "undefined"})\n`);
  fs.appendFileSync(logPath, `isOpenAIAvailable: ${isOpenAIAvailable}\n`);

  if (!isGeminiAvailable && !isOpenAIAvailable) {
    fs.appendFileSync(logPath, `Fallback to mock data!\n`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const data = getMockExtraction(fileName);
    fs.appendFileSync(logPath, `Mock data returned: ${JSON.stringify(data, null, 2)}\n`);
    return { success: true, data };
  }

  const apiType = isOpenAIAvailable && !isGeminiAvailable ? "openai" : "gemini";
  const apiKey = apiType === "openai" ? process.env.OPENAI_API_KEY! : process.env.GEMINI_API_KEY!;
  fs.appendFileSync(logPath, `apiType: ${apiType}\n`);

  try {
    const ext = mimeType.split("/")[1] || "png";
    const debugImgPath = path.join(process.cwd(), `uploaded-debug-image.${ext}`);
    fs.writeFileSync(debugImgPath, Buffer.from(base64Image, "base64"));
    fs.appendFileSync(logPath, `Saved uploaded image to: ${debugImgPath}\n`);
  } catch (err) {
    fs.appendFileSync(logPath, `Failed to save debug image: ${err.message}\n`);
  }

  try {
    const data = await processDirectJS(apiType, apiKey, base64Image, mimeType);
    fs.appendFileSync(logPath, `API Extraction Success! Data: ${JSON.stringify(data, null, 2)}\n`);
    return { success: true, data };
  } catch (error) {
    fs.appendFileSync(logPath, `API Extraction Error: ${error.stack || error.message || error}\n`);
    console.error("AI processing error:", error);
    return { success: false, error: "Failed to process document. Please verify your API key or try again." };
  }
}
