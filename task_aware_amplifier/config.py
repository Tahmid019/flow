import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TASK_CLASSIFIER_MODEL_PATH = os.path.join(BASE_DIR, "models", "artifacts", "task_classifier")
FUSION_MODEL_PATH = os.path.join(BASE_DIR, "models", "artifacts", "fusion_model.joblib")
