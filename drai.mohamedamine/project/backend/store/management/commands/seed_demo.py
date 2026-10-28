from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from store.models import Product


PRODUCTS = [
    ("Внешний аккумулятор 10000 mAh, белый", "power", "Внешние аккумуляторы", "white", "Белый", 2990, 4.7, True, False),
    ("Внешний аккумулятор 10000 mAh, черный", "power", "Внешние аккумуляторы", "black", "Черный", 2990, 4.8, False, True),
    ("Bluetooth-гарнитура с микрофоном, черная", "headphones", "Наушники и гарнитуры", "black", "Черный", 7990, 4.9, False, True),
    ("Bluetooth-гарнитура с микрофоном, серая", "headphones", "Наушники и гарнитуры", "gray", "Серый", 7990, 4.6, True, False),
    ("Портативная беспроводная акустика с RGB-подсветкой", "speakers", "Портативная акустика", "black", "Черный", 5490, 4.5, True, True),
    ("Смартфон Samsung Galaxy A55 5G 256 ГБ, фиолетовый", "smartphones", "Смартфоны", "purple", "Фиолетовый", 43999, 4.9, True, True),
    ("Смартфон Samsung Galaxy A55 5G 256 ГБ, черный", "smartphones", "Смартфоны", "black", "Черный", 43999, 4.8, False, True),
    ("Смартфон Samsung Galaxy A55 5G 256 ГБ, белый", "smartphones", "Смартфоны", "white", "Белый", 44999, 4.8, True, False),
    ("Часы с GPS-трекером Geozon Active, черные", "watches", "Умные часы", "black", "Черный", 2490, 4.4, False, True),
    ("Часы с GPS-трекером Geozon Active, синие", "watches", "Умные часы", "blue", "Синий", 2490, 4.5, True, False),
    ("Фитнес-браслет HUAWEI Band 8 ASK-B19, зеленый", "fitness", "Фитнес-браслеты", "green", "Зеленый", 2299, 4.7, True, False),
    ("Фитнес-браслет HUAWEI Band 8 ASK-B19, черный", "fitness", "Фитнес-браслеты", "black", "Черный", 2299, 4.8, False, True),
    ("Наушники True Wireless HUAWEI FreeBuds SE 2, белые", "headphones", "Наушники и гарнитуры", "white", "Белый", 3490, 4.8, True, True),
    ("Наушники True Wireless HUAWEI FreeBuds SE 2, синие", "headphones", "Наушники и гарнитуры", "blue", "Голубой", 3490, 4.7, True, False),
    ("Наушники True Wireless HUAWEI FreeBuds SE 2, черные", "headphones", "Наушники и гарнитуры", "black", "Черный", 3490, 4.8, False, True),
    ("Видеокамера для блогера DJI Action 2 Dual-Screen Combo", "cameras", "Экшн-камеры", "gray", "Серый", 31990, 4.9, False, True),
    ("Микрофон Barn&Hollis LM01C с разъемом Type-C", "audio", "Микрофоны", "black", "Черный", 4590, 4.5, True, False),
    ("Чехол-подвеска Red Line для AirTag, красный", "accessories", "Аксессуары", "red", "Красный", 990, 4.3, False, False),
    ("Чехол-подвеска Red Line для AirTag, белый", "accessories", "Аксессуары", "white", "Белый", 990, 4.4, True, False),
    ("Чехол-подвеска Red Line для AirTag, серый", "accessories", "Аксессуары", "gray", "Серый", 990, 4.6, False, True),
    ("Чехол-подвеска Red Line для AirTag, желтый", "accessories", "Аксессуары", "yellow", "Желтый", 990, 4.5, True, False),
    ("Портативная акустика с карабином, серая", "speakers", "Портативная акустика", "gray", "Серый", 3990, 4.4, False, False),
    ("Портативная акустика в форме самолета, голубая", "speakers", "Портативная акустика", "blue", "Голубой", 4290, 4.6, True, True),
    ("Портативная акустика в форме панды, бежевая", "speakers", "Портативная акустика", "beige", "Бежевый", 4290, 4.7, False, True),
    ("Умная лампа Rubetek RL-3105 с RGB-подсветкой", "smart-home", "Умный дом", "white", "Белый", 1890, 4.6, True, False),
    ("Аппаратный ключ аутентификации Yubico YubiKey 5 NFC", "security", "Цифровая безопасность", "black", "Черный", 10590, 5.0, False, True),
    ("Аппаратный криптокошелек SafePal S1 Pro", "security", "Цифровая безопасность", "black", "Черный", 8990, 4.8, True, True),
    ("Очки виртуальной реальности Luazon Home VR 2", "vr", "Виртуальная реальность", "white", "Белый", 2490, 4.1, False, False),
    ("Шлем виртуальной реальности Oculus Quest 2 128 ГБ", "vr", "Виртуальная реальность", "white", "Белый", 49990, 4.9, False, True),
    ("Умный чемодан-скутер Airwheel SE3, серый", "transport", "Электротранспорт", "gray", "Серый", 89990, 4.7, True, True),
    ("Умный чемодан-скутер Airwheel SE3, черный", "transport", "Электротранспорт", "black", "Черный", 89990, 4.8, True, False),
    ("Дыхательный тренажер O2in Pro Violet", "health", "Спорт и здоровье", "purple", "Фиолетовый", 5990, 4.5, False, True),
]

CATEGORY_SPECS = {
    "power": {"Емкость": "10000 мА·ч", "Разъемы": "USB-A, USB-C", "Гарантия": "1 год"},
    "headphones": {"Подключение": "Bluetooth 5.3", "Работа без подзарядки": "до 40 часов", "Гарантия": "1 год"},
    "speakers": {"Подключение": "Bluetooth 5.0", "Питание": "Аккумулятор, USB-C", "Гарантия": "1 год"},
    "smartphones": {"Экран": "6,6″ Super AMOLED, 120 Гц", "Память": "8/256 ГБ", "Гарантия": "1 год"},
    "watches": {"Экран": "1,4″ IPS", "Защита": "IP67", "Гарантия": "1 год"},
    "fitness": {"Экран": "1,47″ AMOLED", "Работа без подзарядки": "до 14 дней", "Гарантия": "1 год"},
    "cameras": {"Видео": "4K/120 fps", "Стабилизация": "RockSteady 2.0", "Гарантия": "1 год"},
    "audio": {"Подключение": "USB Type-C", "Тип": "Конденсаторный", "Гарантия": "1 год"},
    "accessories": {"Материал": "Силикон", "Крепление": "Карабин", "Гарантия": "6 месяцев"},
    "smart-home": {"Цветовая температура": "2700–6500 К", "Управление": "Wi-Fi, приложение", "Гарантия": "1 год"},
    "security": {"Интерфейсы": "USB-A, NFC", "Защита": "Влагозащита IP68", "Гарантия": "1 год"},
    "vr": {"Управление": "Bluetooth-контроллеры", "Подключение": "Wi-Fi, USB-C", "Гарантия": "1 год"},
    "transport": {"Скорость": "до 10 км/ч", "Запас хода": "до 15 км", "Гарантия": "1 год"},
    "health": {"Материал": "ABS-пластик, силикон", "Режимы": "3 уровня нагрузки", "Гарантия": "1 год"},
}


class Command(BaseCommand):
    help = "Creates the demo user and seeds the complete Gadget Hub catalog"

    def handle(self, *args, **options):
        user, created = User.objects.get_or_create(username="demo", defaults={"email": "demo@gadget-hub.ru"})
        user.set_password("gadget2024")
        user.is_active = True
        user.save()

        for product_id, row in enumerate(PRODUCTS, start=1):
            name, category, category_display, color, color_display, price, rating, is_new, is_hit = row
            Product.objects.update_or_create(
                id=product_id,
                defaults={
                    "name": name,
                    "description": f"{name}. Надежное устройство для повседневных задач с официальной гарантией. В комплекте — все необходимое для быстрого старта.",
                    "category": category,
                    "category_display": category_display,
                    "color": color,
                    "color_display": color_display,
                    "price": price,
                    "rating": rating,
                    "image": f"/images/goods/image_{product_id}.png",
                    "is_new": is_new,
                    "is_hit": is_hit,
                    "specs": CATEGORY_SPECS[category],
                },
            )
        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(PRODUCTS)} products. Login: demo / gadget2024 ({'created' if created else 'updated'})"
        ))
