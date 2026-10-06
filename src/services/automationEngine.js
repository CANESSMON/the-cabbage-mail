/**
 * Automation Engine — Workflow execution simulator
 * Manages automation workflow definitions and simulated step tracking.
 */

export const NODE_TYPES = {
  TRIGGER: 'trigger',
  ACTION: 'action',
  DELAY: 'delay',
  CONDITION: 'condition',
};

export const TRIGGER_TYPES = {
  NEW_SUBSCRIBER: { id: 'new_subscriber', label: 'New Subscriber', icon: 'Users', description: 'Fires when a contact is added to a list' },
  TAG_ADDED: { id: 'tag_added', label: 'Tag Added', icon: 'Tag', description: 'Fires when a specific tag is applied' },
  DATE_BASED: { id: 'date_based', label: 'Date-Based', icon: 'Calendar', description: 'Fires on a specific date or anniversary' },
  MANUAL: { id: 'manual', label: 'Manual Entry', icon: 'Play', description: 'Manually add contacts to this workflow' },
};

export const ACTION_TYPES = {
  SEND_EMAIL: { id: 'send_email', label: 'Send Email', icon: 'Mail', description: 'Send an email template' },
  ADD_TAG: { id: 'add_tag', label: 'Add Tag', icon: 'Tag', description: 'Apply a tag to the contact' },
  REMOVE_TAG: { id: 'remove_tag', label: 'Remove Tag', icon: 'Trash', description: 'Remove a tag from the contact' },
  MOVE_SEGMENT: { id: 'move_segment', label: 'Move to Segment', icon: 'Folder', description: 'Move contact to a different segment' },
};

export const DELAY_TYPES = {
  WAIT: { id: 'wait', label: 'Wait', icon: 'Clock', description: 'Wait for a specified duration' },
  WAIT_UNTIL: { id: 'wait_until', label: 'Wait Until', icon: 'Calendar', description: 'Wait until a specific date' },
};

// Create a workflow node
export const createNode = (nodeType, subType, config = {}) => ({
  id: `node_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  nodeType,
  subType,
  config: {
    ...config,
    label: config.label || subType?.label || 'Untitled',
  },
});

// Pre-built automation templates
export const AUTOMATION_TEMPLATES = [
  {
    id: 'auto_welcome',
    name: 'Welcome Series',
    description: 'A 3-email welcome drip for new subscribers.',
    category: 'Onboarding',
    nodes: [
      createNode(NODE_TYPES.TRIGGER, TRIGGER_TYPES.NEW_SUBSCRIBER, { label: 'New Subscriber Joins' }),
      createNode(NODE_TYPES.ACTION, ACTION_TYPES.SEND_EMAIL, { label: 'Send Welcome Email', templateName: 'Welcome Email' }),
      createNode(NODE_TYPES.DELAY, DELAY_TYPES.WAIT, { label: 'Wait 2 days', duration: 2, unit: 'days' }),
      createNode(NODE_TYPES.ACTION, ACTION_TYPES.SEND_EMAIL, { label: 'Send Tips Email', templateName: 'Getting Started Tips' }),
      createNode(NODE_TYPES.DELAY, DELAY_TYPES.WAIT, { label: 'Wait 3 days', duration: 3, unit: 'days' }),
      createNode(NODE_TYPES.ACTION, ACTION_TYPES.SEND_EMAIL, { label: 'Send Feature Highlight', templateName: 'Feature Showcase' }),
      createNode(NODE_TYPES.ACTION, ACTION_TYPES.ADD_TAG, { label: 'Tag as Onboarded', tagName: 'onboarded' }),
    ],
  },
  {
    id: 'auto_reengagement',
    name: 'Re-Engagement',
    description: 'Win back subscribers who have not engaged in 30 days.',
    category: 'Retention',
    nodes: [
      createNode(NODE_TYPES.TRIGGER, TRIGGER_TYPES.DATE_BASED, { label: '30 Days Inactive' }),
      createNode(NODE_TYPES.ACTION, ACTION_TYPES.SEND_EMAIL, { label: 'Send We Miss You Email', templateName: 'Re-Engagement' }),
      createNode(NODE_TYPES.DELAY, DELAY_TYPES.WAIT, { label: 'Wait 5 days', duration: 5, unit: 'days' }),
      createNode(NODE_TYPES.ACTION, ACTION_TYPES.SEND_EMAIL, { label: 'Send Last Chance Email', templateName: 'Last Chance' }),
      createNode(NODE_TYPES.DELAY, DELAY_TYPES.WAIT, { label: 'Wait 3 days', duration: 3, unit: 'days' }),
      createNode(NODE_TYPES.ACTION, ACTION_TYPES.ADD_TAG, { label: 'Tag as Churned', tagName: 'churned' }),
    ],
  },
  {
    id: 'auto_birthday',
    name: 'Birthday',
    description: 'Send a special birthday email with a discount code.',
    category: 'Engagement',
    nodes: [
      createNode(NODE_TYPES.TRIGGER, TRIGGER_TYPES.DATE_BASED, { label: 'Birthday Date Matches' }),
      createNode(NODE_TYPES.ACTION, ACTION_TYPES.SEND_EMAIL, { label: 'Send Birthday Email', templateName: 'Happy Birthday' }),
      createNode(NODE_TYPES.ACTION, ACTION_TYPES.ADD_TAG, { label: 'Tag Birthday Sent', tagName: 'birthday_sent_2026' }),
    ],
  },
];

// Simulate workflow execution status
export const getWorkflowStats = (nodes = []) => ({
  totalSteps: nodes.length,
  activeContacts: Math.floor(Math.random() * 150) + 10,
  completedContacts: Math.floor(Math.random() * 500) + 50,
  avgCompletionDays: (Math.random() * 14 + 3).toFixed(1),
});
