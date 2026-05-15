export function formatCurrency(money) {
  const n = Number(money);
  if (money == null || isNaN(n)) return null;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(n);
}
