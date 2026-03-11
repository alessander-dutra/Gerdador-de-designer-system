import { Template } from '../types';

const DB_NAME = 'DGStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'templates';

// Safe LocalStorage Wrapper
export const saveToStorage = (key: string, data: any) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      console.warn(`⚠️ LocalStorage quota exceeded for ${key}. Data not saved to avoid crash.`);
      // In a real app, you might want to show a toast notification here
    } else {
      console.error(`❌ Error saving ${key}:`, error);
    }
  }
};

export const base64ToBlob = (base64: string): Blob => {
  try {
    // Handle raw base64 or data URI
    const content = base64.includes(',') ? base64.split(',')[1] : base64;
    const mimeMatch = base64.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    
    const bstr = atob(content);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error('Error converting base64 to blob', e);
    return new Blob([], { type: 'image/png' });
  }
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveTemplatesToIndexedDB = async (templates: Template[]) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Prepare templates: extract base64 images to Blobs for efficient storage
    // This prevents "QuotaExceededError" in storage logic
    const templatesToSave = templates.map(t => {
      const images = (t.images || []).map(img => {
        // Handle old string format just in case
        if (typeof img === 'string') {
          return { url: img, caption: 'Visão Geral', type: 'mockup' };
        }
        // Only convert Data URLs (base64) to Blobs. Leave remote URLs (http...) alone.
        if (img && img.url && img.url.startsWith('data:')) {
          return { ...img, blob: base64ToBlob(img.url), url: '' }; // Store blob, clear string to save memory
        }
        return img;
      });
      return { ...t, images };
    });

    // Clear existing store to ensure we sync state correctly
    const clearReq = store.clear();
    clearReq.onsuccess = () => {
      templatesToSave.forEach(t => store.put(t));
    };

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => {
        console.log('✅ Templates saved to IndexedDB');
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
  }
};

export const loadTemplatesFromIndexedDB = async (): Promise<Template[]> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    const storedItems = await new Promise<any[]>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    // Reconstruct base64 strings from Blobs so the UI can render them easily
    const templates = await Promise.all(storedItems.map(async (t) => {
      const images = await Promise.all((t.images || []).map(async (img: any) => {
        if (img && typeof img === 'object' && img.blob) {
           const url = await blobToBase64(img.blob);
           const { blob, ...rest } = img;
           return { ...rest, url };
        }
        return img;
      }));
      return { ...t, images };
    }));

    return templates;
  } catch (error) {
    console.error('Error loading from IndexedDB:', error);
    return [];
  }
};