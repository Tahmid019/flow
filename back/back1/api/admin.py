from django.contrib import admin
from .models import BiometricRecord, UserTask

@admin.register(UserTask)
class UserTaskAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "app", "title", "url", "active", "record")
    ordering = ("-timestamp",)

@admin.register(BiometricRecord)
class BiometricRecordAdmin(admin.ModelAdmin):
    list_display = (
        "timestamp",
        "mean_iki_ms",
        "total_keys",
        "backspaces",
        "distance_px",
        "click_rate_per_sec",
        "mouse_clicks",
        "idle_time_ms",
        "received_at",
    )

    list_filter = ("timestamp",)
    ordering = ("-timestamp",)
