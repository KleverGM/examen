from django.contrib import admin
from .models import Table, Order

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'capacity', 'is_available', 'created_at']
    list_filter = ['is_available', 'created_at']
    search_fields = ['name']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'table_id', 'total', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['table_id__name', 'items_summary']
    readonly_fields = ['created_at']
