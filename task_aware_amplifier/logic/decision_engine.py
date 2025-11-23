from typing import Dict, Any
from .schemas import FocusState, Recommendation

class DecisionEngine:
    def decide(self, current_state: str, next_task_category: str, suitability: str) -> Dict[str, Any]:
        """
        Decides on the recommendation based on state, task, and suitability.
        """
        reason = ""
        rec_type = "neutral"
        rec_message = ""

                                                         
        if current_state == FocusState.TIRED and next_task_category in ["entertainment_video", "social_media", "light_browsing"] and suitability in ["harmful", "bad"]:
            reason = "User is tired and about to doomscroll."
            rec_type = "avoid_entertainment"
            rec_message = "You're tired. Watching this now will likely reduce your productivity further. Take a 2-minute breathing break or a short walk instead."

                                                                      
        elif current_state == FocusState.HIGHLY_FOCUSED and next_task_category in ["social_media", "communication", "entertainment_video"] and suitability in ["bad", "harmful"]:
            reason = "This will break your deep flow state."
            rec_type = "stay_focused"
            rec_message = "You are in a high focus state. Postpone messages and finish your current deep work block."

                                                           
        elif current_state in [FocusState.FOCUSED, FocusState.HIGHLY_FOCUSED] and next_task_category in ["studying_reading", "deep_work_coding", "writing_notes", "research_browsing"] and suitability == "good":
            reason = "Great alignment of state and task."
            rec_type = "continue_work"
            rec_message = "You are doing great. Keep up the momentum."

                                                       
        elif current_state in [FocusState.DISTRACTED, FocusState.HIGHLY_DISTRACTED] and next_task_category in ["entertainment_video", "social_media"]:
            reason = "Using entertainment while distracted reduces control."
            rec_type = "avoid_distraction"
            rec_message = "You are already distracted. Switching to this will make it harder to refocus. Try a guided breathing exercise instead."

                                                      
        elif current_state == FocusState.TIRED and next_task_category in ["studying_reading", "deep_work_coding", "writing_notes"]:
            reason = "Efficiency will be low due to fatigue."
            rec_type = "take_break"
            rec_message = "You are tired. Pushing through might be inefficient. Take a short 5-minute recovery break, then resume."
        
                                                               
        elif current_state == FocusState.DISTRACTED and next_task_category == "utility_productive":
            reason = "Small productive wins help regain focus."
            rec_type = "encourage_utility"
            rec_message = "Good idea. Clearing small tasks can help you get back into the flow."

                                                            
        elif current_state == FocusState.TIRED and next_task_category == "utility_productive":
            reason = "Low energy tasks are perfect for now."
            rec_type = "allow_utility"
            rec_message = "This is a good use of your current energy level."
        
                                                                                                        
        elif current_state == FocusState.FOCUSED and next_task_category == "communication":
            reason = "Communication might break focus."
            rec_type = "caution_communication"
            rec_message = "Check if this is urgent. If not, consider batching emails/messages later."
        
                            
        else:
            reason = f"Transition from {current_state} to {next_task_category} is {suitability}."
            rec_type = "info"
            rec_message = "Proceed with awareness."
                                             

        return {
            "reason": reason,
            "recommendation": Recommendation(type=rec_type, message=rec_message)
        }
