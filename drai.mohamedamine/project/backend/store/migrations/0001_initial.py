from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField()),
                ("category", models.SlugField(max_length=64)),
                ("category_display", models.CharField(max_length=100)),
                ("color", models.SlugField(max_length=32)),
                ("color_display", models.CharField(max_length=50)),
                ("price", models.DecimalField(decimal_places=2, max_digits=12)),
                ("rating", models.DecimalField(decimal_places=1, max_digits=2)),
                ("image", models.CharField(max_length=255)),
                ("is_new", models.BooleanField(default=False)),
                ("is_hit", models.BooleanField(default=False)),
                ("specs", models.JSONField(default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-is_new", "-id"]},
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("phone", models.CharField(max_length=32)),
                ("fulfillment", models.CharField(choices=[("pickup", "Самовывоз"), ("delivery", "Доставка")], max_length=16)),
                ("address", models.CharField(blank=True, max_length=255)),
                ("payment", models.CharField(choices=[("card", "По карте"), ("cash", "Наличными")], max_length=16)),
                ("gift_wrap", models.BooleanField(default=False)),
                ("total", models.DecimalField(decimal_places=2, max_digits=12)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="orders", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("product_name", models.CharField(max_length=255)),
                ("price", models.DecimalField(decimal_places=2, max_digits=12)),
                ("quantity", models.PositiveIntegerField()),
                ("order", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="store.order")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="order_items", to="store.product")),
            ],
        ),
    ]
