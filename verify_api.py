import requests
import json

url = "http://localhost:8000/task/analyze"

payload = {
    "tasks": [
        {
            "timestamp": "2025-11-23T12:29:12Z",
            "app": "msedge.exe",
            "title": "Random forest model prediction and 43 more pages - Personal - Microsoft Edge",
            "url": "",
            "active": True
        }
    ]
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    try:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 200 and "recommendation" in response.json():
            print("\nSUCCESS: API accepted the new payload.")
        else:
            print("\nFAILURE: API did not return expected response.")
    except json.JSONDecodeError:
        print("Response Text (Not JSON):")
        print(response.text)

except Exception as e:
    print(f"\nERROR: Could not connect to server. {e}")
