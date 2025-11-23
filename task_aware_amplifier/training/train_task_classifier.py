import pandas as pd
import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

        
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "training", "sample_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models", "artifacts")
MODEL_PATH = os.path.join(MODEL_DIR, "task_classifier")                                             

def train():
    print("Loading data...")
    if not os.path.exists(DATA_PATH):
        print(f"Data not found at {DATA_PATH}")
        return

    df = pd.read_csv(DATA_PATH)
    
                         
    df['features'] = df['window_title'].fillna('') + " " + df['url'].fillna('') + " " + df['snippet_text'].fillna('')
    
    X = df['features']
    y = df['label']
    
                      
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
              
    print("Training model...")
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=1000)),
        ('clf', LogisticRegression(multi_class='ovr'))
    ])
    
    pipeline.fit(X_train, y_train)
    
              
    print("Evaluating...")
    print(classification_report(y_test, pipeline.predict(X_test)))
    
          
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
        
                                                      
    save_path = MODEL_PATH + ".joblib"
    joblib.dump(pipeline, save_path)
    print(f"Model saved to {save_path}")

if __name__ == "__main__":
    train()
