from django.conf import settings
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.SlugField(max_length=64)
    category_display = models.CharField(max_length=100)
    color = models.SlugField(max_length=32)
    color_display = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    image = models.CharField(max_length=255)
    is_new = models.BooleanField(default=False)
    is_hit = models.BooleanField(default=False)
    specs = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_new", "-id"]

    def __str__(self):
        return self.name


class Order(models.Model):
    FULFILLMENT_CHOICES = [("pickup", "Самовывоз"), ("delivery", "Доставка")]
    PAYMENT_CHOICES = [("card", "По карте"), ("cash", "Наличными")]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=32)
    fulfillment = models.CharField(max_length=16, choices=FULFILLMENT_CHOICES)
    address = models.CharField(max_length=255, blank=True)
    payment = models.CharField(max_length=16, choices=PAYMENT_CHOICES)
    gift_wrap = models.BooleanField(default=False)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Заказ №{self.pk} — {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="order_items")
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product_name} × {self.quantity}"
