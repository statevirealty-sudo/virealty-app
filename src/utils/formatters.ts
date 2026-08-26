export const USD_EXCHANGE_RATE = 4150; // COP per USD

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amountInCOP: number): string {
  const usd = amountInCOP / USD_EXCHANGE_RATE;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(usd);
}

export function formatPrice(amountInCOP: number, currency: 'COP' | 'USD' = 'COP'): string {
  return currency === 'COP' ? formatCOP(amountInCOP) : formatUSD(amountInCOP);
}

export function formatCompactCOP(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B COP`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M COP`;
  }
  return formatCOP(amount);
}

export function formatCompactUSD(amountInCOP: number): string {
  const usd = amountInCOP / USD_EXCHANGE_RATE;
  if (usd >= 1_000_000) {
    return `$${(usd / 1_000_000).toFixed(1)}M USD`;
  }
  if (usd >= 1_000) {
    return `$${(usd / 1_000).toFixed(0)}k USD`;
  }
  return formatUSD(amountInCOP);
}

export function formatArea(m2: number): string {
  return `${m2} m²`;
}
