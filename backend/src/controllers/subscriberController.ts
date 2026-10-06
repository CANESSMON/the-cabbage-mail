import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { prisma } from '../config/prisma.js';
import { isDisposableEmail } from '../services/spamEngine.js';

export const getSubscribers = async (req: AuthenticatedRequest, res: Response) => {
  const workspaceId = req.user?.workspaceId || 'wsp_default';
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ subscribers });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch subscribers', details: err.message });
  }
};

export const createSubscriber = async (req: AuthenticatedRequest, res: Response) => {
  const workspaceId = req.user?.workspaceId || 'wsp_default';
  const { email, firstName, lastName, phone, company, tags } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  if (isDisposableEmail(email)) {
    return res.status(400).json({ error: 'Disposable and temporary email domains are prohibited' });
  }

  try {
    const subscriber = await prisma.subscriber.create({
      data: {
        workspaceId,
        email,
        firstName,
        lastName,
        phone,
        company,
        tags: tags || ['web-lead']
      }
    });
    return res.status(201).json({ subscriber });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create subscriber', details: err.message });
  }
};

export const deleteSubscriber = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  try {
    await prisma.subscriber.delete({ where: { id } });
    return res.json({ message: 'Subscriber deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete subscriber', details: err.message });
  }
};
