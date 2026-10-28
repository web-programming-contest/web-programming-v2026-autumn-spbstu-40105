from django.contrib import admin
from django.urls import path, re_path
from store import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/csrf/", views.csrf),
    path("api/login/", views.login_view),
    path("api/logout/", views.logout_view),
    path("api/me/", views.me),
    path("api/goods/", views.goods),
    path("api/orders/", views.orders),
    re_path(r"^(?!api/|admin/).*$", views.spa),
]
