import os
import joblib
import torch
import logging
from typing import Optional

                                                                                  
try:
    from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

from utils.logging_utils import setup_logger

logger = setup_logger("task_classifier")

class TaskClassifier:
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        self.mode = "fallback"                                          
        self.labels = [
            "deep_work_coding", "studying_reading", "writing_notes", 
            "research_browsing", "light_browsing", "social_media", 
            "entertainment_video", "communication", "utility_productive", 
            "other_unknown"
        ]
        
        self._load_model()

    def _load_model(self):
        if self.model_path and os.path.exists(self.model_path):
                                                   
            if os.path.isdir(self.model_path) and any(f.endswith('config.json') for f in os.listdir(self.model_path)):
                if TRANSFORMERS_AVAILABLE:
                    try:
                        logger.info(f"Loading Transformer model from {self.model_path}")
                        self.tokenizer = DistilBertTokenizer.from_pretrained(self.model_path)
                        self.model = DistilBertForSequenceClassification.from_pretrained(self.model_path)
                        self.model.eval()
                        self.mode = "transformer"
                        return
                    except Exception as e:
                        logger.error(f"Failed to load Transformer model: {e}")
            
                                                 
            elif self.model_path.endswith('.joblib') or os.path.isfile(self.model_path):
                try:
                    logger.info(f"Loading sklearn model from {self.model_path}")
                    self.model = joblib.load(self.model_path)
                    self.mode = "sklearn"
                    return
                except Exception as e:
                    logger.error(f"Failed to load sklearn model: {e}")

        logger.warning("No valid model found. Using fallback logic.")
        self.mode = "fallback"

    def predict(self, window_title: str, url: str = None, text_snippet: str = None) -> str:
        """
        Predicts the task category based on inputs.
        """
                        
        features = f"{window_title} {url or ''} {text_snippet or ''}".strip()
        
        if self.mode == "transformer" and self.model and self.tokenizer:
            try:
                inputs = self.tokenizer(features, return_tensors="pt", truncation=True, padding=True, max_length=128)
                with torch.no_grad():
                    logits = self.model(**inputs).logits
                predicted_class_id = logits.argmax().item()
                                                                            
                                                              
                                                                           
                                                                                         
                if predicted_class_id < len(self.labels):
                    return self.labels[predicted_class_id]
            except Exception as e:
                logger.error(f"Transformer prediction failed: {e}")

        elif self.mode == "sklearn" and self.model:
            try:
                                                                      
                return self.model.predict([features])[0]
            except Exception as e:
                logger.error(f"Sklearn prediction failed: {e}")

                             
        return self._heuristic_predict(window_title, url, text_snippet)

    def _heuristic_predict(self, title: str, url: str, snippet: str) -> str:
        text = (title + " " + (url or "") + " " + (snippet or "")).lower()
        
        if "youtube" in text or "netflix" in text or "video" in text:
            return "entertainment_video"
        if "vs code" in text or ".py" in text or "github" in text or "terminal" in text:
            return "deep_work_coding"
        if "instagram" in text or "twitter" in text or "reddit" in text or "facebook" in text:
            return "social_media"
        if "pdf" in text or "book" in text or "paper" in text or "arxiv" in text:
            return "studying_reading"
        if "gmail" in text or "slack" in text or "whatsapp" in text or "discord" in text:
            return "communication"
        if "stackoverflow" in text or "docs" in text:
            return "research_browsing"
        
        return "other_unknown"
