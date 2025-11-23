@echo off
cd /d "%~dp0"
echo ==========================================
echo NLP Task Amplifier - Startup Script
echo ==========================================

echo [1/3] Checking dependencies...
pip install -r task_aware_amplifier/requirements.txt

echo [2/3] Training/Updating models...
python task_aware_amplifier/training/train_task_classifier.py
python task_aware_amplifier/training/train_fusion_model.py

echo [3/3] Starting Service...
echo Server will run at http://localhost:8000
python task_aware_amplifier/app.py

pause
