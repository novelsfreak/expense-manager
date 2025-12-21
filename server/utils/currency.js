// Currency conversion utilities
// Default INR to AUD conversion rate (can be updated via API or env variable)
const INR_TO_AUD_RATE = process.env.INR_TO_AUD_RATE || 0.018; // ~55 INR = 1 AUD

export const convertToAUD = (amount, fromCurrency) => {
  if (fromCurrency === 'AUD') {
    return amount;
  }
  if (fromCurrency === 'USD') {
    return amount; // 1:1 conversion USD to AUD during migration
  }
  if (fromCurrency === 'INR') {
    return amount * INR_TO_AUD_RATE;
  }
  return amount;
};

export const convertFromAUD = (amount, toCurrency) => {
  if (toCurrency === 'AUD') {
    return amount;
  }
  if (toCurrency === 'INR') {
    return amount / INR_TO_AUD_RATE;
  }
  return amount;
};

export const getConversionRate = (fromCurrency, toCurrency = 'AUD') => {
  if (fromCurrency === toCurrency) return 1;
  if (fromCurrency === 'INR' && toCurrency === 'AUD') return INR_TO_AUD_RATE;
  if (fromCurrency === 'AUD' && toCurrency === 'INR') return 1 / INR_TO_AUD_RATE;
  return 1;
};

