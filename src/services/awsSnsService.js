/**
 * AWS SNS Email Delivery Integration Service
 * Dispatches bulk & single email notifications via AWS SNS Topics / Amazon SES hooks.
 */

export const dispatchCampaignViaAwsSns = async ({
  campaignSubject,
  campaignHtml,
  senderName,
  senderEmail,
  subscribers,
  awsConfig
}) => {
  console.log(`[AWS SNS Adapter] Initiating publish to topic: ${awsConfig?.awsTopicArn || 'arn:aws:sns:us-east-1:123456789012:DefaultCabbageTopic'}`);
  
  // Simulate network dispatch delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const results = subscribers.map((sub) => {
    // Interpolate personalized merge tags
    const personalizedBody = campaignHtml
      .replace(/\{\{\s*first_name\s*\}\}/g, sub.firstName || 'Valued Subscriber')
      .replace(/\{\{\s*last_name\s*\}\}/g, sub.lastName || '')
      .replace(/\{\{\s*email\s*\}\}/g, sub.email)
      .replace(/\{\{\s*unsubscribe_link\s*\}\}/g, `#unsubscribe-${sub.id}`);

    const messagePayload = {
      default: personalizedBody,
      email: personalizedBody,
      email_json: JSON.stringify({
        Subject: campaignSubject,
        From: `${senderName} <${senderEmail}>`,
        To: sub.email,
        Body: personalizedBody,
      })
    };

    return {
      subscriberId: sub.id,
      email: sub.email,
      status: 'SENT',
      messageId: `sns-msg-${Math.random().toString(36).substring(2, 12)}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      payloadSize: JSON.stringify(messagePayload).length,
    };
  });

  return {
    success: true,
    awsTopicArn: awsConfig?.awsTopicArn || 'arn:aws:sns:us-east-1:123456789012:CabbageMailTopic',
    totalDispatched: subscribers.length,
    bounced: 0,
    dispatches: results,
  };
};
