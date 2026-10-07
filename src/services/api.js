/**
 * API Service Client — Connects Frontend to Node.js / Express Backend API
 * Supports seamless failover to LocalStorage when backend API is offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('cabbage_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const apiService = {
  // Check backend server health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) return await res.json();
      return null;
    } catch {
      return null;
    }
  },

  // Auth: Register
  register: async (name, email, password, organizationName) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, organizationName: organizationName || `${name}'s Workspace` })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Auth: Login
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Campaigns: Get list
  getCampaigns: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/campaigns`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
      return null;
    } catch {
      return null;
    }
  },

  // Campaigns: Send
  sendCampaign: async (campaignData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(campaignData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch campaign');
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Subscribers: Get list
  getSubscribers: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/subscribers`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
      return null;
    } catch {
      return null;
    }
  },

  // Subscribers: Create
  createSubscriber: async (subscriberData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/subscribers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(subscriberData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add subscriber');
      return data;
    } catch (err) {
      throw err;
    }
  }
};
