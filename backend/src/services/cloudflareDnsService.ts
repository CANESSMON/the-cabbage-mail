export interface CloudflareProvisionRecord {
  type: 'TXT' | 'CNAME';
  name: string;
  content: string;
  status: 'CREATED' | 'EXISTS' | 'FAILED';
  error?: string;
}

export interface CloudflareProvisionResult {
  success: boolean;
  domain: string;
  zoneId?: string;
  recordsProcessed: CloudflareProvisionRecord[];
  message: string;
}

export const getCloudflareZoneId = async (domainName: string, apiToken: string): Promise<string> => {
  const cleanDomain = domainName.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${cleanDomain}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiToken.trim()}`,
      'Content-Type': 'application/json'
    }
  });

  const data: any = await response.json();

  if (!response.ok || !data.success) {
    const errorMsg = data.errors?.[0]?.message || 'Failed to authenticate with Cloudflare API';
    throw new Error(`Cloudflare API Error: ${errorMsg}`);
  }

  if (!data.result || data.result.length === 0) {
    throw new Error(`Domain '${cleanDomain}' was not found in your Cloudflare account zones.`);
  }

  return data.result[0].id;
};

export const provisionCloudflareDnsRecords = async (
  domainName: string,
  apiToken: string
): Promise<CloudflareProvisionResult> => {
  const cleanDomain = domainName.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  
  const domainHash = Math.abs(
    cleanDomain.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(36);

  const targetRecords = [
    {
      type: 'TXT' as const,
      name: `_emailbhejo-verify.${cleanDomain}`,
      content: `emailbhejo-verify-domain=txt_${domainHash}9x2k81`
    },
    {
      type: 'CNAME' as const,
      name: `emailbhejo1._domainkey.${cleanDomain}`,
      content: `emailbhejo1.dkim.amazonses.com`
    },
    {
      type: 'CNAME' as const,
      name: `emailbhejo2._domainkey.${cleanDomain}`,
      content: `emailbhejo2.dkim.amazonses.com`
    },
    {
      type: 'CNAME' as const,
      name: `emailbhejo3._domainkey.${cleanDomain}`,
      content: `emailbhejo3.dkim.amazonses.com`
    },
    {
      type: 'TXT' as const,
      name: cleanDomain,
      content: `v=spf1 include:amazonses.com ~all`
    },
    {
      type: 'TXT' as const,
      name: `_dmarc.${cleanDomain}`,
      content: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${cleanDomain}`
    }
  ];

  try {
    const zoneId = await getCloudflareZoneId(cleanDomain, apiToken);

    // Fetch existing records to prevent duplication
    const existingRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken.trim()}`,
        'Content-Type': 'application/json'
      }
    });

    const existingData: any = await existingRes.json();
    const existingRecords: any[] = existingData.result || [];

    const recordsProcessed: CloudflareProvisionRecord[] = [];

    for (const record of targetRecords) {
      const existing = existingRecords.find(r => 
        r.type === record.type && 
        (r.name === record.name || r.name === `${record.name}.${cleanDomain}`)
      );

      if (existing) {
        recordsProcessed.push({
          type: record.type,
          name: record.name,
          content: record.content,
          status: 'EXISTS'
        });
        continue;
      }

      // Insert record via Cloudflare API
      const createRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: record.type,
          name: record.name,
          content: record.content,
          ttl: 1, // Automatic TTL
          proxied: false // Must be DNS only (grey cloud) for verification records
        })
      });

      const createData: any = await createRes.json();

      if (createRes.ok && createData.success) {
        recordsProcessed.push({
          type: record.type,
          name: record.name,
          content: record.content,
          status: 'CREATED'
        });
      } else {
        const errorDetail = createData.errors?.[0]?.message || 'Unknown Cloudflare error';
        recordsProcessed.push({
          type: record.type,
          name: record.name,
          content: record.content,
          status: 'FAILED',
          error: errorDetail
        });
      }
    }

    const hasErrors = recordsProcessed.some(r => r.status === 'FAILED');

    return {
      success: !hasErrors,
      domain: cleanDomain,
      zoneId,
      recordsProcessed,
      message: hasErrors 
        ? 'DNS provisioning completed with some warnings/errors.'
        : 'All 6 authentication DNS records successfully published to Cloudflare DNS!'
    };
  } catch (err: any) {
    return {
      success: false,
      domain: cleanDomain,
      recordsProcessed: [],
      message: err.message || 'Failed to auto-provision DNS records to Cloudflare.'
    };
  }
};
