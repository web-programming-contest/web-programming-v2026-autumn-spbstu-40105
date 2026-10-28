from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from .models import Order, Product


class StoreApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="demo", password="gadget2024")
        self.product = Product.objects.create(
            name="Тестовый гаджет", description="Описание", category="test",
            category_display="Тест", color="black", color_display="Черный",
            price=1000, rating=4.8, image="/images/goods/image_1.png", specs={},
        )

    def test_goods_are_public(self):
        response = self.client.get("/api/goods/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["name"], "Тестовый гаджет")

    def test_login_rejects_invalid_password(self):
        response = self.client.post("/api/login/", {"username": "demo", "password": "wrong"}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_order_requires_authentication(self):
        response = self.client.get("/api/orders/")
        self.assertEqual(response.status_code, 403)

    def test_create_and_read_order(self):
        self.client.force_login(self.user)
        response = self.client.post("/api/orders/", {
            "phone": "+7 999 123-45-67", "fulfillment": "delivery", "address": "Санкт-Петербург",
            "payment": "card", "gift_wrap": True, "items": [{"product_id": self.product.id, "quantity": 2}],
        }, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(float(response.data["total"]), 2290)
        self.assertEqual(Order.objects.get(user=self.user).items.count(), 1)

        history = self.client.get("/api/orders/")
        self.assertEqual(history.data[0]["item_count"], 2)
