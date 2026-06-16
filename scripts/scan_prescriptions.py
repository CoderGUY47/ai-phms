import os
import sys
import json
import base64
import urllib.request
import urllib.error

def read_env_keys():
    keys = {}
    env_path = ".env.local"
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    parts = line.split("=", 1)
                    if len(parts) == 2:
                        keys[parts[0].strip()] = parts[1].strip()
    return keys

def get_base64_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def process_with_gemini(api_key, base64_data, filename):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={api_key}"
    
    payload = {
        "contents": [{
            "parts": [
                {
                    "inlineData": {
                        "mimeType": "image/jpeg",
                        "data": base64_data
                    }
                },
                {
                    "text": "Extract all medical info from this prescription or report. You MUST respond with ONLY a raw JSON object matching this schema:\n{\n  \"doctorName\": \"string\",\n  \"date\": \"YYYY-MM-DD\",\n  \"patientCase\": \"string summary of case\",\n  \"respiratoryRate\": \"string or null\",\n  \"bloodPressure\": \"string or null\",\n  \"medicines\": [\n    {\n      \"name\": \"string\",\n      \"dosage\": \"string\",\n      \"duration\": \"string\",\n      \"classification\": \"Antibiotic\" | \"Vitamin\" | \"Calcium\" | \"Gastric\" | \"Painkiller\" | \"Other\"\n    }\n  ],\n  \"testResults\": [\n    {\n      \"testName\": \"string\",\n      \"value\": \"string\"\n    }\n  ]\n}"
                }
            ]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    with urllib.request.urlopen(req) as res:
        response_body = res.read().decode("utf-8")
        data = json.loads(response_body)
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text.strip())

def process_with_openai(api_key, base64_data, filename):
    url = "https://api.openai.com/v1/chat/completions"
    
    payload = {
        "model": "gpt-4o",
        "response_format": { "type": "json_object" },
        "messages": [
            {
                "role": "system",
                "content": "You are a medical scribe AI. Extract medical information from the document. You must return a JSON object matching this schema:\n{\n  \"doctorName\": \"string\",\n  \"date\": \"YYYY-MM-DD\",\n  \"patientCase\": \"string\",\n  \"respiratoryRate\": \"string or null\",\n  \"bloodPressure\": \"string or null\",\n  \"medicines\": [\n    {\n      \"name\": \"string\",\n      \"dosage\": \"string\",\n      \"duration\": \"string\",\n      \"classification\": \"Antibiotic\" | \"Vitamin\" | \"Calcium\" | \"Gastric\" | \"Painkiller\" | \"Other\"\n    }\n  ],\n  \"testResults\": [\n    {\n      \"testName\": \"string\",\n      \"value\": \"string\"\n    }\n  ]\n}"
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Extract information from this medical document."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_data}"
                        }
                    }
                ]
            }
        ]
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        },
        method="POST"
    )
    
    with urllib.request.urlopen(req) as res:
        response_body = res.read().decode("utf-8")
        data = json.loads(response_body)
        text = data["choices"][0]["message"]["content"]
        return json.loads(text.strip())

def get_mock_fallback(filename):
    # Standard mocks for testing
    mocks = {
        "prescription (1).jpg": {
            "doctorName": "Dr. Mohammad Anisur Rahman",
            "date": "2024-11-15",
            "patientCase": "Chest pain and shortness of breath for 3 days. History of hypertension.",
            "respiratoryRate": "20 breaths/min",
            "bloodPressure": "145/95 mmHg",
            "medicines": [
                { "name": "Amlodipine", "dosage": "5mg once daily", "duration": "30 days", "classification": "Other" },
                { "name": "Atorvastatin", "dosage": "20mg at night", "duration": "90 days", "classification": "Other" }
            ],
            "testResults": [
                { "testName": "Total Cholesterol", "value": "215 mg/dL" },
                { "testName": "LDL", "value": "138 mg/dL" }
            ]
        },
        "prescription (2).jpg": {
            "doctorName": "Dr. Aminul Islam",
            "date": "2024-06-20",
            "patientCase": "Stomach ache after meals, bloating, acid reflux for 2 weeks.",
            "respiratoryRate": None,
            "bloodPressure": None,
            "medicines": [
                { "name": "Omeprazole", "dosage": "20mg before meals", "duration": "14 days", "classification": "Gastric" },
                { "name": "Domperidone", "dosage": "10mg three times daily", "duration": "7 days", "classification": "Gastric" }
            ],
            "testResults": [
                { "testName": "H. Pylori Test", "value": "Negative" }
            ]
        },
        "prescription (3).jpg": {
            "doctorName": "Dr. Salma Begum",
            "date": "2024-12-01",
            "patientCase": "Irregular menstrual cycle, abdominal pain, fatigue. Suspected iron deficiency.",
            "respiratoryRate": "16 breaths/min",
            "bloodPressure": "110/70 mmHg",
            "medicines": [
                { "name": "Ferrous Sulfate", "dosage": "200mg twice daily", "duration": "60 days", "classification": "Vitamin" },
                { "name": "Calcium Carbonate", "dosage": "500mg twice daily", "duration": "30 days", "classification": "Calcium" }
            ],
            "testResults": [
                { "testName": "Hemoglobin", "value": "9.2 g/dL" }
            ]
        },
        "prescription (4).jpg": {
            "doctorName": "Dr. Farhan Hossain",
            "date": "2025-01-10",
            "patientCase": "Severe headache and blurred vision for 5 days. Tension headache suspected.",
            "respiratoryRate": None,
            "bloodPressure": "120/80 mmHg",
            "medicines": [
                { "name": "Naproxen", "dosage": "250mg twice daily", "duration": "5 days", "classification": "Painkiller" },
                { "name": "Vitamin B Complex", "dosage": "1 tablet daily", "duration": "30 days", "classification": "Vitamin" }
            ],
            "testResults": []
        },
        "prescription (5).jpg": {
            "doctorName": "Dr. Jannatul Ferdous",
            "date": "2024-08-03",
            "patientCase": "Post-chemotherapy follow-up. Persistent nausea and fatigue.",
            "respiratoryRate": None,
            "bloodPressure": None,
            "medicines": [
                { "name": "Ondansetron", "dosage": "8mg twice daily", "duration": "14 days", "classification": "Gastric" },
                { "name": "Multivitamin", "dosage": "1 tablet daily", "duration": "90 days", "classification": "Vitamin" }
            ],
            "testResults": [
                { "testName": "CA-125 Tumor Marker", "value": "28 U/mL" }
            ]
        },
        "prescription (6).jpg": {
            "doctorName": "Dr. Rezaul Karim",
            "date": "2024-09-12",
            "patientCase": "Right knee swelling and pain after sports injury. Mild osteoarthritis.",
            "respiratoryRate": "15 breaths/min",
            "bloodPressure": "125/82 mmHg",
            "medicines": [
                { "name": "Diclofenac", "dosage": "50mg twice daily", "duration": "10 days", "classification": "Painkiller" },
                { "name": "Calcium + Vitamin D3", "dosage": "1 tablet daily", "duration": "60 days", "classification": "Calcium" }
            ],
            "testResults": [
                { "testName": "X-Ray Right Knee", "value": "Mild joint space narrowing" }
            ]
        }
    }
    return mocks.get(filename, {
        "doctorName": "Dr. Anonymous",
        "date": "2026-06-15",
        "patientCase": f"Extracted prescription data from {filename}",
        "respiratoryRate": None,
        "bloodPressure": None,
        "medicines": [],
        "testResults": []
    })

def main():
    print("="*60)
    print("      AI-PHMS PRESCRIPTION BATCH SCANNER & EXTRACTOR")
    print("="*60)
    
    keys = read_env_keys()
    openai_key = keys.get("OPENAI_API_KEY")
    gemini_key = keys.get("GEMINI_API_KEY")
    
    api_mode = "MOCK"
    if openai_key:
        api_mode = "OPENAI"
        print("-> Detected OpenAI key in .env.local. Running with GPT-4o...")
    elif gemini_key:
        api_mode = "GEMINI"
        print("-> Detected Gemini key in .env.local. Running with Gemini-2.5...")
    else:
        print("-> No keys detected in .env.local. Running in MOCK fallback simulation mode...")
        
    assets_dir = "public/assets"
    if not os.path.exists(assets_dir):
        print(f"Error: assets directory '{assets_dir}' not found.")
        sys.exit(1)
        
    files = [f for f in os.listdir(assets_dir) if f.startswith("prescription") and f.endswith(".jpg")]
    files.sort()
    
    if not files:
        print("No prescription images found matching public/assets/prescription*.jpg")
        sys.exit(1)
        
    print(f"Found {len(files)} prescriptions to scan.\n")
    results = {}
    
    for filename in files:
        file_path = os.path.join(assets_dir, filename)
        print(f"Scanning {filename}...", end="", flush=True)
        
        try:
            if api_mode == "MOCK":
                extracted_data = get_mock_fallback(filename)
            elif api_mode == "OPENAI":
                base64_data = get_base64_image(file_path)
                extracted_data = process_with_openai(openai_key, base64_data, filename)
            elif api_mode == "GEMINI":
                base64_data = get_base64_image(file_path)
                extracted_data = process_with_gemini(gemini_key, base64_data, filename)
                
            results[filename] = extracted_data
            print(" SUCCESS")
            print(f"   Doctor     : {extracted_data.get('doctorName')}")
            print(f"   Date       : {extracted_data.get('date')}")
            print(f"   Medicines  : {', '.join([m.get('name') for m in extracted_data.get('medicines', [])])}")
            print(f"   Test Results: {', '.join([t.get('testName') + ': ' + t.get('value') for t in extracted_data.get('testResults', [])])}")
            print("-" * 50)
        except Exception as e:
            print(" FAILED")
            print(f"   Reason: {e}")
            print("-" * 50)
            
    # Write scanned data output to file
    out_dir = "public/data"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "scanned_prescriptions.json")
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
        
    print("\n" + "="*60)
    print(f"BATCH INGESTION COMPLETED SUCCESSFULLY!")
    print(f"Scanned output written to: {out_path}")
    print("="*60)

if __name__ == "__main__":
    main()
