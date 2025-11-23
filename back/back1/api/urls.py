from django.urls import path
from .views import biometric, latest_state, latest_tasks

urlpatterns = [
    path('biometric/', biometric),
    path("latest_state/", latest_state),
    path("latest_tasks/", latest_tasks),

]
