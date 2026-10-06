import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { prisma } from '../config/prisma.js';

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  const workspaceId = req.user?.workspaceId || 'wsp_default';
  try {
    const logs = await prisma.auditLog.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    return res.json({ logs });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch audit logs', details: err.message });
  }
};

export const createAuditLog = async (req: AuthenticatedRequest, res: Response) => {
  const workspaceId = req.user?.workspaceId || 'wsp_default';
  const { action, category, details, actor, status } = req.body;

  try {
    const log = await prisma.auditLog.create({
      data: {
        workspaceId,
        actor: actor || req.user?.email || 'System User',
        action,
        category,
        details,
        status: status || 'success',
        ip: req.ip
      }
    });
    return res.status(201).json({ log });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to log event', details: err.message });
  }
};
