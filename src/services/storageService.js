// Initial Mock Storage & State Management for The Cabbage Mail
const STORAGE_KEYS = {
  USERS: 'cabbage_mail_users',
  ACTIVE_USER: 'cabbage_mail_active_user',
  CLIENTS: 'cabbage_mail_clients',
  SUBSCRIBERS: 'cabbage_mail_subscribers',
  CAMPAIGNS: 'cabbage_mail_campaigns',
};

// Initial Default Demo User & Client Workspace
const DEFAULT_USERS = [
  {
    id: 'user_demo_1',
    name: 'Alex Johnson',
    email: 'alex@acmemarketing.com',
    password: 'password123',
    orgName: 'Acme Growth Labs',
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_CLIENTS = [
  {
    id: 'client_1',
    userId: 'user_demo_1',
    name: 'Acme Growth Labs',
    senderName: 'Alex from Acme',
    senderEmail: 'newsletter@acme.com',
    replyTo: 'support@acme.com',
    awsRegion: 'us-east-1',
    awsTopicArn: 'arn:aws:sns:us-east-1:123456789012:AcmeNewsletterTopic',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'client_2',
    userId: 'user_demo_1',
    name: 'Fresh Greens Apparel',
    senderName: 'Fresh Greens Team',
    senderEmail: 'hello@freshgreens.shop',
    replyTo: 'support@freshgreens.shop',
    awsRegion: 'us-east-1',
    awsTopicArn: 'arn:aws:sns:us-east-1:123456789012:FreshGreensPromos',
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_SUBSCRIBERS = [
  {
    id: 'sub_1',
    clientId: 'client_1',
    email: 'sarah.connor@example.com',
    firstName: 'Sarah',
    lastName: 'Connor',
    tags: ['Vip', 'Weekly'],
    status: 'ACTIVE',
    addedAt: '2026-09-15T10:30:00Z',
  },
  {
    id: 'sub_2',
    clientId: 'client_1',
    email: 'david.beck@example.com',
    firstName: 'David',
    lastName: 'Beck',
    tags: ['Newsletter'],
    status: 'ACTIVE',
    addedAt: '2026-09-18T14:20:00Z',
  },
  {
    id: 'sub_3',
    clientId: 'client_1',
    email: 'elena.rodriguez@example.com',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    tags: ['Lead'],
    status: 'ACTIVE',
    addedAt: '2026-09-20T09:12:00Z',
  },
  {
    id: 'sub_4',
    clientId: 'client_2',
    email: 'mike.ross@lawfirm.com',
    firstName: 'Mike',
    lastName: 'Ross',
    tags: ['Customer'],
    status: 'ACTIVE',
    addedAt: '2026-09-19T11:00:00Z',
  }
];

const DEFAULT_CAMPAIGNS = [
  {
    id: 'camp_1',
    clientId: 'client_1',
    subject: '🚀 Welcome to Acme September Newsletter!',
    content: '<h1>Hello {{first_name}},</h1><p>We are thrilled to welcome you to our official newsletter. Thank you for subscribing!</p><p><a href="{{unsubscribe_link}}">Unsubscribe</a></p>',
    senderName: 'Alex from Acme',
    senderEmail: 'newsletter@acme.com',
    targetCount: 3,
    sentCount: 3,
    bouncedCount: 0,
    status: 'SENT',
    sentAt: '2026-09-21T18:00:00Z',
    awsMessageId: 'sns-msg-99481204812049182'
  }
];

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

export { STORAGE_KEYS };
