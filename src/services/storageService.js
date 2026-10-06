// Storage & State Management for The Cabbage Mail
const STORAGE_KEYS = {
  USERS: 'cabbage_mail_users',
  ACTIVE_USER: 'cabbage_mail_active_user',
  CLIENTS: 'cabbage_mail_clients',
  SUBSCRIBERS: 'cabbage_mail_subscribers',
  CAMPAIGNS: 'cabbage_mail_campaigns',
};

// Clean Initial State (No hardcoded dummy data)
const DEFAULT_USERS = [];
const DEFAULT_CLIENTS = [];
const DEFAULT_SUBSCRIBERS = [];
const DEFAULT_CAMPAIGNS = [];

export const getStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage:', e);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error setting localStorage:', e);
  }
};

export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setStorageItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
    setStorageItem(STORAGE_KEYS.CLIENTS, DEFAULT_CLIENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) {
    setStorageItem(STORAGE_KEYS.SUBSCRIBERS, DEFAULT_SUBSCRIBERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CAMPAIGNS)) {
    setStorageItem(STORAGE_KEYS.CAMPAIGNS, DEFAULT_CAMPAIGNS);
  }
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  localStorage.removeItem(STORAGE_KEYS.CLIENTS);
  localStorage.removeItem(STORAGE_KEYS.SUBSCRIBERS);
  localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS);
  localStorage.removeItem('cabbage_audit_logs');
  initStorage();
};

export { STORAGE_KEYS };
