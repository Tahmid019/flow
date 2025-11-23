from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import BiometricRecord
from datetime import datetime
import numpy as np
import onnxruntime as ort

sess = ort.InferenceSession("flow_model.onnx")

def predict_flow(features):
    X = np.array([features], dtype=np.float32)

    input_name = sess.get_inputs()[0].name
    pred = sess.run(None, {input_name: X})[0]

    return pred[0]

def latest_state(request):
    last = BiometricRecord.objects.order_by("-timestamp").first()
    if not last:
        return JsonResponse({"error": "no data"}, status=404)

    return JsonResponse({
        "timestamp": last.timestamp,
        "received_at": last.received_at,

        # Typing metrics
        "mean_iki_ms": last.mean_iki_ms,
        "variance_iki": last.variance_iki,
        "burstiness": last.burstiness,
        "total_keys": last.total_keys,
        "backspace_rate": last.backspace_rate,
        "backspaces": last.backspaces,

        # Mouse metrics
        "distance_px": last.distance_px,
        "click_rate_per_sec": last.click_rate_per_sec,
        "mouse_clicks": last.mouse_clicks,

        # System metrics
        "idle_time_ms": last.idle_time_ms,

        # ML output
        "state_prediction": last.state_prediction,
    })

@csrf_exempt
def biometric(request):
    if request.method == "POST":
        data = json.loads(request.body)

        typing = data.get("typing", {})
        mouse = data.get("mouse", {})

        timestamp_str = data.get("timestamp")
        timestamp = datetime.fromisoformat(timestamp_str.replace("Z", ""))

        record = BiometricRecord.objects.create(
            timestamp=timestamp,

            # Typing metrics
            mean_iki_ms=typing.get("mean_iki_ms", 0),
            variance_iki=typing.get("variance_iki", 0),
            burstiness=typing.get("burstiness", 0),
            total_keys=int(typing.get("total_keys", 0)),
            backspace_rate=typing.get("backspace_rate", 0),
            backspaces=int(typing.get("backspaces", 0)),

            # Mouse metrics
            distance_px=int(mouse.get("distance_px", 0)),
            click_rate_per_sec=mouse.get("click_rate_per_sec", 0),
            mouse_clicks=int(mouse.get("mouse_clicks", 0)),

            # System metrics
            idle_time_ms=int(data.get("idle_time_ms", 0)),
        )
        
        features = [
            record.mean_iki_ms,
            record.variance_iki,
            record.burstiness,
            record.total_keys,
            record.backspace_rate,
            record.backspaces,
            record.distance_px,
            record.click_rate_per_sec,
            record.mouse_clicks,
            record.idle_time_ms,
        ]
        
        state = predict_flow(features)
        
        record.state_prediction = state
        record.save()

        
        return JsonResponse({"status": "saved", "id": record.id, "state_prediction": state})

    return JsonResponse({"error": "POST only"}, status=405)