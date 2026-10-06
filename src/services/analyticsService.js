/**
 * Analytics Service — Simulated analytics data generator
 * Generates realistic campaign performance metrics for the dashboard.
 */

// Generate random data within a range
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate time series data for the past N days
export const generateTimeSeries = (days = 30) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      emailsSent: rand(80, 420),
      opens: rand(40, 280),
      clicks: rand(10, 90),
      bounces: rand(0, 12),
      unsubscribes: rand(0, 5),
    });
  }
  return data;
};

// Generate subscriber growth data
export const generateSubscriberGrowth = (days = 30) => {
  const data = [];
  const now = new Date();
  let total = rand(150, 500);
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const newSubs = rand(2, 25);
    const churned = rand(0, 5);
    total += newSubs - churned;
    data.push({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      newSubscribers: newSubs,
      churned,
      total,
    });
  }
  return data;
};

// Top performing campaigns
export const generateTopCampaigns = (count = 5) => {
  const subjects = [
    'Welcome to Our Platform', 'September Newsletter', 'Flash Sale — 48 Hours!',
    'Product Launch Announcement', 'Year-End Thank You', 'Re-Engagement Campaign',
    'Weekly Tips & Tricks', 'Holiday Special Offer', 'Feature Update Roundup',
    'Customer Appreciation Day',
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `camp_${i}`,
    subject: subjects[i % subjects.length],
    sent: rand(100, 800),
    openRate: (rand(450, 850) / 10).toFixed(1),
    clickRate: (rand(50, 250) / 10).toFixed(1),
    bounceRate: (rand(5, 30) / 10).toFixed(1),
    sentAt: new Date(Date.now() - rand(1, 30) * 86400000).toISOString(),
  })).sort((a, b) => parseFloat(b.openRate) - parseFloat(a.openRate));
};

// Device/client breakdown
export const generateDeviceBreakdown = () => [
  { device: 'Desktop', percentage: rand(35, 55), color: 'bg-emerald-500' },
  { device: 'Mobile', percentage: rand(30, 45), color: 'bg-teal-500' },
  { device: 'Tablet', percentage: rand(5, 15), color: 'bg-indigo-500' },
  { device: 'Other', percentage: rand(2, 8), color: 'bg-slate-500' },
];

// Geographic data
export const generateGeoData = () => [
  { country: 'United States', count: rand(200, 800), flag: '🇺🇸' },
  { country: 'United Kingdom', count: rand(50, 200), flag: '🇬🇧' },
  { country: 'India', count: rand(80, 300), flag: '🇮🇳' },
  { country: 'Germany', count: rand(30, 150), flag: '🇩🇪' },
  { country: 'Canada', count: rand(40, 180), flag: '🇨🇦' },
  { country: 'Australia', count: rand(20, 100), flag: '🇦🇺' },
  { country: 'France', count: rand(25, 120), flag: '🇫🇷' },
  { country: 'Brazil', count: rand(15, 90), flag: '🇧🇷' },
].sort((a, b) => b.count - a.count);

// Email client breakdown
export const generateEmailClients = () => [
  { client: 'Gmail', percentage: rand(35, 50), color: 'bg-red-500' },
  { client: 'Apple Mail', percentage: rand(15, 30), color: 'bg-slate-400' },
  { client: 'Outlook', percentage: rand(10, 20), color: 'bg-blue-500' },
  { client: 'Yahoo Mail', percentage: rand(5, 10), color: 'bg-purple-500' },
  { client: 'Other', percentage: rand(3, 10), color: 'bg-slate-600' },
];
