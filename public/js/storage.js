// public/js/storage.js

const STORAGE_KEY = 'velo_estimate_state';

export function saveEstimate(services) {
  try {
    const state = {
      services: services,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Failed to save estimate:', error);
    return false;
  }
}

export function loadEstimate() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const state = JSON.parse(saved);
    return state.services || [];
  } catch (error) {
    console.error('Failed to load estimate:', error);
    return [];
  }
}

export function clearEstimate() {
  localStorage.removeItem(STORAGE_KEY);
}

// Shareable URL Logic
export function generateShareUrl(services) {
  const state = {
    s: services, // short key to keep URL smaller
    l: localStorage.getItem('velo_lang') || 'en',
    c: localStorage.getItem('velo_currency') || 'USD'
  };
  
  // Encode to Base64 to keep it clean
  const encoded = btoa(JSON.stringify(state));
  return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
}

export function loadFromShareUrl() {
  const params = new URLSearchParams(window.location.search);
  const shareData = params.get('share');
  
  if (!shareData) return null;

  try {
    const decoded = JSON.parse(atob(shareData));
    
    // Restore Language and Currency
    if (decoded.l) localStorage.setItem('velo_lang', decoded.l);
    if (decoded.c) localStorage.setItem('velo_currency', decoded.c);
    
    // Clean URL after reading
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return decoded.s || [];
  } catch (e) {
    console.error('Invalid share URL', e);
    return null;
  }
}