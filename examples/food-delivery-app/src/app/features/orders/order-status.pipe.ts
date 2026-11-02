import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../../core/models/models';

const LABELS: Record<OrderStatus, string> = {
  PLACED: '📝 Order placed',
  ACCEPTED: '✅ Restaurant accepted',
  PREPARING: '👩‍🍳 Preparing your food',
  OUT_FOR_DELIVERY: '🛵 Out for delivery',
  DELIVERED: '🎉 Delivered',
  CANCELLED: '❌ Cancelled',
};

@Pipe({ name: 'orderStatus' })
export class OrderStatusPipe implements PipeTransform {
  transform(status: OrderStatus): string {
    return LABELS[status] ?? status;
  }
}
