from django.urls import path
from .views import biometric, latest_state

urlpatterns = [
    path('biometric/', biometric),
    path("latest_state/", latest_state),
]
