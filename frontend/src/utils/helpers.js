function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(Number(value || 0));
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : '-';
}

export { formatCurrency, formatDate };
