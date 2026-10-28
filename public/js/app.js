// public/js/app.js

import { initI18n, setLanguage, t } from './i18n.js';
import { initCurrency, setCurrency } from './currency.js';
import { initDB } from './db.js';
import { initUI, setServices, generatePrintLayout } from './ui.js';
import { initShortcuts } from './shortcuts.js';
import { loadEstimate, clearEstimate, generateShareUrl, loadFromShareUrl } from './storage.js';

let appData = { services: null, prices: null, regions: null };
let currentServices = [];

async function boot() {
  try {
    await initDB();
    initShortcuts();

    const [servicesRes, pricesRes, regionsRes] = await Promise.all([
      fetch('./data/services.json'),
      fetch('./data/prices.json'),
      fetch('./data/regions.json')
    ]);

    if (!servicesRes.ok || !pricesRes.ok || !regionsRes.ok) {
      throw new Error('Failed to fetch data');
    }

    appData.services = await servicesRes.json();
    appData.prices = await pricesRes.json();
    appData.regions = await regionsRes.json();

    await initI18n();
    await initCurrency();

    const sharedState = loadFromShareUrl();
    if (sharedState) {
      currentServices = sharedState;
      await initI18n();
      await initCurrency();
    } else {
      currentServices = loadEstimate();
    }

    initUI(appData);
    setServices(currentServices);

    document.getElementById('year').textContent = new Date().getFullYear();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW failed', err));
    }

  } catch (error) {
    console.error('Boot error:', error);
    alert('Failed to load application data. Ensure you are running this via a local server (e.g., npx serve public).');
  }
}

function setupListeners() {
  document.getElementById('langSelect')?.addEventListener('change', (e) => setLanguage(e.target.value));
  document.getElementById('currencySelect')?.addEventListener('change', (e) => setCurrency(e.target.value));

  const showToast = (msg) => {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  // --- SHARE ---
  const handleShare = () => {
    if (currentServices.length === 0) {
      showToast('Add services first to share.');
      return;
    }
    const url = generateShareUrl(currentServices);
    navigator.clipboard.writeText(url).then(() => {
      showToast(t('shared') || 'Link copied to clipboard!');
    }).catch(() => {
      const tempInput = document.createElement('input');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('Link copied!');
    });
  };
  
  document.getElementById('shareBtnHeader')?.addEventListener('click', handleShare);

  // --- PRINT ---
  const handlePrint = () => {
    if (currentServices.length === 0) {
      showToast('Add services first to print.');
      return;
    }
    
    const shareUrl = generateShareUrl(currentServices);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}`;
    
    generatePrintLayout(qrApiUrl);
    
    setTimeout(() => {
      window.print();
    }, 500); 
  };

  document.getElementById('printBtnHeader')?.addEventListener('click', handlePrint);

  // --- SHORTCUT MODAL TOGGLE ---
  document.getElementById('shortcutsBtn')?.addEventListener('click', () => {
    document.getElementById('shortcutsModal').hidden = false;
  });

  // --- RESET ---
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    if (confirm(t('confirmReset') || 'Are you sure you want to reset?')) {
      clearEstimate();
      setServices([]);
      showToast('Estimate reset.');
    }
  });

  // --- SIDEBAR FILTER ---
  const sidebarSearch = document.getElementById('sidebarSearch');
  sidebarSearch?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.service-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'grid' : 'none';
    });
  });

  // --- MOBILE DRAWER ---
  const drawerToggle = document.getElementById('drawerToggle');
  const sidebar = document.getElementById('sidebar');
  
  drawerToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.getElementById('workspace')?.addEventListener('click', () => {
    if (window.innerWidth < 1200) {
      sidebar.classList.remove('open');
    }
  });
}

// WAIT FOR DOM TO LOAD
document.addEventListener('DOMContentLoaded', () => {
  boot();
  setupListeners();
});