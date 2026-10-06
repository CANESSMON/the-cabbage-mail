import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { env } from '../config/env.js';

export interface EmailDispatchOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  unsubscribeUrl?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    region?: string;
  };
}

export interface EmailDispatchResult {
  success: boolean;
  provider: 'AWS' | 'SMTP' | 'MOCK';
  messageId?: string;
  details?: any;
}

// 1. Universal SMTP Transporter (Gmail / Custom SMTP)
const getSmtpTransporter = () => {
  const isSecure = env.SMTP_SECURE === 'true' || env.SMTP_PORT === '465';
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT, 10),
    secure: isSecure,
    auth: env.SMTP_USER && env.SMTP_PASS ? {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    } : undefined
  });
};

// 2. AWS SESv2 Client
const getAwsSesClient = (customCredentials?: EmailDispatchOptions['credentials']) => {
  const accessKeyId = customCredentials?.accessKeyId || env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = customCredentials?.secretAccessKey || env.AWS_SECRET_ACCESS_KEY;
  const region = customCredentials?.region || env.AWS_REGION || 'ap-south-1';

  return new SESv2Client({
    region,
    credentials: accessKeyId && secretAccessKey ? {
      accessKeyId,
      secretAccessKey
    } : undefined
  });
};

/**
 * Universal Email Dispatcher
 * Switches dynamically between AWS (SES), SMTP (Gmail), and MOCK providers based on process.env.EMAIL_PROVIDER
 */
export const sendEmail = async (options: EmailDispatchOptions): Promise<EmailDispatchResult> => {
  const provider = env.EMAIL_PROVIDER;
  const fromEmail = options.from || env.SES_FROM_EMAIL || env.SMTP_FROM || 'info@emailbhejo.com';

  console.log(`🚀 [EmailDispatcher] Dispatching via provider: ${provider} to ${options.to}`);

  if (provider === 'SMTP') {
    try {
      const transporter = getSmtpTransporter();
      const headers: Record<string, string> = {};
      if (options.unsubscribeUrl) {
        headers['List-Unsubscribe'] = `<${options.unsubscribeUrl}>`;
        headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';
      }

      const info = await transporter.sendMail({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        headers
      });
      console.log(`✅ [SMTP Dispatch Success] MessageId: ${info.messageId}`);
      return {
        success: true,
        provider: 'SMTP',
        messageId: info.messageId,
        details: info
      };
    } catch (err: any) {
      console.error(`❌ [SMTP Dispatch Failed]:`, err.message);
      return {
        success: false,
        provider: 'SMTP',
        details: err.message
      };
    }
  }

  if (provider === 'AWS') {
    try {
      const sesClient = getAwsSesClient(options.credentials);

      const headers = [];
      if (options.unsubscribeUrl) {
        headers.push({ Name: 'List-Unsubscribe', Value: `<${options.unsubscribeUrl}>` });
        headers.push({ Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' });
      }

      const command = new SendEmailCommand({
        FromEmailAddress: fromEmail,
        Destination: {
          ToAddresses: [options.to]
        },
        Content: {
          Simple: {
            Subject: { Data: options.subject, Charset: 'UTF-8' },
            Body: {
              Html: { Data: options.html, Charset: 'UTF-8' }
            },
            Headers: headers.length > 0 ? headers : undefined
          }
        }
      });

      const response = await sesClient.send(command);
      console.log(`✅ [AWS SES Dispatch Success] MessageId: ${response.MessageId}`);
      return {
        success: true,
        provider: 'AWS',
        messageId: response.MessageId,
        details: response
      };
    } catch (err: any) {
      console.error(`❌ [AWS SES Dispatch Failed]:`, err.message);
      return {
        success: false,
        provider: 'AWS',
        details: err.message
      };
    }
  }

  // MOCK Fallback for local testing
  console.log(`ℹ️ [MOCK Dispatcher] Email to ${options.to} rendered cleanly (Subject: "${options.subject}")`);
  return {
    success: true,
    provider: 'MOCK',
    messageId: `mock_msg_${Date.now()}`
  };
};
