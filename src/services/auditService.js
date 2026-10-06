/**
 * Audit Service — System event logger for compliance and tracking
 * Logs security, campaign, domain, team, api, and billing events to localStorage
 */

const AUDIT_STORAGE_KEY = 'cabbage_audit_logs';

const INITIAL_AUDIT_LOGS = [];

export const auditService = {
  getLogs: () => {
    try {
      const data = localStorage.getItem(AUDIT_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  logEvent: (action, category, details, actor = 'Alex Rivera (alex@acme.com)', status = 'success') => {
    const logs = auditService.getLogs();
    const newLog = {
      id: 'evt_' + Date.now(),
      timestamp: new Date().toISOString(),
      actor,
      action,
      category,
      details,
      status,
      ip: '192.168.1.45'
    };
    const updated = [newLog, ...logs];
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save audit log', e);
    }
    return newLog;
  },

  clearLogs: () => {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
  }
};
