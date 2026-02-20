from rest_framework import serializers
from .models import Table, Order

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ["id", "name", "capacity", "is_available", "created_at"]

class OrderSerializer(serializers.ModelSerializer):
    table_id_name = serializers.CharField(source="table_id.name", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "table_id", "table_id_name", "items_summary", "total", "status", "created_at"]