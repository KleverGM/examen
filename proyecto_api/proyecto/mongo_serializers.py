from rest_framework import serializers
from django.utils import timezone

class MenuTypeSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    category = serializers.CharField(required=False)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    is_available = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(default=timezone.now, required=False)

class EventType:
    CREATED = "Created"
    SENT_TO_KITCHEN = "Sent_To_Kitchen"
    SERVED = "Served"
    PAID = "Paid"
    CANCELLED = "Cancelled"
    
    CHOICES = [
        (CREATED, "created"),
        (SENT_TO_KITCHEN, "sent_to_kitchen"),
        (SERVED, "served"),
        (PAID, "paid"),
        (CANCELLED, "cancelled"),
    ]

class Source:
    WEB = "Web"
    MOBILE = "Mobile"
    SYSTEM = "System"
    choices = [
        (WEB, WEB),
        (MOBILE, MOBILE),
        (SYSTEM, SYSTEM),
    ]

class OrderEventSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    event_type = serializers.ChoiceField(choices=EventType.CHOICES, default=EventType.CREATED)
    source = serializers.ChoiceField(choices=Source.choices, default=Source.WEB)
    note = serializers.CharField(max_length=120, required=False)
    created_at = serializers.DateTimeField(default=timezone.now, required=False)
