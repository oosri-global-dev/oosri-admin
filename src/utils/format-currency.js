export function formatCurrency(money, currencyCode = 'NGN') {
  const n = Number(money);
  if (money == null || isNaN(n)) return null;
  const isUSD = currencyCode === 'USD';
  return new Intl.NumberFormat(isUSD ? 'en-US' : 'en-NG', {
    style: 'currency',
    currency: isUSD ? 'USD' : 'NGN',
    minimumFractionDigits: 2,
  }).format(n);
}
