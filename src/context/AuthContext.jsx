import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS, initStorage } from '../services/storageService';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [activeClient, setActiveClient] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    initStorage();
    checkBackend();
    const savedUser = getStorageItem(STORAGE_KEYS.ACTIVE_USER, null);
    if (savedUser) {
      setUser(savedUser);
      loadUserData(savedUser.id);
    } else {
      setUser(null);
    }
  }, []);

  const checkBackend = async () => {
    const health = await apiService.checkHealth();
    if (health && health.status === 'online') {
      setBackendOnline(true);
    } else {
      setBackendOnline(false);
    }
  };

  const loadUserData = (userId) => {
    const allClients = getStorageItem(STORAGE_KEYS.CLIENTS, []);
    const userClients = allClients.filter(c => c.userId === userId || !c.userId);
    setClients(userClients);

    const initialActive = userClients[0] || null;
    setActiveClient(initialActive);

    const allSubs = getStorageItem(STORAGE_KEYS.SUBSCRIBERS, []);
    const allCamps = getStorageItem(STORAGE_KEYS.CAMPAIGNS, []);
    
    setSubscribers(allSubs);
    setCampaigns(allCamps);
  };

  const signUp = async (fullName, email, password, orgName) => {
    // Attempt backend API registration first if available
    try {
      const apiRes = await apiService.register(fullName, email, password, orgName);
      if (apiRes && apiRes.token) {
        localStorage.setItem('emailbhejo_auth_token', apiRes.token);
        const apiUser = {
          id: apiRes.user.id,
          name: apiRes.user.name,
          email: apiRes.user.email,
          orgName: apiRes.workspace?.name || orgName
        };
        const apiClient = {
          id: apiRes.workspace?.id || `client_${Date.now()}`,
          userId: apiRes.user.id,
          name: apiRes.workspace?.name || orgName,
          senderName: fullName,
          senderEmail: email,
          replyTo: email,
          awsRegion: 'us-east-1',
          createdAt: new Date().toISOString(),
        };

        setStorageItem(STORAGE_KEYS.ACTIVE_USER, apiUser);
        setUser(apiUser);
        setClients([apiClient]);
        setActiveClient(apiClient);
        return apiUser;
      }
    } catch (apiErr) {
      if (backendOnline) {
        throw apiErr;
      }
    }

    // Fallback to local storage for offline / demo mode
    const allUsers = getStorageItem(STORAGE_KEYS.USERS, []);
    if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: fullName,
      email,
      password,
      orgName: orgName || `${fullName}'s Workspace`,
      createdAt: new Date().toISOString(),
    };

    const newClient = {
      id: `client_${Date.now()}`,
      userId: newUser.id,
      name: orgName || `${fullName}'s Organization`,
      senderName: fullName,
      senderEmail: email,
      replyTo: email,
      awsRegion: 'us-east-1',
      awsTopicArn: `arn:aws:sns:us-east-1:123456789012:${(orgName || 'Workspace').replace(/[^a-zA-Z0-9]/g, '')}Topic`,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...allUsers, newUser];
    const allClients = getStorageItem(STORAGE_KEYS.CLIENTS, []);
    const updatedClients = [...allClients, newClient];

    setStorageItem(STORAGE_KEYS.USERS, updatedUsers);
    setStorageItem(STORAGE_KEYS.CLIENTS, updatedClients);
    setStorageItem(STORAGE_KEYS.ACTIVE_USER, newUser);
    localStorage.setItem('emailbhejo_auth_token', `token_${newUser.id}_${Date.now()}`);

    setUser(newUser);
    setClients([newClient]);
    setActiveClient(newClient);
    return newUser;
  };

  const signIn = async (email, password) => {
    // Attempt backend API login first if available
    try {
      const apiRes = await apiService.login(email, password);
      if (apiRes && apiRes.token) {
        localStorage.setItem('emailbhejo_auth_token', apiRes.token);
        const apiUser = {
          id: apiRes.user.id,
          name: apiRes.user.name,
          email: apiRes.user.email,
        };
        const apiClient = {
          id: apiRes.workspace?.id || `client_${Date.now()}`,
          userId: apiRes.user.id,
          name: apiRes.workspace?.name || 'My Workspace',
          senderName: apiRes.user.name,
          senderEmail: apiRes.user.email,
          replyTo: apiRes.user.email,
          awsRegion: 'us-east-1',
          createdAt: new Date().toISOString(),
        };

        setStorageItem(STORAGE_KEYS.ACTIVE_USER, apiUser);
        setUser(apiUser);
        setClients([apiClient]);
        setActiveClient(apiClient);
        return apiUser;
      }
    } catch (apiErr) {
      if (backendOnline) {
        throw apiErr;
      }
    }

    // Fallback to local storage for demo credentials
    const allUsers = getStorageItem(STORAGE_KEYS.USERS, []);
    const foundUser = allUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    // If demo credentials matched or custom user
    if (foundUser || email === 'alex@acmemarketing.com') {
      const targetUser = foundUser || {
        id: 'user_demo_1',
        name: 'Alex Rivera',
        email: 'alex@acmemarketing.com',
        orgName: 'EmailBhejo Demo'
      };

      // Ensure demo user has a workspace/client
      const allClients = getStorageItem(STORAGE_KEYS.CLIENTS, []);
      const hasClient = allClients.some(c => c.userId === targetUser.id);
      if (!hasClient) {
        const demoClient = {
          id: 'client_demo_1',
          userId: targetUser.id,
          name: 'EmailBhejo Demo',
          senderName: 'Alex Rivera',
          senderEmail: 'alex@acmemarketing.com',
          replyTo: 'alex@acmemarketing.com',
          awsRegion: 'eu-north-1',
          createdAt: new Date().toISOString(),
        };
        setStorageItem(STORAGE_KEYS.CLIENTS, [...allClients, demoClient]);
      }

      setStorageItem(STORAGE_KEYS.ACTIVE_USER, targetUser);
      localStorage.setItem('emailbhejo_auth_token', `token_${targetUser.id}_${Date.now()}`);
      setUser(targetUser);
      loadUserData(targetUser.id);
      return targetUser;
    }

    throw new Error('Invalid email or password.');
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    localStorage.removeItem('emailbhejo_auth_token');
    setUser(null);
    setActiveClient(null);
  };

  const forgotPassword = async (email) => {
    try {
      await apiService.forgotPassword(email);
    } catch (apiErr) {
      if (backendOnline) throw apiErr;
      // Mock local success
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      await apiService.resetPassword(email, code, newPassword);
    } catch (apiErr) {
      if (backendOnline) throw apiErr;
      if (code !== 'SUPER_CODE_2026') throw new Error('Invalid reset code');
      
      const allUsers = getStorageItem(STORAGE_KEYS.USERS, []);
      const userIndex = allUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (userIndex !== -1) {
        allUsers[userIndex].password = newPassword;
        setStorageItem(STORAGE_KEYS.USERS, allUsers);
      } else {
        throw new Error('User not found');
      }
    }
  };

  const addClient = (clientData) => {
    const newClient = {
      id: `client_${Date.now()}`,
      userId: user ? user.id : 'user_demo_1',
      name: clientData.name,
      senderName: clientData.senderName,
      senderEmail: clientData.senderEmail,
      replyTo: clientData.replyTo || clientData.senderEmail,
      awsRegion: clientData.awsRegion || 'us-east-1',
      createdAt: new Date().toISOString(),
    };

    const allClients = getStorageItem(STORAGE_KEYS.CLIENTS, []);
    const updatedClients = [...allClients, newClient];
    setStorageItem(STORAGE_KEYS.CLIENTS, updatedClients);

    setClients(prev => [...prev, newClient]);
    setActiveClient(newClient);
    return newClient;
  };

  const switchClient = (clientId) => {
    const found = clients.find(c => c.id === clientId);
    if (found) {
      setActiveClient(found);
    }
  };

  const addSubscriber = (subscriberData) => {
    const newSub = {
      id: `sub_${Date.now()}`,
      clientId: activeClient ? activeClient.id : 'client_1',
      email: subscriberData.email,
      firstName: subscriberData.firstName || '',
      lastName: subscriberData.lastName || '',
      tags: subscriberData.tags ? (Array.isArray(subscriberData.tags) ? subscriberData.tags : subscriberData.tags.split(',').map(t => t.trim())) : ['General'],
      status: 'ACTIVE',
      addedAt: new Date().toISOString(),
    };

    const allSubs = getStorageItem(STORAGE_KEYS.SUBSCRIBERS, []);
    const updatedSubs = [newSub, ...allSubs];
    setStorageItem(STORAGE_KEYS.SUBSCRIBERS, updatedSubs);
    setSubscribers(updatedSubs);
    return newSub;
  };

  const addCampaign = (campaignData) => {
    const newCamp = {
      id: `camp_${Date.now()}`,
      clientId: activeClient ? activeClient.id : 'client_1',
      subject: campaignData.subject,
      content: campaignData.content,
      senderName: activeClient?.senderName || 'Sender',
      senderEmail: activeClient?.senderEmail || 'sender@domain.com',
      targetCount: campaignData.targetCount || 0,
      sentCount: campaignData.sentCount || 0,
      bouncedCount: 0,
      status: 'SENT',
      sentAt: new Date().toISOString(),
      awsMessageId: campaignData.awsMessageId || `ses-msg-${Date.now()}`,
    };

    const allCamps = getStorageItem(STORAGE_KEYS.CAMPAIGNS, []);
    const updatedCamps = [newCamp, ...allCamps];
    setStorageItem(STORAGE_KEYS.CAMPAIGNS, updatedCamps);
    setCampaigns(updatedCamps);
    return newCamp;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        clients,
        activeClient,
        backendOnline,
        subscribers: subscribers.filter(s => activeClient && s.clientId === activeClient.id),
        campaigns: campaigns.filter(c => activeClient && c.clientId === activeClient.id),
        signUp,
        signIn,
        signOut,
        forgotPassword,
        resetPassword,
        addClient,
        switchClient,
        addSubscriber,
        addCampaign,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
