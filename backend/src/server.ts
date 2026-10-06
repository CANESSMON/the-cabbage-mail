import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { registerUser, loginUser } from './controllers/authController.js';
import { getDomains, verifyDomain, autoProvisionDns } from './controllers/domainController.js';
import { getSubscribers, createSubscriber, deleteSubscriber } from './controllers/subscriberController.js';
import { getCampaigns, createCampaign, sendCampaign } from './controllers/campaignController.js';
import { getAuditLogs, createAuditLog } from './controllers/auditController.js';
import { authenticateJwt } from './middleware/authMiddleware.js';
import { initDomainCronService } from './services/domainCronService.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/v1/health', (req: Request, res: Response) => {
  return res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'EmailBhejo Node.js TypeScript API',
    version: '1.0.0'
  });
});

// Authentication Routes
app.post('/api/v1/auth/register', registerUser);
app.post('/api/v1/auth/login', loginUser);

// Protected Domain Verification Routes
app.get('/api/v1/domains', authenticateJwt as any, getDomains as any);
app.post('/api/v1/domains/verify-dns', authenticateJwt as any, verifyDomain as any);
app.post('/api/v1/domains/auto-provision-dns', authenticateJwt as any, autoProvisionDns as any);

// Protected Subscriber Routes
app.get('/api/v1/subscribers', authenticateJwt as any, getSubscribers as any);
app.post('/api/v1/subscribers', authenticateJwt as any, createSubscriber as any);
app.delete('/api/v1/subscribers/:id', authenticateJwt as any, deleteSubscriber as any);

// Protected Campaign Routes
app.get('/api/v1/campaigns', authenticateJwt as any, getCampaigns as any);
app.post('/api/v1/campaigns', authenticateJwt as any, createCampaign as any);
app.post('/api/v1/campaigns/:id/send', authenticateJwt as any, sendCampaign as any);

// Protected Audit Log Routes
app.get('/api/v1/audit-logs', authenticateJwt as any, getAuditLogs as any);
app.post('/api/v1/audit-logs', authenticateJwt as any, createAuditLog as any);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

const PORT = parseInt(env.PORT, 10);
app.listen(PORT, () => {
  console.log(`🚀 EmailBhejo Backend Server running on http://localhost:${PORT}/api/v1`);
  // Initialize background domain verification worker
  initDomainCronService();
});
