// public/js/currency.js

let ratesData = {};
let currentCurrency = 'USD';

export async function initCurrency() {
  try {
    const response = await fetch('./data/rates.json');
    ratesData = await response.json();
    
    // Load saved currency or default to 'USD'
    currentCurrency = localStorage.getItem('velo_currency') || 'USD';
    applyCurrency(currentCurrency);
  } catch (error) {
    console.error('Failed to load rates:', error);
  }
}

export function setCurrency(currency) {
  if (!ratesData.rates || !ratesData.rates[currency]) return;
  currentCurrency = currency;
  localStorage.setItem('velo_currency', currency);
  applyCurrency(currency);
}

function applyCurrency(currency) {
  // Update select dropdown value
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) currencySelect.value = currency;

  // Update rate note
  const rateNote = document.getElementById('rateNote');
  if (rateNote) {
    const dateStr = ratesData.updated;
    // We use a custom event or simple text here since i18n is loaded separately
    const noteText = document.documentElement.lang === 'ar' 
      ? `تم تحويل الأسعار من الدولار الأمريكي. تم تحديث الأسعار في ${dateStr}`
      : `Prices converted from USD. Rates updated ${dateStr}.`;
    rateNote.textContent = noteText;
  }

  // Dispatch event for other modules to react (e.g., recalculate totals)
  window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency } }));
}

export function formatPrice(usdAmount) {
  const rate = ratesData.rates?.[currentCurrency] || 1;
  const converted = usdAmount * rate;
  
  const locale = currentCurrency === 'GBP' ? 'en-GB' : currentCurrency === 'EUR' ? 'de-DE' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currentCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(converted);
}

export function getCurrencySymbol() {
  const symbols = { USD: '$', GBP: '£', EUR: '€' };
  return symbols[currentCurrency] || '$';
}