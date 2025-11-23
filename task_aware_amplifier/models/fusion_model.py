import joblib
import os
import pandas as pd
from typing import Optional
from utils.logging_utils import setup_logger

logger = setup_logger("fusion_model")

class FusionModel:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self._load_model()

    def _load_model(self):
        if self.model_path and os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                logger.info(f"Loaded Fusion Model from {self.model_path}")
            except Exception as e:
                logger.error(f"Failed to load Fusion Model: {e}")
        else:
            logger.warning(f"Fusion Model path {self.model_path} does not exist.")

    def predict(self, current_state: str, next_task_category: str, time_of_day: int = 0, session_duration: float = 0.0) -> str:
        """
        Predicts suitability: good / neutral / bad / harmful
        """
        if not self.model:
            logger.warning("No fusion model loaded. Returning 'neutral' default.")
            return "neutral"

                                                           
                                                                    
                                                                                   
                                                                                               
                                            
        
        input_data = pd.DataFrame([{
            "current_state": current_state,
            "next_task_category": next_task_category,
            "time_of_day": time_of_day,
            "session_duration": session_duration
        }])

        try:
            prediction = self.model.predict(input_data)[0]
            return prediction
        except Exception as e:
            logger.error(f"Fusion prediction failed: {e}")
            return "neutral"
