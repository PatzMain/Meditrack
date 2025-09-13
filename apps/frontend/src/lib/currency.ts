// Currency formatting utilities for Philippine Peso

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 1000000) {
    return `₱${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `₱${(amount / 1000).toFixed(1)}K`;
  } else {
    return formatCurrency(amount);
  }
};

// Convert USD to PHP (approximate rate)
export const convertUSDToPHP = (usdAmount: number): number => {
  const exchangeRate = 56.50; // Approximate USD to PHP rate
  return usdAmount * exchangeRate;
};

export const getCurrencySymbol = (): string => {
  return '₱';
};