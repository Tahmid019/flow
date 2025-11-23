from django.db import models

class BiometricRecord(models.Model):
    timestamp = models.DateTimeField()

    # Typing metrics
    mean_iki_ms = models.FloatField(default=0)
    variance_iki = models.FloatField(default=0)
    burstiness = models.FloatField(default=0)
    total_keys = models.IntegerField(default=0)
    backspace_rate = models.FloatField(default=0)
    backspaces = models.IntegerField(default=0)

    # Mouse metrics
    distance_px = models.IntegerField(default=0)
    click_rate_per_sec = models.FloatField(default=0)
    mouse_clicks = models.IntegerField(default=0)

    # System metrics
    idle_time_ms = models.IntegerField(default=0)
    
    # ML output
    state_prediction = models.CharField(max_length=100, default="")

    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp} | state={self.state_prediction}"


class UserTask(models.Model):
    timestamp = models.DateTimeField()
    app = models.CharField(max_length=200)
    title = models.CharField(max_length=500)
    url = models.CharField(max_length=1000, blank=True)
    active = models.BooleanField(default=False)

    record = models.ForeignKey(
        "BiometricRecord",
        on_delete=models.CASCADE,
        related_name="tasks",
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.timestamp} | {self.app} | {self.title}"
