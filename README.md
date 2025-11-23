# 🧠 NLP Task Amplifier: The "Flow Facilitator"

> **"A Context-Aware AI Microservice for Cognitive State Optimization"**

## 📖 Table of Contents
1.  [Philosophy & Concept](#-philosophy--concept)
2.  [System Architecture](#-system-architecture)
3.  [Technical Deep Dive](#-technical-deep-dive)
    *   [Task Classifier (The Eyes)](#1-task-classifier-the-eyes)
    *   [Fusion Model (The Brain)](#2-fusion-model-the-brain)
    *   [Decision Engine (The Voice)](#3-decision-engine-the-voice)
4.  [API Reference](#-api-reference)
5.  [Installation & Setup](#-installation--setup)
6.  [Training & Extensibility](#-training--extensibility)
7.  [Project Structure](#-project-structure)

---

## 💡 Philosophy & Concept

In the modern digital workspace, "context switching" is the silent killer of productivity. Moving from deep coding to a quick email check can cost 23 minutes of refocus time.

**NLP Task Amplifier** is not just a blocker; it is a **Flow Facilitator**. It understands that not all distractions are equal and not all productive tasks are suitable for every energy level.

*   **The Problem**: Traditional blockers are binary (Block vs. Allow). They don't know if you are "tired" or "focused," or if a YouTube video is for entertainment or a tutorial.
*   **The Solution**: A system that analyzes the **semantic context** of your screen and fuses it with your **cognitive state** to provide nuanced, real-time nudges.

---

## 🏗 System Architecture

The system operates as a microservice in a larger "Flow State" ecosystem. It follows a **Sense-Think-Act** cycle:

1.  **Sense**: Receives raw data (Window Title, URL, Text Snippet) and current user state (e.g., "Focused").
2.  **Think**:
    *   **Classify**: What is this task? (e.g., `deep_work_coding`)
    *   **Fuse**: Is this task *good* for the current state? (e.g., `harmful` transition)
    *   **Decide**: What should we tell the user? (e.g., "Don't doomscroll now.")
3.  **Act**: Returns a JSON response with a recommendation.

---

## 🔬 Technical Deep Dive

### 1. Task Classifier ("The Eyes")
**Location**: `models/task_classifier.py`

This component determines *what* the user is looking at. It uses a **Hybrid Multi-Stage Pipeline** for maximum robustness.

*   **Stage 1: Transformer Model (High Accuracy)**
    *   **Model**: `DistilBERT` (Distilled Bidirectional Encoder Representations from Transformers).
    *   **Why?**: It understands context. "Python" (the language) vs. "Python" (the snake) is distinguished by surrounding words.
    *   **Input**: Concatenated string of `Window Title + URL + Snippet`.
    *   **Output**: Logits for 10 classes.

*   **Stage 2: Logistic Regression (High Speed)**
    *   **Model**: `sklearn.linear_model.LogisticRegression` with `TfidfVectorizer`.
    *   **Why?**: Transformers are heavy (CPU/RAM). For rapid switching, a lightweight statistical model is often sufficient (95% accuracy for 1% compute).
    *   **Features**: Top 1000 n-grams from the training corpus.

*   **Stage 3: Heuristic Fallback (Safety Net)**
    *   **Logic**: Keyword matching (e.g., `if "youtube" in url: return "entertainment_video"`).
    *   **Why?**: Ensures the system *never* crashes or returns "unknown" for obvious common apps.

**Supported Categories**:
`deep_work_coding`, `studying_reading`, `writing_notes`, `research_browsing`, `light_browsing`, `social_media`, `entertainment_video`, `communication`, `utility_productive`, `other_unknown`.

### 2. Fusion Model ("The Brain")
**Location**: `models/fusion_model.py`

This component determines the **suitability** of the transition. It answers: *"Is it a good idea to switch to X while feeling Y?"*

*   **Model**: **Random Forest Classifier** (`sklearn.ensemble.RandomForestClassifier`).
*   **Why?**: Decision trees are excellent at capturing non-linear interactions between categorical variables (State, Task) and continuous variables (Time, Duration).
*   **Input Features**:
    *   `current_state` (Categorical): `focused`, `tired`, `distracted`, etc.
    *   `next_task_category` (Categorical): Output from Task Classifier.
    *   `time_of_day` (Numeric): Hour (0-23). Doomscrolling at 2 AM is worse than at 2 PM.
    *   `session_duration` (Numeric): Minutes in current state. Breaking focus after 5 mins is worse than after 90 mins.
*   **Output Classes**:
    *   `good`: Productive flow (e.g., Focused -> Coding).
    *   `neutral`: Acceptable transition (e.g., Distracted -> Utility).
    *   `bad`: Suboptimal (e.g., Focused -> Email).
    *   `harmful`: Active destruction of flow (e.g., Tired -> Doomscrolling).

### 3. Decision Engine ("The Voice")
**Location**: `logic/decision_engine.py`

This rule-based engine translates the ML outputs into human-readable advice.

**Key Logic Examples**:
*   **The "Doomscroll Prevention" Rule**:
    *   *If* `State == TIRED` *AND* `Task == Social Media` *AND* `Suitability == HARMFUL`:
    *   *Then*: "You're tired. Watching this now will likely reduce your productivity further. Take a 2-minute breathing break."
*   **The "Flow Protection" Rule**:
    *   *If* `State == HIGHLY_FOCUSED` *AND* `Task == Communication`:
    *   *Then*: "You are in a high focus state. Postpone messages and finish your current deep work block."

---

## 🔌 API Reference

### Endpoint: Analyze Task
**POST** `/task/analyze`

Analyzes a list of tasks (windows) and returns a recommendation based on the active one.

#### Request Body
```json
{
  "tasks": [
    {
      "timestamp": "2025-11-23T12:00:00Z",
      "app": "msedge.exe",
      "title": "Advanced Quantum Physics - Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Quantum_mechanics",
      "active": true
    }
  ],
  "current_state": "focused", // Optional: "focused", "tired", "distracted"
  "time_of_day": 14,          // Optional: Hour (0-23)
  "session_duration": 45      // Optional: Minutes
}
```

#### Response Body
```json
{
  "next_task_category": "studying_reading",
  "suitability": "good",
  "reason": "Great alignment of state and task.",
  "recommendation": {
    "type": "continue_work",
    "message": "You are doing great. Keep up the momentum."
  }
}
```

---

## 💻 Installation & Setup

### Prerequisites
*   Python 3.9+
*   Git

### Steps
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Tahmid019/flow.git
    cd flow
    ```

2.  **Environment Setup**
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

4.  **Run the Server**
    ```bash
    python task_aware_amplifier/app.py
    ```

---

## 🎓 Training & Extensibility

### Retraining the Task Classifier
To add new categories or improve accuracy:
1.  Edit `task_aware_amplifier/training/sample_dataset.csv` with new examples.
2.  Run the training script:
    ```bash
    python task_aware_amplifier/training/train_task_classifier.py
    ```
    *This will regenerate `models/artifacts/task_classifier.joblib`.*

### Retraining the Fusion Model
To change how the system evaluates transitions:
1.  Edit `generate_fusion_data()` in `task_aware_amplifier/training/train_fusion_model.py`.
2.  Run the training script:
    ```bash
    python task_aware_amplifier/training/train_fusion_model.py
    ```

---

## 📂 Project Structure

| Path | Description |
| :--- | :--- |
| **`task_aware_amplifier/`** | **Core Package** |
| `├── app.py` | Main Flask application entry point. |
| `├── config.py` | Global configuration (paths, constants). |
| **`├── logic/`** | **Business Logic Layer** |
| `│   ├── decision_engine.py` | Rule engine for generating recommendations. |
| `│   └── schemas.py` | Data validation schemas (AnalyzeRequest, Response). |
| **`├── models/`** | **Machine Learning Layer** |
| `│   ├── task_classifier.py` | Wrapper for Text Classification (BERT/Logistic). |
| `│   ├── fusion_model.py` | Wrapper for Context Fusion (Random Forest). |
| `│   └── artifacts/` | Directory for serialized model files (.joblib). |
| **`├── training/`** | **Training Scripts** |
| `│   ├── sample_dataset.csv` | Dataset for text classification. |
| `│   ├── train_task_classifier.py` | Script to train the NLP model. |
| `│   └── train_fusion_model.py` | Script to train the Fusion model. |
| `└── utils/` | Helper functions (logging, etc.). |
