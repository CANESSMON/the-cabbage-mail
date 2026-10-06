/**
 * Template Engine — JSON Block Schema → HTML Renderer
 * Converts an array of template blocks into responsive email-ready HTML.
 */

// Default template block types
export const BLOCK_TYPES = {
  HEADER: 'header',
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  SOCIAL: 'social',
  FOOTER: 'footer',
};

// Create a new block with default props
export const createBlock = (type) => {
  const id = `block_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  switch (type) {
    case BLOCK_TYPES.HEADER:
      return { id, type, props: { logoText: 'EmailBhejo', title: 'Your Newsletter Title', subtitle: 'Monthly Update — 2026', bgColor: '#0f172a', textColor: '#ffffff' } };
    case BLOCK_TYPES.TEXT:
      return { id, type, props: { content: '<p>Hello {{first_name}},</p><p>We are excited to share our latest updates with you. Thank you for being a subscriber.</p>', padding: '24px' } };
    case BLOCK_TYPES.IMAGE:
      return { id, type, props: { src: 'https://placehold.co/600x200/0f172a/ffffff?text=Banner+Image', alt: 'Banner image', width: '100%', align: 'center' } };
    case BLOCK_TYPES.BUTTON:
      return { id, type, props: { text: 'Read More', href: 'https://example.com', bgColor: '#000000', textColor: '#ffffff', align: 'center', borderRadius: '6px' } };
    case BLOCK_TYPES.DIVIDER:
      return { id, type, props: { color: '#e2e8f0', thickness: '1px', padding: '16px' } };
    case BLOCK_TYPES.SPACER:
      return { id, type, props: { height: '24px' } };
    case BLOCK_TYPES.SOCIAL:
      return { id, type, props: { links: [
        { platform: 'Twitter', url: 'https://twitter.com' },
        { platform: 'LinkedIn', url: 'https://linkedin.com' },
        { platform: 'Website', url: 'https://example.com' },
      ], align: 'center' } };
    case BLOCK_TYPES.FOOTER:
      return { id, type, props: { companyName: 'Your Company', address: '123 Main St, City, State 12345', unsubscribeText: 'Unsubscribe from this list', showUnsubscribe: true } };
    default:
      return { id, type: BLOCK_TYPES.TEXT, props: { content: '<p>New text block</p>' } };
  }
};

// Render a single block to HTML
const renderBlock = (block) => {
  const { type, props } = block;
  switch (type) {
    case BLOCK_TYPES.HEADER:
      return `
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${props.bgColor};padding:32px 24px;text-align:center;">
          <tr><td>
            <div style="font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#ffffff;margin-bottom:8px;">${props.logoText}</div>
            <h1 style="margin:0;font-size:24px;font-weight:800;color:${props.textColor};font-family:'Plus Jakarta Sans',sans-serif;letter-spacing:-0.5px;">${props.title}</h1>
            ${props.subtitle ? `<p style="margin:8px 0 0;font-size:13px;color:#94a3b8;font-family:Inter,sans-serif;">${props.subtitle}</p>` : ''}
          </td></tr>
        </table>`;
    case BLOCK_TYPES.TEXT:
      return `
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:${props.padding || '24px'};font-size:14px;line-height:1.7;color:#334155;font-family:Inter,sans-serif;">
            ${props.content}
          </td></tr>
        </table>`;
    case BLOCK_TYPES.IMAGE:
      return `
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;text-align:${props.align || 'center'};">
            <img src="${props.src}" alt="${props.alt || ''}" width="${props.width || '100%'}" style="max-width:100%;height:auto;display:block;margin:0 auto;border-radius:8px;" />
          </td></tr>
        </table>`;
    case BLOCK_TYPES.BUTTON:
      return `
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:16px 24px;text-align:${props.align || 'center'};">
            <a href="${props.href}" style="display:inline-block;padding:12px 28px;background-color:${props.bgColor};color:${props.textColor};text-decoration:none;font-size:14px;font-weight:600;border-radius:${props.borderRadius || '6px'};font-family:Inter,sans-serif;">${props.text}</a>
          </td></tr>
        </table>`;
    case BLOCK_TYPES.DIVIDER:
      return `
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:${props.padding} 24px;">
            <hr style="border:none;border-top:${props.thickness} solid ${props.color};margin:0;" />
          </td></tr>
        </table>`;
    case BLOCK_TYPES.SPACER:
      return `<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:${props.height};"></td></tr></table>`;
    case BLOCK_TYPES.SOCIAL:
      const links = (props.links || []).map(l =>
        `<a href="${l.url}" style="display:inline-block;margin:0 8px;color:#0f172a;text-decoration:none;font-size:12px;font-family:Inter,sans-serif;">${l.platform}</a>`
      ).join('');
      return `
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:16px 24px;text-align:${props.align || 'center'};">
            ${links}
          </td></tr>
        </table>`;
    case BLOCK_TYPES.FOOTER:
      return `
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:24px;text-align:center;border-top:1px solid #e2e8f0;">
          <tr><td>
            <p style="margin:0;font-size:11px;color:#64748b;font-family:Inter,sans-serif;">${props.companyName} — ${props.address}</p>
            ${props.showUnsubscribe ? `<p style="margin:8px 0 0;font-size:11px;"><a href="{{unsubscribe_link}}" style="color:#0f172a;text-decoration:underline;font-family:Inter,sans-serif;">${props.unsubscribeText}</a></p>` : ''}
          </td></tr>
        </table>`;
    default:
      return '';
  }
};

// Render full template to email HTML
export const renderTemplateToHtml = (blocks = [], meta = {}) => {
  const bodyHtml = blocks.map(renderBlock).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.subject || 'Email'}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin:20px 0;">
        <tr><td>
          ${bodyHtml}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

// Pre-built template library
export const TEMPLATE_LIBRARY = [
  {
    id: 'tpl_welcome',
    name: 'Welcome Email',
    description: 'Greet new subscribers with a warm intro and CTA.',
    category: 'Onboarding',
    blocks: [
      createBlock(BLOCK_TYPES.HEADER),
      { ...createBlock(BLOCK_TYPES.TEXT), props: { content: '<p>Hi {{first_name}},</p><p>Welcome aboard! We are thrilled to have you as part of our community. Here is what you can expect from us:</p><ul><li>Weekly insights and tips</li><li>Exclusive product updates</li><li>Early access to new features</li></ul>', padding: '24px' } },
      { ...createBlock(BLOCK_TYPES.BUTTON), props: { text: 'Explore Our Platform', href: 'https://example.com', bgColor: '#000000', textColor: '#ffffff', align: 'center', borderRadius: '6px' } },
      createBlock(BLOCK_TYPES.DIVIDER),
      createBlock(BLOCK_TYPES.SOCIAL),
      createBlock(BLOCK_TYPES.FOOTER),
    ],
  },
  {
    id: 'tpl_newsletter',
    name: 'Monthly Newsletter',
    description: 'Share updates, articles, and company news.',
    category: 'Newsletter',
    blocks: [
      { ...createBlock(BLOCK_TYPES.HEADER), props: { logoText: 'EmailBhejo', title: 'Monthly Newsletter', subtitle: 'The latest from our team', bgColor: '#0f172a', textColor: '#ffffff' } },
      createBlock(BLOCK_TYPES.IMAGE),
      { ...createBlock(BLOCK_TYPES.TEXT), props: { content: '<p>Hello {{first_name}},</p><p>Here is a roundup of everything that happened this month. From product launches to community highlights, we have got you covered.</p>', padding: '24px' } },
      { ...createBlock(BLOCK_TYPES.BUTTON), props: { text: 'Read Full Update', href: '#', bgColor: '#0f172a', textColor: '#ffffff', align: 'center', borderRadius: '6px' } },
      createBlock(BLOCK_TYPES.DIVIDER),
      createBlock(BLOCK_TYPES.FOOTER),
    ],
  },
  {
    id: 'tpl_product_launch',
    name: 'Product Launch',
    description: 'Announce a new product or feature release.',
    category: 'Announcement',
    blocks: [
      { ...createBlock(BLOCK_TYPES.HEADER), props: { logoText: 'EmailBhejo', title: 'Introducing Our Latest Feature', subtitle: 'Something new is here', bgColor: '#0f172a', textColor: '#ffffff' } },
      createBlock(BLOCK_TYPES.IMAGE),
      { ...createBlock(BLOCK_TYPES.TEXT), props: { content: '<p>Hi {{first_name}},</p><p>We have been working on something special, and today we are excited to share it with you. This new feature will help you work faster, smarter, and more efficiently.</p>', padding: '24px' } },
      { ...createBlock(BLOCK_TYPES.BUTTON), props: { text: 'Try It Now', href: '#', bgColor: '#000000', textColor: '#ffffff', align: 'center', borderRadius: '6px' } },
      createBlock(BLOCK_TYPES.SPACER),
      createBlock(BLOCK_TYPES.FOOTER),
    ],
  },
  {
    id: 'tpl_flash_sale',
    name: 'Special Promotion',
    description: 'Limited-time offer promotion template.',
    category: 'Promotional',
    blocks: [
      { ...createBlock(BLOCK_TYPES.HEADER), props: { logoText: 'EmailBhejo', title: 'Limited Time Offer', subtitle: 'Exclusive offer for subscribers', bgColor: '#0f172a', textColor: '#ffffff' } },
      { ...createBlock(BLOCK_TYPES.TEXT), props: { content: '<p>Hey {{first_name}},</p><p>Our special promotion is live. Do not miss your chance to upgrade your experience.</p>', padding: '24px' } },
      { ...createBlock(BLOCK_TYPES.BUTTON), props: { text: 'Shop Now', href: '#', bgColor: '#000000', textColor: '#ffffff', align: 'center', borderRadius: '6px' } },
      createBlock(BLOCK_TYPES.DIVIDER),
      createBlock(BLOCK_TYPES.FOOTER),
    ],
  },
  {
    id: 'tpl_event_invite',
    name: 'Event Invitation',
    description: 'Invite subscribers to a webinar, meetup, or conference.',
    category: 'Event',
    blocks: [
      { ...createBlock(BLOCK_TYPES.HEADER), props: { logoText: 'EmailBhejo', title: 'You Are Invited', subtitle: 'Join us for an exclusive live event', bgColor: '#0f172a', textColor: '#ffffff' } },
      { ...createBlock(BLOCK_TYPES.TEXT), props: { content: '<p>Hi {{first_name}},</p><p>We would love for you to join us at our upcoming event. Meet industry leaders, learn new strategies, and connect with the community.</p><p><strong>Date:</strong> October 15, 2026<br/><strong>Time:</strong> 2:00 PM EST<br/><strong>Location:</strong> Virtual</p>', padding: '24px' } },
      { ...createBlock(BLOCK_TYPES.BUTTON), props: { text: 'Register Now', href: '#', bgColor: '#000000', textColor: '#ffffff', align: 'center', borderRadius: '6px' } },
      createBlock(BLOCK_TYPES.FOOTER),
    ],
  },
  {
    id: 'tpl_re_engagement',
    name: 'Re-Engagement',
    description: 'Win back inactive subscribers.',
    category: 'Retention',
    blocks: [
      { ...createBlock(BLOCK_TYPES.HEADER), props: { logoText: 'EmailBhejo', title: 'We Miss You', subtitle: 'It has been a while since your last visit', bgColor: '#0f172a', textColor: '#ffffff' } },
      { ...createBlock(BLOCK_TYPES.TEXT), props: { content: '<p>Hi {{first_name}},</p><p>We noticed you have not been around lately. We have been making improvements and adding new features that we think you will love.</p><p>Come back and see what is new.</p>', padding: '24px' } },
      { ...createBlock(BLOCK_TYPES.BUTTON), props: { text: 'Explore What Is New', href: '#', bgColor: '#000000', textColor: '#ffffff', align: 'center', borderRadius: '6px' } },
      createBlock(BLOCK_TYPES.DIVIDER),
      createBlock(BLOCK_TYPES.FOOTER),
    ],
  },
  {
    id: 'tpl_thank_you',
    name: 'Thank You',
    description: 'Express gratitude after a purchase or milestone.',
    category: 'Transactional',
    blocks: [
      { ...createBlock(BLOCK_TYPES.HEADER), props: { logoText: 'EmailBhejo', title: 'Thank You', subtitle: 'Your support means everything', bgColor: '#0f172a', textColor: '#ffffff' } },
      { ...createBlock(BLOCK_TYPES.TEXT), props: { content: '<p>Dear {{first_name}},</p><p>Thank you so much for your recent action. We appreciate your trust in us and hope you enjoy your experience.</p>', padding: '24px' } },
      { ...createBlock(BLOCK_TYPES.BUTTON), props: { text: 'View Details', href: '#', bgColor: '#000000', textColor: '#ffffff', align: 'center', borderRadius: '6px' } },
      createBlock(BLOCK_TYPES.SOCIAL),
      createBlock(BLOCK_TYPES.FOOTER),
    ],
  },
];

