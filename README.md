# NLP Task-Aware Amplification Service

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r task_aware_amplifier/requirements.txt
   ```

2. **Train Models**
   (Run this to generate the model artifacts in `models/artifacts/`)
   ```bash
   python task_aware_amplifier/training/train_task_classifier.py
   python task_aware_amplifier/training/train_fusion_model.py
   ```

## Running the Service

Start the Flask server:
```bash
python task_aware_amplifier/app.py
```
The server will start on `http://localhost:8000`.

## Testing

You can test the API using PowerShell or curl.

**Example: Tired User opening YouTube (Harmful)**
```powershell
$body = @{
    current_state = "tired"
    next_window_title = "YouTube - Best memes"
    snippet_text = "memes"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/task/analyze" -Method Post -ContentType "application/json" -Body $body
```

**Example: Focused User doing Coding (Good)**
```powershell
$body = @{
    current_state = "focused"
    next_window_title = "VS Code - main.py"
    snippet_text = "def main():"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/task/analyze" -Method Post -ContentType "application/json" -Body $body
```
