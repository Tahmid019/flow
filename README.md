# NLP Task Amplifier

## 🧠 Project Overview
The **NLP Task Amplifier** is an intelligent microservice designed to enhance user productivity by analyzing their digital context. It acts as a "Flow Facilitator," detecting what task the user is performing and determining its suitability based on their current cognitive state.

This system uses a combination of **Natural Language Processing (NLP)** and **Machine Learning (ML)** to classify tasks and predict the impact of switching to a new activity. It provides real-time recommendations to help users maintain focus, avoid distractions, and optimize their workflow.

## 🚀 Key Features
- **Context-Aware Task Classification**: Instantly identifies the category of the user's active window (e.g., Coding, Social Media, Reading).
- **Cognitive State Fusion**: Combines the detected task with the user's current cognitive state (e.g., Focused, Tired) to evaluate the transition.
- **Smart Recommendations**: Offers actionable advice (e.g., "Stay Focused," "Take a Break") based on the suitability of the action.
- **Hybrid AI Architecture**: Utilizes a robust fallback system combining Transformer models, classical ML, and heuristics.

---

## 🤖 Model Architecture & Details

### 1. Task Classifier (`models/task_classifier.py`)
**Significance**: This model is the "eyes" of the system. It understands the semantic meaning of the user's active window to categorize their activity.

*   **Architecture**: Hybrid Multi-Stage Pipeline
    1.  **Transformer (Primary)**: Supports `DistilBERT` for high-accuracy semantic understanding of window titles and text snippets.
    2.  **Logistic Regression (Secondary)**: A lightweight `sklearn` model using **TF-IDF** vectorization (1000 features). This is the default active model for speed and efficiency.
    3.  **Heuristic Fallback (Safety Net)**: A rule-based system that keywords (e.g., "youtube", "vscode") to ensure classification even if models fail.
*   **Input**: `window_title`, `url`, `snippet_text`
*   **Output**: Task Category (e.g., `deep_work_coding`, `entertainment_video`)

### 2. Fusion Model (`models/fusion_model.py`)
**Significance**: This model is the "brain" of the system. It contextualizes the task within the user's broader state to make intelligent decisions.

*   **Architecture**: **Random Forest Classifier**
    *   **Ensemble Method**: Uses 100 decision trees to capture complex non-linear relationships between state, task, and time.
    *   **Preprocessing**:
        *   **One-Hot Encoding**: For categorical features (`current_state`, `next_task_category`).
        *   **Standard Scaling**: For numeric features (`time_of_day`, `session_duration`).
*   **Input**:
    *   `current_state` (e.g., Focused, Tired)
    *   `next_task_category` (from Task Classifier)
    *   `time_of_day` (0-23)
    *   `session_duration` (minutes)
*   **Output**: Suitability Score (`good`, `neutral`, `bad`, `harmful`)

---

## 🛠️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Tahmid019/flow.git
    cd flow
    ```

2.  **Create a Virtual Environment**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r task_aware_amplifier/requirements.txt
    ```

---

## ▶️ Running the Service

The service exposes a REST API to analyze tasks.

1.  **Start the Server**
    ```bash
    python task_aware_amplifier/app.py
    ```
    The server will start on `http://localhost:8000`.

2.  **API Usage**
    **Endpoint**: `POST /task/analyze`
    
    **Payload**:
    ```json
    {
        "tasks": [
            {
                "timestamp": "2025-11-23T12:29:12Z",
                "app": "code.exe",
                "title": "app.py - NLP Task Amplifier - Visual Studio Code",
                "url": "",
                "active": true
            }
        ],
        "current_state": "focused"  // Optional, defaults to "focused"
    }
    ```

---

## 🏋️ Training the Models

The project includes scripts to retrain the models from scratch.

### Train Task Classifier
This script trains the TF-IDF + Logistic Regression model.
```bash
python task_aware_amplifier/training/train_task_classifier.py
```
*   **Data Source**: `task_aware_amplifier/training/sample_dataset.csv`
*   **Artifact**: Saves to `task_aware_amplifier/models/artifacts/task_classifier.joblib`

### Train Fusion Model
This script generates synthetic data representing various user scenarios and trains the Random Forest model.
```bash
python task_aware_amplifier/training/train_fusion_model.py
```
*   **Data Source**: Synthetic generation within the script.
*   **Artifact**: Saves to `task_aware_amplifier/models/artifacts/fusion_model.joblib`

---

## 📂 Project Structure

```
NLP Task Amplifier/
├── task_aware_amplifier/
│   ├── app.py                 # Flask API Entry Point
│   ├── config.py              # Configuration settings
│   ├── logic/                 # Business Logic
│   │   ├── decision_engine.py # Rules for final recommendations
│   │   └── schemas.py         # Data models (Pydantic/Dataclasses)
│   ├── models/                # ML Model Wrappers
│   │   ├── task_classifier.py # NLP Model Logic
│   │   ├── fusion_model.py    # Context Fusion Logic
│   │   └── artifacts/         # Saved model files (.joblib)
│   ├── training/              # Training Scripts
│   │   ├── train_task_classifier.py
│   │   └── train_fusion_model.py
│   └── utils/                 # Utilities (Logging, etc.)
├── requirements.txt           # Python Dependencies
└── README.md                  # Project Documentation
```
