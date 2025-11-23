from enum import Enum
from dataclasses import dataclass, field
from typing import Optional, Dict, Any

class FocusState(str, Enum):
    HIGHLY_FOCUSED = "highly_focused"
    FOCUSED = "focused"
    DISTRACTED = "distracted"
    HIGHLY_DISTRACTED = "highly_distracted"
    TIRED = "tired"

@dataclass
class AnalyzeRequest:
    next_window_title: str
    current_state: Optional[str] = None
    next_url: Optional[str] = None
    snippet_text: Optional[str] = None
    current_task_context: Optional[str] = None

@dataclass
class Recommendation:
    type: str
    message: str

@dataclass
class AnalyzeResponse:
    next_task_category: str
    suitability: str
    reason: str
    recommendation: Recommendation

    def to_dict(self) -> Dict[str, Any]:
        return {
            "next_task_category": self.next_task_category,
            "suitability": self.suitability,
            "reason": self.reason,
            "recommendation": {
                "type": self.recommendation.type,
                "message": self.recommendation.message
            }
        }
