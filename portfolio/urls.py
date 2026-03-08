from django.urls import path

from .views import api_portfolio, contact_submit, home

urlpatterns = [
    path("", home, name="home"),
    path("contact/", contact_submit, name="contact_submit"),
    path("api/portfolio/", api_portfolio, name="api_portfolio"),
]
