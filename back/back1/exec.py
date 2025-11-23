import os
import django
import csv
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "back1.settings")
django.setup()

from api.models import BiometricRecord

features = [
    "mean_iki_ms",
    "variance_iki",
    "burstiness",
    "total_keys",
    "backspace_rate",
    "backspaces",
    "distance_px",
    "click_rate_per_sec",
    "mouse_clicks", 
    "idle_time_ms",
]

qs = BiometricRecord.objects.all().order_by("timestamp")

out_path = Path("biometrics_export.csv")

with out_path.open("w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(features)

    for obj in qs:
        row = [getattr(obj, field, "") for field in features]
        writer.writerow(row)

print(f"Exported {qs.count()} rows → {out_path.resolve()}")
