// Workflow categorization utilities

export const serviceCategories = {
  'Communication': [
    'Telegram', 'Slack', 'Discord', 'Twilio', 'Whatsapp', 'Signal', 'Mattermost',
    'Gmail', 'Emailsend', 'Mailgun', 'Sendgrid', 'Mailchimp', 'Emailreadimap',
    'Sms', 'Vonage', 'Messagebird'
  ],
  'Data & Analytics': [
    'GoogleSheets', 'Microsoftexcel', 'Spreadsheetfile', 'Airtable', 'Notion',
    'Postgres', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Elasticsearch',
    'Googlebigquery', 'Snowflake', 'Googleanalytics'
  ],
  'CRM & Sales': [
    'HubSpot', 'Pipedrive', 'Salesforce', 'Salesmate', 'Zendesk', 'Freshdesk',
    'Intercom', 'Helpscout', 'Copper', 'Zohocrm', 'Chargebee', 'Clearbit'
  ],
  'E-commerce': [
    'Shopify', 'WooCommerce', 'Stripe', 'PayPal', 'Quickbooks', 'Magento',
    'BigCommerce', 'Squarespace', 'Etsy', 'Amazon'
  ],
  'Productivity': [
    'GoogleCalendar', 'Calendly', 'Todoist', 'Trello', 'Asana', 'Mondaycom',
    'ClickUp', 'Jira', 'Basecamp', 'Microsofttodo', 'Googletasks',
    'Toggl', 'Clockify', 'Harvest'
  ],
  'Development': [
    'GitHub', 'GitLab', 'N8N', 'Bitbucket', 'Travisci', 'Jenkins',
    'Docker', 'Kubernetes', 'Aws', 'Gcp', 'Azure', 'Heroku'
  ],
  'Marketing': [
    'Twitter', 'Facebook', 'LinkedIn', 'Instagram', 'Youtube', 'Tiktok',
    'Hootsuite', 'Buffer', 'Mailerlite', 'Convertkit', 'Activecampaign',
    'Hubspot', 'Mailchimp'
  ],
  'Content': [
    'WordPress', 'Webflow', 'Ghost', 'Strapi', 'Contentful', 'Sanity',
    'Medium', 'Substack', 'Bannerbear', 'Canva', 'Figma'
  ],
  'Integration': [
    'HTTP', 'Webhook', 'Graphql', 'Rest', 'Soap', 'Amqp', 'Mqtt',
    'Zapier', 'Integromat', 'Pabbly'
  ],
  'Automation': [
    'Manual', 'Cron', 'Schedule', 'Interval', 'Wait', 'Filter', 'Code',
    'Functionitem', 'Splitout', 'Aggregate', 'Limit', 'Datetime'
  ]
};

export const triggerTypes = {
  'Manual': ['Manual'],
  'Webhook': ['Webhook'],
  'Scheduled': ['Scheduled', 'Cron', 'Interval'],
  'Event': ['Triggered'],
  'HTTP': ['HTTP']
};

export const operationTypes = {
  'Create': ['Create'],
  'Update': ['Update'],
  'Send': ['Send'],
  'Automation': ['Automation', 'Automate'],
  'Import': ['Import'],
  'Export': ['Export'],
  'Process': ['Process'],
  'Monitor': ['Monitor'],
  'Sync': ['Sync']
};

export function categorizeWorkflow(fileName: string): {
  category: string;
  services: string[];
  triggerType: string;
  operation: string;
  complexity: 'Simple' | 'Advanced' | 'Multi-step';
  tags: string[];
} {
  const nameParts = fileName.replace('.json', '').split('_').slice(1); // Remove number prefix
  
  // Extract services
  const services: string[] = [];
  let category = 'Integration';
  
  // Check each part against service categories
  for (const part of nameParts) {
    const capitalizedPart = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    
    for (const [categoryName, categoryServices] of Object.entries(serviceCategories)) {
      if (categoryServices.some(service => 
        service.toLowerCase() === part.toLowerCase() || 
        part.toLowerCase().includes(service.toLowerCase())
      )) {
        services.push(capitalizedPart);
        if (category === 'Integration') {
          category = categoryName;
        }
      }
    }
  }
  
  // Determine trigger type
  let triggerType = 'Manual';
  const lastPart = nameParts[nameParts.length - 1];
  for (const [trigger, keywords] of Object.entries(triggerTypes)) {
    if (keywords.some(keyword => lastPart.toLowerCase().includes(keyword.toLowerCase()))) {
      triggerType = trigger;
      break;
    }
  }
  
  // Determine operation
  let operation = 'Process';
  for (const part of nameParts) {
    for (const [op, keywords] of Object.entries(operationTypes)) {
      if (keywords.some(keyword => part.toLowerCase().includes(keyword.toLowerCase()))) {
        operation = op;
        break;
      }
    }
  }
  
  // Determine complexity based on number of services and operations
  let complexity: 'Simple' | 'Advanced' | 'Multi-step' = 'Simple';
  if (services.length > 2) {
    complexity = 'Multi-step';
  } else if (services.length === 2) {
    complexity = 'Advanced';
  }
  
  // Generate tags
  const tags = [
    ...services,
    triggerType,
    operation,
    complexity
  ];
  
  return {
    category,
    services: services.length > 0 ? services : ['Unknown'],
    triggerType,
    operation,
    complexity,
    tags
  };
}

export function generateWorkflowTitle(fileName: string): string {
  const nameParts = fileName.replace('.json', '').split('_').slice(1);
  return nameParts.map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  ).join(' ');
}

export function generateWorkflowDescription(
  services: string[], 
  operation: string, 
  triggerType: string
): string {
  const serviceList = services.join(', ');
  const triggerText = triggerType === 'Manual' ? 'manually triggered' : 
                     triggerType === 'Scheduled' ? 'runs on schedule' :
                     triggerType === 'Webhook' ? 'triggered by webhook' :
                     triggerType === 'Event' ? 'triggered by events' : 'HTTP-triggered';
  
  return `${operation} workflow integrating ${serviceList}. This workflow is ${triggerText} and helps automate processes between these services.`;
}