from flask import Flask, request, jsonify
import os
import logging
from logic.schemas import AnalyzeRequest, AnalyzeResponse, Recommendation, FocusState
from logic.decision_engine import DecisionEngine
from models.task_classifier import TaskClassifier
from models.fusion_model import FusionModel
from config import TASK_CLASSIFIER_MODEL_PATH, FUSION_MODEL_PATH
from utils.logging_utils import setup_logger

app = Flask(__name__)
logger = setup_logger("app")

                       
logger.info("Initializing models...")
task_classifier = TaskClassifier(model_path=TASK_CLASSIFIER_MODEL_PATH)
fusion_model = FusionModel(model_path=FUSION_MODEL_PATH)
decision_engine = DecisionEngine()

@app.route('/task/analyze', methods=['POST'])
def analyze_task():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        # Handle new payload format with "tasks" list
        if 'tasks' in data:
            active_task = next((t for t in data['tasks'] if t.get('active')), None)
            if not active_task:
                # Fallback to the first task if no active task is marked, or error
                if data['tasks']:
                    active_task = data['tasks'][0]
                else:
                    return jsonify({"error": "No tasks provided"}), 400
            
            req = AnalyzeRequest(
                current_state=data.get('current_state', FocusState.FOCUSED.value), # Default to FOCUSED if not provided
                next_window_title=active_task.get('title', ''),
                next_url=active_task.get('url', ''),
                snippet_text=data.get('snippet_text'), # Might not be in new payload, keep optional
                current_task_context=data.get('current_task_context')
            )
        else:
            # Handle legacy payload
            try:
                req = AnalyzeRequest(
                    current_state=data.get('current_state', FocusState.FOCUSED.value),
                    next_window_title=data.get('next_window_title'),
                    next_url=data.get('next_url'),
                    snippet_text=data.get('snippet_text'),
                    current_task_context=data.get('current_task_context')
                )
            except Exception as e:
                return jsonify({"error": f"Missing or invalid fields: {str(e)}"}), 400

        next_task_category = task_classifier.predict(
            window_title=req.next_window_title,
            url=req.next_url,
            text_snippet=req.snippet_text
        )
        
        suitability = fusion_model.predict(
            current_state=req.current_state,
            next_task_category=next_task_category,
            time_of_day=data.get('time_of_day', 12),
            session_duration=data.get('session_duration', 0)
        )

        decision = decision_engine.decide(
            current_state=req.current_state,
            next_task_category=next_task_category,
            suitability=suitability
        )

        response = AnalyzeResponse(
            next_task_category=next_task_category,
            suitability=suitability,
            reason=decision['reason'],
            recommendation=decision['recommendation']
        )

        return jsonify(response.to_dict())

    except Exception as e:
        logger.error(f"Error in /task/analyze: {e}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
