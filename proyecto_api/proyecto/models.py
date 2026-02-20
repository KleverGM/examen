from django.db import models

class Table(models.Model):
    name = models.CharField(max_length=120, unique=True)
    capacity = models.IntegerField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name 
    
class Status(models.TextChoices):
    PENDING = "Pending", "pending"
    IN_PROGRESS = "In_process", "in_process"
    SERVED = "Served", "served"
    PAID = "Paid", "paid"

class Order(models.Model):
    table_id = models.ForeignKey(Table, on_delete=models.PROTECT, related_name="orders")
    items_summary = models.TextField(blank=True, default="")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.table_id.name} {self.items_summary} ({self.status})"


