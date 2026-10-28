// public/js/db.js

export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VeloAWSDatabase', 1);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Create object store for caching prices if needed in the future
      if (!db.objectStoreNames.contains('pricesCache')) {
        db.createObjectStore('pricesCache', { keyPath: 'id' });
      }
    };
  });
}