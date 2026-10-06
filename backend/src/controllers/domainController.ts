import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { checkDomainDnsRecords } from '../services/dnsVerification.js';
import { provisionCloudflareDnsRecords } from '../services/cloudflareDnsService.js';
import { prisma } from '../config/prisma.js';

const ensureWorkspaceExists = async (workspaceId: string, ownerId = 'usr_dev_1') => {
  try {
    await prisma.user.upsert({
      where: { id: ownerId },
      update: {},
      create: {
        id: ownerId,
        email: 'admin@emailbhejo.com',
        name: 'Default Admin',
        passwordHash: 'dev_hash_123'
      }
    });

    await prisma.workspace.upsert({
      where: { id: workspaceId },
      update: {},
      create: {
        id: workspaceId,
        name: 'Default Workspace',
        ownerId: ownerId
      }
    });
  } catch (err: any) {
    console.warn('[DomainController] Note on workspace setup:', err.message);
  }
};

export const getDomains = async (req: AuthenticatedRequest, res: Response) => {
  const workspaceId = req.user?.workspaceId || 'wsp_default';
  try {
    await ensureWorkspaceExists(workspaceId);
    const domains = await prisma.domain.findMany({
      where: { workspaceId }
    });
    return res.json({ domains });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch domains', details: err.message });
  }
};

export const verifyDomain = async (req: AuthenticatedRequest, res: Response) => {
  const { domainName } = req.body;
  if (!domainName) {
    return res.status(400).json({ error: 'domainName is required' });
  }

  const workspaceId = req.user?.workspaceId || 'wsp_default';
  const token = `emailbhejo-verify-domain=txt_${Math.random().toString(36).slice(2, 10)}`;

  try {
    await ensureWorkspaceExists(workspaceId);
    const dnsResult = await checkDomainDnsRecords(domainName, token);

    let savedDomain: any = null;
    try {
      savedDomain = await prisma.domain.upsert({
        where: {
          workspaceId_domainName: { workspaceId, domainName }
        },
        update: {
          spfStatus: dnsResult.spf.valid ? 'VERIFIED' : 'PENDING',
          dkimStatus: dnsResult.dkim.valid ? 'VERIFIED' : 'PENDING',
          dmarcStatus: dnsResult.dmarc.valid ? 'VERIFIED' : 'PENDING',
          isVerified: dnsResult.isVerified
        },
        create: {
          workspaceId,
          domainName,
          verificationToken: token,
          spfStatus: dnsResult.spf.valid ? 'VERIFIED' : 'PENDING',
          dkimStatus: dnsResult.dkim.valid ? 'VERIFIED' : 'PENDING',
          dmarcStatus: dnsResult.dmarc.valid ? 'VERIFIED' : 'PENDING',
          isVerified: dnsResult.isVerified
        }
      });
    } catch (dbErr: any) {
      console.warn('[DomainController] Note on DB save:', dbErr.message);
      savedDomain = {
        workspaceId,
        domainName,
        verificationToken: token,
        spfStatus: dnsResult.spf.valid ? 'VERIFIED' : 'PENDING',
        dkimStatus: dnsResult.dkim.valid ? 'VERIFIED' : 'PENDING',
        dmarcStatus: dnsResult.dmarc.valid ? 'VERIFIED' : 'PENDING',
        isVerified: dnsResult.isVerified
      };
    }

    return res.json({
      message: dnsResult.isVerified ? 'Domain verified successfully' : 'DNS lookup executed, records checked',
      dns: dnsResult,
      domain: savedDomain
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Domain verification check failed', details: err.message });
  }
};

export const autoProvisionDns = async (req: AuthenticatedRequest, res: Response) => {
  const { domainName, apiToken } = req.body;
  if (!domainName || !apiToken) {
    return res.status(400).json({ error: 'both domainName and apiToken are required' });
  }

  const workspaceId = req.user?.workspaceId || 'wsp_default';

  try {
    await ensureWorkspaceExists(workspaceId);

    // Step 1: Provision DNS records directly to Cloudflare
    const provisionResult = await provisionCloudflareDnsRecords(domainName, apiToken);

    if (!provisionResult.success && provisionResult.recordsProcessed.length === 0) {
      return res.status(400).json({
        error: 'Cloudflare Provisioning Failed',
        details: provisionResult.message
      });
    }

    // Step 2: Immediate DNS Verification Check
    const token = `emailbhejo-verify-domain=txt_${Math.random().toString(36).slice(2, 10)}`;
    const dnsResult = await checkDomainDnsRecords(domainName, token);

    let savedDomain: any = null;
    try {
      savedDomain = await prisma.domain.upsert({
        where: {
          workspaceId_domainName: { workspaceId, domainName }
        },
        update: {
          spfStatus: dnsResult.spf.valid ? 'VERIFIED' : 'PENDING',
          dkimStatus: dnsResult.dkim.valid ? 'VERIFIED' : 'PENDING',
          dmarcStatus: dnsResult.dmarc.valid ? 'VERIFIED' : 'PENDING',
          isVerified: dnsResult.isVerified
        },
        create: {
          workspaceId,
          domainName,
          verificationToken: token,
          spfStatus: dnsResult.spf.valid ? 'VERIFIED' : 'PENDING',
          dkimStatus: dnsResult.dkim.valid ? 'VERIFIED' : 'PENDING',
          dmarcStatus: dnsResult.dmarc.valid ? 'VERIFIED' : 'PENDING',
          isVerified: dnsResult.isVerified
        }
      });
    } catch (dbErr: any) {
      console.warn('[DomainController] Note on DB save:', dbErr.message);
      savedDomain = {
        workspaceId,
        domainName,
        verificationToken: token,
        spfStatus: dnsResult.spf.valid ? 'VERIFIED' : 'PENDING',
        dkimStatus: dnsResult.dkim.valid ? 'VERIFIED' : 'PENDING',
        dmarcStatus: dnsResult.dmarc.valid ? 'VERIFIED' : 'PENDING',
        isVerified: dnsResult.isVerified
      };
    }

    return res.json({
      message: provisionResult.message,
      provision: provisionResult,
      dns: dnsResult,
      domain: savedDomain
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Auto-provisioning failed', details: err.message });
  }
};

