from django.contrib import admin
from .models import Order, OrderItem, Product


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category_display", "price", "rating", "is_new", "is_hit")
    list_filter = ("category", "color", "is_new", "is_hit")
    search_fields = ("name",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "total", "fulfillment", "payment")
    list_filter = ("fulfillment", "payment", "created_at")
    inlines = [OrderItemInline]
