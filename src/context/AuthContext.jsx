import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS, initStorage } from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [activeClient, setActiveClient] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    initStorage();
    const savedUser = getStorageItem(STORAGE_KEYS.ACTIVE_USER, null);
    if (savedUser) {
      setUser(savedUser);
      loadUserData(savedUser.id);
    } else {
      setUser(null);
    }
  }, []);

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

  const signUp = (fullName, email, password, orgName) => {
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
    localStorage.setItem('cabbage_auth_token', `token_${newUser.id}_${Date.now()}`);

    setUser(newUser);
    setClients([newClient]);
    setActiveClient(newClient);
    return newUser;
  };

  const signIn = (email, password) => {
    const allUsers = getStorageItem(STORAGE_KEYS.USERS, []);
    const foundUser = allUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password.');
    }

    setStorageItem(STORAGE_KEYS.ACTIVE_USER, foundUser);
    localStorage.setItem('cabbage_auth_token', `token_${foundUser.id}_${Date.now()}`);
    setUser(foundUser);
    loadUserData(foundUser.id);
    return foundUser;
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    localStorage.removeItem('cabbage_auth_token');
    setUser(null);
    setActiveClient(null);
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
      awsTopicArn: clientData.awsTopicArn || `arn:aws:sns:us-east-1:123456789012:${clientData.name.replace(/[^a-zA-Z0-9]/g, '')}Topic`,
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
      tags: subscriberData.tags ? subscriberData.tags.split(',').map(t => t.trim()) : ['General'],
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
      awsMessageId: campaignData.awsMessageId || `sns-msg-${Date.now()}`,
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
        subscribers: subscribers.filter(s => activeClient && s.clientId === activeClient.id),
        campaigns: campaigns.filter(c => activeClient && c.clientId === activeClient.id),
        signUp,
        signIn,
        signOut,
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
