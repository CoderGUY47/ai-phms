"use server";

import { GoogleGenAI } from "@google/genai";
import { OpenAI } from "openai";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { responseSchemaGemini, openAISchema } from "@/lib/schemas";
import { getMockExtraction } from "@/lib/mockData";

const execPromise = promisify(exec);

// fallback direct js execution engine
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
      model: "gemini-2.5-pro",
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

  if (!isGeminiAvailable && !isOpenAIAvailable) {
    // mock data fallback if neither key is set in env
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const data = getMockExtraction(fileName);
    return { success: true, data };
  }

  const apiType = isOpenAIAvailable && !isGeminiAvailable ? "openai" : "gemini";
  const apiKey = apiType === "openai" ? process.env.OPENAI_API_KEY! : process.env.GEMINI_API_KEY!;

  // we write files to pass base64 securely to python without exceeding windows command parameter limits.
  const tempDir = path.join(process.cwd(), "src", "app", "actions");
  const configPath = path.join(tempDir, `config_${Date.now()}.json`);
  const dataPath = path.join(tempDir, `data_${Date.now()}.json`);

  try {
    // 1. write the payloads to disk
    fs.writeFileSync(configPath, JSON.stringify({ api_type: apiType, api_key: apiKey }), "utf-8");
    fs.writeFileSync(dataPath, JSON.stringify({ base64: base64Image, mime_type: mimeType }), "utf-8");

    const pythonScript = path.join(tempDir, "extract.py");

    // 2. try running via python script (highly accurate combined python-js integration)
    try {
      // execute using "python" or "python3" depending on os path
      let cmd = `python "${pythonScript}" "${configPath}" "${dataPath}"`;
      let output;
      try {
        const { stdout } = await execPromise(cmd);
        output = stdout;
      } catch {
        // fallback command if python is linked to python3 on this path
        const { stdout } = await execPromise(`python3 "${pythonScript}" "${configPath}" "${dataPath}"`);
        output = stdout;
      }

      const response = JSON.parse(output.trim());
      if (response.success && response.data) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || "Python script failed to return valid JSON data");
      }
    } catch (pythonError) {
      console.warn("Python extraction failed, falling back to direct JS API call:", pythonError);

      // 3. fallback direct js execution if python environment is not available or errors out
      const data = await processDirectJS(apiType, apiKey, base64Image, mimeType);
      return { success: true, data };
    }
  } catch (error) {
    console.error("Hybrid AI processing error:", error);
    return { success: false, error: "Failed to process document. Please verify your API key or try again." };
  } finally {
    // clean up temporary config and data payload files
    try {
      if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
      if (fs.existsSync(dataPath)) fs.unlinkSync(dataPath);
    } catch (cleanupError) {
      console.error("Temp file cleanup error:", cleanupError);
    }
  }
}
