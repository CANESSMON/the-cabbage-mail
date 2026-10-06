import { Resolver } from 'dns/promises';

export interface DnsCheckResult {
  domain: string;
  txtRecords: string[];
  spf: { valid: boolean; record?: string };
  dkim: { valid: boolean; selector: string };
  dmarc: { valid: boolean; record?: string };
  verificationTxt: { valid: boolean; record?: string };
  isVerified: boolean;
}

export const checkDomainDnsRecords = async (domain: string, verificationToken?: string): Promise<DnsCheckResult> => {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  
  // Create resolver pointing to public Cloudflare & Google DNS servers (bypassing local ISP DNS cache)
  const resolver = new Resolver();
  try {
    resolver.setServers(['1.1.1.1', '8.8.8.8']);
  } catch {
    // Fallback to system default if custom servers cannot be bound
  }

  // 1. Check Root Domain TXT Records (SPF & Verification Challenge)
  let txtRecords: string[] = [];
  try {
    const rawTxt = await resolver.resolveTxt(cleanDomain);
    txtRecords = rawTxt.map((r: string[]) => r.join(''));
  } catch (err) {
    txtRecords = [];
  }

  // Check SPF (must contain v=spf1)
  const spfRecord = txtRecords.find(r => r.startsWith('v=spf1'));
  const spfValid = Boolean(spfRecord);

  // Check TXT Verification challenge token (if published)
  const challengeRecord = txtRecords.find(r => r.includes('emailbhejo-verify-domain'));
  
  let verificationTxtRecord: string | undefined = challengeRecord;
  let verificationTxtValid = Boolean(challengeRecord);

  if (!verificationTxtValid) {
    try {
      const challengeTxt = await resolver.resolveTxt(`_emailbhejo-verify.${cleanDomain}`);
      const found = challengeTxt.map((r: string[]) => r.join('')).find(r => r.includes('emailbhejo-verify-domain'));
      if (found) {
        verificationTxtRecord = found;
        verificationTxtValid = true;
      }
    } catch {
      verificationTxtValid = false;
    }
  }

  // 2. Check DMARC (TXT _dmarc.domain)
  let dmarcRecord: string | undefined;
  let dmarcValid = false;
  try {
    const dmarcTxt = await resolver.resolveTxt(`_dmarc.${cleanDomain}`);
    dmarcRecord = dmarcTxt.map((r: string[]) => r.join('')).find((r: string) => r.startsWith('v=DMARC1'));
    dmarcValid = Boolean(dmarcRecord);
  } catch {
    dmarcValid = false;
  }

  // 3. Check DKIM (CNAME emailbhejo1._domainkey.domain)
  let dkimValid = false;
  const dkimSelector = `emailbhejo1._domainkey.${cleanDomain}`;
  
  try {
    const cnames = await resolver.resolveCname(dkimSelector);
    dkimValid = cnames.length > 0;
  } catch {
    // Fallback: Check resolveAny or resolveTxt if CNAME returned as alias/direct TXT
    try {
      const anyRecords: any = await resolver.resolveAny(dkimSelector);
      dkimValid = Array.isArray(anyRecords) && anyRecords.length > 0;
    } catch {
      dkimValid = false;
    }
  }

  // Domain is verified if SPF and DKIM records are detected
  const isVerified = spfValid && dkimValid;

  return {
    domain: cleanDomain,
    txtRecords,
    spf: { valid: spfValid, record: spfRecord },
    dkim: { valid: dkimValid, selector: dkimSelector },
    dmarc: { valid: dmarcValid, record: dmarcRecord },
    verificationTxt: { valid: verificationTxtValid, record: verificationTxtRecord },
    isVerified
  };
};
