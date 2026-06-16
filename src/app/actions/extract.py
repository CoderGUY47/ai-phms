import sys
import json
import urllib.request
import urllib.error

def process_with_gemini(api_key, base64_data, mime_type):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={api_key}"
    
    # Structure matching standard Gemini 2.5 API
    payload = {
        "contents": [{
            "parts": [
                {
                    "inlineData": {
                        "mimeType": mime_type,
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
        
        # Extract the text reply from response choice
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text.strip())

def process_with_openai(api_key, base64_data, mime_type):
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
                            "url": f"data:{mime_type};base64,{base64_data}"
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

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "error": "Insufficient arguments"}))
        return

    config_path = sys.argv[1]
    data_path = sys.argv[2]
    
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)
        with open(data_path, "r", encoding="utf-8") as f:
            document_data = json.load(f)
            
        api_type = config.get("api_type")
        api_key = config.get("api_key")
        base64_data = document_data.get("base64")
        mime_type = document_data.get("mime_type")
        
        if not api_key:
            print(json.dumps({"success": False, "error": "API Key is missing"}))
            return
            
        if api_type == "openai":
            result = process_with_openai(api_key, base64_data, mime_type)
        else:
            result = process_with_gemini(api_key, base64_data, mime_type)
            
        print(json.dumps({"success": True, "data": result}))
        
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(json.dumps({"success": False, "error": f"HTTP Error {e.code}: {error_msg}"}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    main()
