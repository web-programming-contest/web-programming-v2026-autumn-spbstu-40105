from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers
from .models import Order, OrderItem, Product


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "id", "name", "description", "category", "category_display",
            "color", "color_display", "price", "rating", "image",
            "is_new", "is_hit", "specs", "created_at",
        )


class OrderItemSerializer(serializers.ModelSerializer):
    image = serializers.CharField(source="product.image", read_only=True)

    class Meta:
        model = OrderItem
        fields = ("id", "product", "product_name", "price", "quantity", "image")


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()
    fulfillment_display = serializers.CharField(source="get_fulfillment_display", read_only=True)
    payment_display = serializers.CharField(source="get_payment_display", read_only=True)

    class Meta:
        model = Order
        fields = (
            "id", "created_at", "total", "item_count", "items", "email", "phone",
            "fulfillment", "fulfillment_display", "address", "payment", "payment_display", "gift_wrap",
        )

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, max_value=99)


class OrderCreateSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=32)
    fulfillment = serializers.ChoiceField(choices=("pickup", "delivery"))
    address = serializers.CharField(required=False, allow_blank=True, max_length=255)
    payment = serializers.ChoiceField(choices=("card", "cash"))
    gift_wrap = serializers.BooleanField(default=False)
    items = OrderItemInputSerializer(many=True, allow_empty=False)

    def validate_phone(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 10:
            raise serializers.ValidationError("Введите корректный номер телефона")
        return value

    def validate(self, attrs):
        if attrs["fulfillment"] == "delivery" and not attrs.get("address", "").strip():
            raise serializers.ValidationError({"address": "Укажите адрес доставки"})
        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        product_ids = [item["product_id"] for item in items_data]
        products = Product.objects.in_bulk(product_ids)
        if len(products) != len(set(product_ids)):
            raise serializers.ValidationError({"items": "Один или несколько товаров не найдены"})

        with transaction.atomic():
            subtotal = sum(products[i["product_id"]].price * i["quantity"] for i in items_data)
            total = subtotal + (290 if validated_data["gift_wrap"] else 0)
            order = Order.objects.create(
                user=self.context["request"].user,
                total=total,
                **validated_data,
            )
            OrderItem.objects.bulk_create([
                OrderItem(
                    order=order,
                    product=products[item["product_id"]],
                    product_name=products[item["product_id"]].name,
                    price=products[item["product_id"]].price,
                    quantity=item["quantity"],
                ) for item in items_data
            ])
        return order
