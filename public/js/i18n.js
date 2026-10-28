// public/js/i18n.js

let translations = {};
let currentLang = 'en';

export async function initI18n() {
  try {
    const response = await fetch('./data/translations.json');
    translations = await response.json();
    
    // Load saved language or default to 'en'
    currentLang = localStorage.getItem('velo_lang') || 'en';
    applyLanguage(currentLang);
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
}

export function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('velo_lang', lang);
  applyLanguage(lang);
}

function applyLanguage(lang) {
  // 1. Update HTML attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // 2. Update all text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // 3. Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // 4. Update select dropdown value
  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = lang;

  // 5. Dispatch event for other modules to react (e.g., re-rendering cards)
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

export function t(key) {
  return translations[currentLang]?.[key] || key;
}

export function getCurrentLang() {
  return currentLang;
}