import pandas as pd
import os
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline

        
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models", "artifacts")
MODEL_PATH = os.path.join(MODEL_DIR, "fusion_model.joblib")

def generate_fusion_data():
                                                             
    data = [
                                 
                                                          
        {"current_state": "tired", "next_task_category": "entertainment_video", "time_of_day": 23, "session_duration": 60, "suitability": "harmful"},
        {"current_state": "tired", "next_task_category": "social_media", "time_of_day": 22, "session_duration": 45, "suitability": "harmful"},
        {"current_state": "tired", "next_task_category": "light_browsing", "time_of_day": 23, "session_duration": 30, "suitability": "bad"},
                                           
        {"current_state": "tired", "next_task_category": "deep_work_coding", "time_of_day": 21, "session_duration": 90, "suitability": "bad"},
        {"current_state": "tired", "next_task_category": "studying_reading", "time_of_day": 22, "session_duration": 80, "suitability": "bad"},
                                                                      
        {"current_state": "tired", "next_task_category": "utility_productive", "time_of_day": 20, "session_duration": 10, "suitability": "good"},
        {"current_state": "tired", "next_task_category": "communication", "time_of_day": 18, "session_duration": 15, "suitability": "neutral"},

                                   
                                             
        {"current_state": "focused", "next_task_category": "deep_work_coding", "time_of_day": 10, "session_duration": 30, "suitability": "good"},
        {"current_state": "focused", "next_task_category": "writing_notes", "time_of_day": 11, "session_duration": 20, "suitability": "good"},
        {"current_state": "focused", "next_task_category": "research_browsing", "time_of_day": 14, "session_duration": 40, "suitability": "good"},
                                                      
        {"current_state": "focused", "next_task_category": "social_media", "time_of_day": 10, "session_duration": 15, "suitability": "bad"},
        {"current_state": "focused", "next_task_category": "entertainment_video", "time_of_day": 11, "session_duration": 5, "suitability": "bad"},
        {"current_state": "focused", "next_task_category": "light_browsing", "time_of_day": 15, "session_duration": 10, "suitability": "neutral"},

                                          
                                       
        {"current_state": "highly_focused", "next_task_category": "deep_work_coding", "time_of_day": 9, "session_duration": 60, "suitability": "good"},
        {"current_state": "highly_focused", "next_task_category": "studying_reading", "time_of_day": 14, "session_duration": 45, "suitability": "good"},
                                                                           
        {"current_state": "highly_focused", "next_task_category": "social_media", "time_of_day": 10, "session_duration": 5, "suitability": "harmful"},
        {"current_state": "highly_focused", "next_task_category": "communication", "time_of_day": 11, "session_duration": 2, "suitability": "bad"},
        {"current_state": "highly_focused", "next_task_category": "utility_productive", "time_of_day": 12, "session_duration": 5, "suitability": "neutral"},

                                      
                                                        
        {"current_state": "distracted", "next_task_category": "entertainment_video", "time_of_day": 16, "session_duration": 5, "suitability": "harmful"},
        {"current_state": "distracted", "next_task_category": "social_media", "time_of_day": 15, "session_duration": 10, "suitability": "harmful"},
                                                        
        {"current_state": "distracted", "next_task_category": "deep_work_coding", "time_of_day": 14, "session_duration": 10, "suitability": "neutral"},
        {"current_state": "distracted", "next_task_category": "writing_notes", "time_of_day": 11, "session_duration": 15, "suitability": "neutral"},
                                                                     
        {"current_state": "distracted", "next_task_category": "utility_productive", "time_of_day": 13, "session_duration": 5, "suitability": "good"},
        
                                             
        {"current_state": "highly_distracted", "next_task_category": "social_media", "time_of_day": 14, "session_duration": 30, "suitability": "harmful"},
        {"current_state": "highly_distracted", "next_task_category": "deep_work_coding", "time_of_day": 15, "session_duration": 5, "suitability": "bad"},
        {"current_state": "highly_distracted", "next_task_category": "utility_productive", "time_of_day": 16, "session_duration": 5, "suitability": "neutral"},
    ]
                                            
    return pd.DataFrame(data * 10) 

def train():
    print("Generating fusion data...")
    df = generate_fusion_data()
    
    X = df.drop('suitability', axis=1)
    y = df['suitability']
    
                   
    categorical_features = ['current_state', 'next_task_category']
    numeric_features = ['time_of_day', 'session_duration']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
            ('num', StandardScaler(), numeric_features)
        ])
    
              
    print("Training fusion model...")
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    pipeline.fit(X, y)
    
          
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
        
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Fusion model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train()
