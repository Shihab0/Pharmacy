import { Product } from '../types';

export function isOutOfStock(product: Product): boolean {
  return product.stock <= 0;
}

export function isLowStock(product: Product): boolean {
  return product.stock > 0 && product.stock <= product.minStockAlert;
}

export function isExpiringSoon(expiryDateStr: string, daysThreshold = 60): boolean {
  if (!expiryDateStr) return false;
  const today = new Date();
  const expiry = new Date(expiryDateStr);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= daysThreshold;
}
