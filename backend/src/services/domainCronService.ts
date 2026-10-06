import { prisma } from '../config/prisma.js';
import { checkDomainDnsRecords } from './dnsVerification.js';

export const runDomainVerificationCheck = async () => {
  try {
    const pendingDomains = await prisma.domain.findMany({
      where: { isVerified: false }
    });

    if (pendingDomains.length === 0) {
      return;
    }

    console.log(`[DomainCron] Checking DNS status for ${pendingDomains.length} unverified domains...`);

    for (const domainRecord of pendingDomains) {
      const dnsResult = await checkDomainDnsRecords(
        domainRecord.domainName,
        domainRecord.verificationToken
      );

      const nowVerified = dnsResult.isVerified;

      await prisma.domain.update({
        where: { id: domainRecord.id },
        data: {
          spfStatus: dnsResult.spf.valid ? 'VERIFIED' : 'PENDING',
          dkimStatus: dnsResult.dkim.valid ? 'VERIFIED' : 'PENDING',
          dmarcStatus: dnsResult.dmarc.valid ? 'VERIFIED' : 'PENDING',
          isVerified: nowVerified
        }
      });

      if (nowVerified && !domainRecord.isVerified) {
        console.log(`🎉 [DomainCron] Domain '${domainRecord.domainName}' successfully auto-verified on public DNS!`);
        
        // Log to Audit Trail
        try {
          await prisma.auditLog.create({
            data: {
              workspaceId: domainRecord.workspaceId,
              actor: 'SYSTEM_CRON_WORKER',
              action: 'DOMAIN_AUTO_VERIFIED',
              category: 'SECURITY',
              details: `Domain '${domainRecord.domainName}' DNS records propagated and authenticated automatically.`,
              status: 'success'
            }
          });
        } catch {
          // Non-blocking log insertion fallback
        }
      }
    }
  } catch (err: any) {
    console.error('[DomainCron] Error executing domain verification cron:', err.message);
  }
};

let cronIntervalHandle: NodeJS.Timeout | null = null;

export const initDomainCronService = (intervalMs = 15 * 60 * 1000) => {
  console.log(`⏰ [DomainCron] Background automated domain verification worker initialized (Interval: ${intervalMs / 1000}s)`);
  
  // Initial run after 10 seconds of server startup
  setTimeout(() => {
    runDomainVerificationCheck();
  }, 10000);

  // Periodic schedule
  if (cronIntervalHandle) clearInterval(cronIntervalHandle);
  cronIntervalHandle = setInterval(runDomainVerificationCheck, intervalMs);
};
