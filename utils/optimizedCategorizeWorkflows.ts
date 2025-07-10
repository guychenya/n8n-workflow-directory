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

// Service name normalization map for proper titles
const serviceNameMap = new Map<string, string>([
  ['movebinarydata', 'Move Binary Data'],
  ['readbinaryfile', 'Read Binary File'],
  ['readbinaryfiles', 'Read Binary Files'],
  ['writebinaryfile', 'Write Binary File'],
  ['converttofile', 'Convert To File'],
  ['extractfromfile', 'Extract From File'],
  ['spreadsheetfile', 'Spreadsheet File'],
  ['localfile', 'Local File'],
  ['googlesheets', 'Google Sheets'],
  ['googledocs', 'Google Docs'],
  ['googledrive', 'Google Drive'],
  ['googlecalendar', 'Google Calendar'],
  ['googletasks', 'Google Tasks'],
  ['googleanalytics', 'Google Analytics'],
  ['googlebigquery', 'Google BigQuery'],
  ['googleslides', 'Google Slides'],
  ['googlebooks', 'Google Books'],
  ['googlecontacts', 'Google Contacts'],
  ['googlefirebasecloudfirestore', 'Google Firebase Cloud Firestore'],
  ['googlefirebaserealtimedatabase', 'Google Firebase Realtime Database'],
  ['googlecloudnaturallanguage', 'Google Cloud Natural Language'],
  ['gsuiteadmin', 'G Suite Admin'],
  ['gmailtool', 'Gmail Tool'],
  ['googlecalendartool', 'Google Calendar Tool'],
  ['microsoftexcel', 'Microsoft Excel'],
  ['microsofttodo', 'Microsoft Todo'],
  ['microsoftteams', 'Microsoft Teams'],
  ['microsoftoutlook', 'Microsoft Outlook'],
  ['microsoftonedrive', 'Microsoft OneDrive'],
  ['openweathermap', 'OpenWeatherMap'],
  ['emailreadimap', 'Email Read IMAP'],
  ['emailsend', 'Email Send'],
  ['functionitem', 'Function Item'],
  ['splitout', 'Split Out'],
  ['splitinbatches', 'Split In Batches'],
  ['datetime', 'Date Time'],
  ['clickup', 'ClickUp'],
  ['mondaycom', 'Monday.com'],
  ['salesforce', 'Salesforce'],
  ['hubspot', 'HubSpot'],
  ['mailchimp', 'MailChimp'],
  ['mailgun', 'Mailgun'],
  ['sendgrid', 'SendGrid'],
  ['activecampaign', 'ActiveCampaign'],
  ['convertkit', 'ConvertKit'],
  ['mailerlite', 'MailerLite'],
  ['woocommerce', 'WooCommerce'],
  ['bigcommerce', 'BigCommerce'],
  ['squarespace', 'Squarespace'],
  ['quickbooks', 'QuickBooks'],
  ['freshdesk', 'FreshDesk'],
  ['helpscout', 'HelpScout'],
  ['intercom', 'Intercom'],
  ['chargebee', 'Chargebee'],
  ['clearbit', 'Clearbit'],
  ['pipedrive', 'Pipedrive'],
  ['salesmate', 'Salesmate'],
  ['zendesk', 'Zendesk'],
  ['zohocrm', 'Zoho CRM'],
  ['airtable', 'Airtable'],
  ['notion', 'Notion'],
  ['supabase', 'Supabase'],
  ['elasticsearch', 'Elasticsearch'],
  ['mongodb', 'MongoDB'],
  ['postgres', 'PostgreSQL'],
  ['postgrestool', 'PostgreSQL Tool'],
  ['mysql', 'MySQL'],
  ['redis', 'Redis'],
  ['snowflake', 'Snowflake'],
  ['cratedb', 'CrateDB'],
  ['questdb', 'QuestDB'],
  ['nocodb', 'NocoDB'],
  ['baserow', 'Baserow'],
  ['grist', 'Grist'],
  ['todoist', 'Todoist'],
  ['trello', 'Trello'],
  ['asana', 'Asana'],
  ['basecamp', 'Basecamp'],
  ['jira', 'Jira'],
  ['jiratool', 'Jira Tool'],
  ['calendly', 'Calendly'],
  ['toggl', 'Toggl'],
  ['clockify', 'Clockify'],
  ['harvest', 'Harvest'],
  ['beeminder', 'Beeminder'],
  ['github', 'GitHub'],
  ['gitlab', 'GitLab'],
  ['bitbucket', 'Bitbucket'],
  ['travisci', 'Travis CI'],
  ['jenkins', 'Jenkins'],
  ['docker', 'Docker'],
  ['kubernetes', 'Kubernetes'],
  ['heroku', 'Heroku'],
  ['netlify', 'Netlify'],
  ['twitter', 'Twitter'],
  ['facebook', 'Facebook'],
  ['linkedin', 'LinkedIn'],
  ['instagram', 'Instagram'],
  ['youtube', 'YouTube'],
  ['tiktok', 'TikTok'],
  ['hootsuite', 'Hootsuite'],
  ['buffer', 'Buffer'],
  ['wordpress', 'WordPress'],
  ['webflow', 'Webflow'],
  ['ghost', 'Ghost'],
  ['strapi', 'Strapi'],
  ['contentful', 'Contentful'],
  ['sanity', 'Sanity'],
  ['medium', 'Medium'],
  ['substack', 'Substack'],
  ['bannerbear', 'Bannerbear'],
  ['canva', 'Canva'],
  ['figma', 'Figma'],
  ['editimage', 'Edit Image'],
  ['http', 'HTTP'],
  ['webhook', 'Webhook'],
  ['graphql', 'GraphQL'],
  ['rest', 'REST'],
  ['soap', 'SOAP'],
  ['amqp', 'AMQP'],
  ['mqtt', 'MQTT'],
  ['zapier', 'Zapier'],
  ['integromat', 'Integromat'],
  ['pabbly', 'Pabbly'],
  ['telegram', 'Telegram'],
  ['slack', 'Slack'],
  ['discord', 'Discord'],
  ['twilio', 'Twilio'],
  ['whatsapp', 'WhatsApp'],
  ['signal', 'Signal'],
  ['mattermost', 'Mattermost'],
  ['gmail', 'Gmail'],
  ['vonage', 'Vonage'],
  ['messagebird', 'MessageBird'],
  ['shopify', 'Shopify'],
  ['stripe', 'Stripe'],
  ['paypal', 'PayPal'],
  ['magento', 'Magento'],
  ['etsy', 'Etsy'],
  ['amazon', 'Amazon'],
  ['manual', 'Manual'],
  ['cron', 'Cron'],
  ['schedule', 'Schedule'],
  ['interval', 'Interval'],
  ['wait', 'Wait'],
  ['filter', 'Filter'],
  ['code', 'Code'],
  ['limit', 'Limit'],
  ['aggregate', 'Aggregate'],
  ['create', 'Create'],
  ['update', 'Update'],
  ['send', 'Send'],
  ['automation', 'Automation'],
  ['automate', 'Automate'],
  ['import', 'Import'],
  ['export', 'Export'],
  ['process', 'Process'],
  ['monitor', 'Monitor'],
  ['sync', 'Sync'],
  ['triggered', 'Triggered'],
  ['scheduled', 'Scheduled'],
  ['webhook', 'Webhook'],
  ['stopanderror', 'Stop And Error'],
  ['executecommand', 'Execute Command'],
  ['executeworkflow', 'Execute Workflow'],
  ['executiondata', 'Execution Data'],
  ['respondtowebhook', 'Respond To Webhook'],
  ['noop', 'No Op'],
  ['stickynote', 'Sticky Note'],
  ['itemlists', 'Item Lists'],
  ['comparedatasets', 'Compare Datasets'],
  ['debughelper', 'Debug Helper'],
  ['summarize', 'Summarize'],
  ['hackernews', 'Hacker News'],
  ['rssfeedread', 'RSS Feed Read'],
  ['readpdf', 'Read PDF'],
  ['openai', 'OpenAI'],
  ['humanticai', 'Humanatic AI'],
  ['awss3', 'AWS S3'],
  ['awssqs', 'AWS SQS'],
  ['awsrekognition', 'AWS Rekognition'],
  ['awstextract', 'AWS Textract'],
  ['gcp', 'Google Cloud Platform'],
  ['azure', 'Microsoft Azure'],
  ['crypto', 'Crypto'],
  ['coingecko', 'CoinGecko'],
  ['nasa', 'NASA'],
  ['openthesaurus', 'OpenThesaurus'],
  ['brandfetch', 'BrandFetch'],
  ['lingvanex', 'Lingvanex'],
  ['profitwell', 'ProfitWell'],
  ['spontit', 'Spontit'],
  ['signl4', 'SIGNL4'],
  ['uptimerobot', 'UptimeRobot'],
  ['mailcheck', 'MailCheck'],
  ['lemlist', 'Lemlist'],
  ['customerio', 'Customer.io'],
  ['sendgrid', 'SendGrid'],
  ['sendy', 'Sendy'],
  ['vero', 'Vero'],
  ['emelia', 'Emelia'],
  ['egoi', 'E-goi'],
  ['iterable', 'Iterable'],
  ['drift', 'Drift'],
  ['uplead', 'UpLead'],
  ['dropcontact', 'Dropcontact'],
  ['orbit', 'Orbit'],
  ['copper', 'Copper'],
  ['mautic', 'Mautic'],
  ['keap', 'Keap'],
  ['segment', 'Segment'],
  ['onfleet', 'Onfleet'],
  ['strava', 'Strava'],
  ['spotify', 'Spotify'],
  ['typeform', 'Typeform'],
  ['jotform', 'JotForm'],
  ['form', 'Form'],
  ['coda', 'Coda'],
  ['filemaker', 'FileMaker'],
  ['disqus', 'Disqus'],
  ['discourse', 'Discourse'],
  ['zulip', 'Zulip'],
  ['twake', 'Twake'],
  ['twist', 'Twist'],
  ['line', 'Line'],
  ['yourls', 'YOURLS'],
  ['flow', 'Flow'],
  ['start', 'Start'],
  ['error', 'Error'],
  ['bitwarden', 'Bitwarden'],
  ['nextcloud', 'Nextcloud'],
  ['dropbox', 'Dropbox'],
  ['box', 'Box'],
  ['compression', 'Compression'],
  ['xml', 'XML'],
  ['markdown', 'Markdown'],
  ['totp', 'TOTP'],
  ['ical', 'iCal'],
  ['html', 'HTML'],
  ['htmlextract', 'HTML Extract'],
  ['urlshorter', 'URL Shorter'],
  ['storyblok', 'Storyblok'],
  ['thehive', 'TheHive'],
  ['cortex', 'Cortex'],
  ['sentryio', 'Sentry.io'],
  ['pagerduty', 'PagerDuty'],
  ['kafka', 'Kafka'],
  ['rabbitmq', 'RabbitMQ'],
  ['gumroad', 'Gumroad'],
  ['uproc', 'uProc'],
  ['n8n', 'n8n'],
  ['n8ntrainingcustomerdatastore', 'n8n Training Customer Datastore'],
  ['n8ntrainingcustomermessenger', 'n8n Training Customer Messenger']
]);

export function generateWorkflowTitle(fileName: string): string {
  try {
    const nameParts = fileName.replace('.json', '').split('_').slice(1);
    if (nameParts.length === 0) return 'Workflow';
    
    return nameParts.map(part => {
      // First check if we have a direct mapping for this service/term
      const normalized = serviceNameMap.get(part.toLowerCase());
      if (normalized) {
        return normalized;
      }
      
      // Split camelCase and PascalCase words (e.g., "GoogleSheets" -> "Google Sheets")
      const spaced = part.replace(/([a-z])([A-Z])/g, '$1 $2');
      // Handle consecutive capitals (e.g., "HTTP" -> "HTTP")
      const spacedCaps = spaced.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
      // Capitalize first letter of each word
      return spacedCaps.replace(/\b\w/g, l => l.toUpperCase());
    }).join(' ');
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
    // Normalize service names in descriptions too
    const normalizedServices = services.map(service => 
      serviceNameMap.get(service.toLowerCase()) || service
    );
    const serviceList = normalizedServices.length > 0 ? normalizedServices.join(', ') : 'Unknown services';
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