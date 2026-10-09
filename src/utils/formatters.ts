import { APP_CONFIG } from '@/config/constants';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // You can change this to IDR or parameterize it
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace('$', APP_CONFIG.CURRENCY_SYMBOL);
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
