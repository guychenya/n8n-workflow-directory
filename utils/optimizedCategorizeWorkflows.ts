// Optimized workflow categorization utilities

// Pre-computed service-to-category lookup for O(1) performance
const serviceToCategoryMap = new Map<string, string>();

// Initialize the lookup map once
const serviceCategories = {
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
    'Hootsuite', 'Buffer', 'Mailerlite', 'Convertkit', 'Activecampaign'
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

// Build the lookup map once at module load
Object.entries(serviceCategories).forEach(([category, services]) => {
  services.forEach(service => {
    serviceToCategoryMap.set(service.toLowerCase(), category);
  });
});

// Pre-computed trigger type lookup
const triggerTypeMap = new Map<string, string>([
  ['manual', 'Manual'],
  ['webhook', 'Webhook'],
  ['scheduled', 'Scheduled'],
  ['cron', 'Scheduled'],
  ['interval', 'Scheduled'],
  ['triggered', 'Event'],
  ['http', 'HTTP']
]);

// Pre-computed operation type lookup
const operationTypeMap = new Map<string, string>([
  ['create', 'Create'],
  ['update', 'Update'],
  ['send', 'Send'],
  ['automation', 'Automation'],
  ['automate', 'Automation'],
  ['import', 'Import'],
  ['export', 'Export'],
  ['process', 'Process'],
  ['monitor', 'Monitor'],
  ['sync', 'Sync']
]);

export function categorizeWorkflow(fileName: string): {
  category: string;
  services: string[];
  triggerType: string;
  operation: string;
  complexity: 'Simple' | 'Advanced' | 'Multi-step';
  tags: string[];
} {
  try {
    const nameParts = fileName.replace('.json', '').split('_').slice(1);
    if (nameParts.length === 0) {
      // Fallback for malformed filenames
      return {
        category: 'Other',
        services: ['Unknown'],
        triggerType: 'Manual',
        operation: 'Process',
        complexity: 'Simple',
        tags: ['Unknown', 'Manual', 'Process', 'Simple']
      };
    }
    
    // Extract services - much faster lookup
    const services: string[] = [];
    const categories = new Set<string>();
    
    for (const part of nameParts) {
      const category = serviceToCategoryMap.get(part.toLowerCase());
      if (category) {
        services.push(part);
        categories.add(category);
      }
    }
    
    // Determine primary category (most common category from services)
    const category = categories.size > 0 ? Array.from(categories)[0] : 'Other';
    
    // Determine trigger type - optimized lookup
    let triggerType = 'Manual';
    const lastPart = nameParts[nameParts.length - 1]?.toLowerCase() || '';
    triggerType = triggerTypeMap.get(lastPart) || 'Manual';
    
    // Determine operation - optimized lookup  
    let operation = 'Process';
    for (const part of nameParts) {
      const op = operationTypeMap.get(part.toLowerCase());
      if (op) {
        operation = op;
        break;
      }
    }
    
    // Determine complexity based on number of services
    let complexity: 'Simple' | 'Advanced' | 'Multi-step' = 'Simple';
    if (services.length > 2) {
      complexity = 'Multi-step';
    } else if (services.length === 2) {
      complexity = 'Advanced';
    }
    
    // Generate tags efficiently
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
  } catch (error) {
    // Error handling - return safe defaults
    console.warn('Error categorizing workflow:', fileName, error);
    return {
      category: 'Other',
      services: ['Unknown'],
      triggerType: 'Manual',
      operation: 'Process',
      complexity: 'Simple',
      tags: ['Unknown', 'Manual', 'Process', 'Simple']
    };
  }
}

export function generateWorkflowTitle(fileName: string): string {
  try {
    const nameParts = fileName.replace('.json', '').split('_').slice(1);
    if (nameParts.length === 0) return 'Workflow';
    
    return nameParts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ');
  } catch (error) {
    console.warn('Error generating title for:', fileName, error);
    return 'Workflow';
  }
}

export function generateWorkflowDescription(
  services: string[], 
  operation: string, 
  triggerType: string
): string {
  try {
    const serviceList = services.length > 0 ? services.join(', ') : 'Unknown services';
    const triggerText = triggerType === 'Manual' ? 'manually triggered' : 
                       triggerType === 'Scheduled' ? 'runs on schedule' :
                       triggerType === 'Webhook' ? 'triggered by webhook' :
                       triggerType === 'Event' ? 'triggered by events' : 'HTTP-triggered';
    
    return `${operation} workflow integrating ${serviceList}. This workflow is ${triggerText} and helps automate processes between these services.`;
  } catch (error) {
    console.warn('Error generating description:', error);
    return 'Workflow for automating processes between services.';
  }
}