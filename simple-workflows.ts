import type { Workflow } from './types';

// Simple workflow generator without complex categorization
function createSimpleWorkflow(id: number, fileName: string): Workflow {
  // Extract basic info from filename
  const nameParts = fileName.replace('.json', '').split('_').slice(1);
  const title = nameParts.map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  ).join(' ');
  
  // Simple categorization
  const firstService = nameParts[0] || 'Unknown';
  let category = 'Other';
  
  // Basic category mapping
  if (['Telegram', 'Slack', 'Gmail', 'Discord'].some(s => fileName.includes(s))) category = 'Communication';
  else if (['GoogleSheets', 'Airtable', 'Notion'].some(s => fileName.includes(s))) category = 'Data & Analytics';
  else if (['HubSpot', 'Pipedrive', 'Zendesk'].some(s => fileName.includes(s))) category = 'CRM & Sales';
  else if (['Shopify', 'Stripe', 'WooCommerce'].some(s => fileName.includes(s))) category = 'E-commerce';
  else if (['GitHub', 'GitLab', 'N8N'].some(s => fileName.includes(s))) category = 'Development';
  
  const triggerType = fileName.includes('Manual') ? 'Manual' : 
                     fileName.includes('Scheduled') ? 'Scheduled' :
                     fileName.includes('Webhook') ? 'Webhook' : 'Event';
  
  const operation = fileName.includes('Create') ? 'Create' :
                   fileName.includes('Update') ? 'Update' :
                   fileName.includes('Send') ? 'Send' : 'Automate';

  return {
    id,
    title,
    description: `${operation} workflow integrating ${firstService}. This workflow is triggered ${triggerType.toLowerCase()}.`,
    category,
    fileName,
    services: [firstService],
    triggerType,
    operation,
    complexity: 'Simple',
    tags: [firstService, triggerType, operation, 'Simple']
  };
}

// Generate workflows from the first 100 workflow files (to test with manageable size)
const workflowFiles = [
  '0001_Telegram_Schedule_Automation_Scheduled.json',
  '0002_Manual_Totp_Automation_Triggered.json',
  '0003_Bitwarden_Automate.json',
  '0004_GoogleSheets_Typeform_Automate_Triggered.json',
  '0005_Manual_Twitter_Create_Triggered.json',
  '0006_Openweathermap_Cron_Automate_Scheduled.json',
  '0007_Manual_Todoist_Create_Triggered.json',
  '0008_Slack_Stripe_Create_Triggered.json',
  '0009_Process.json',
  '0010_Writebinaryfile_Create.json',
  '0011_Manual_Copper_Automate_Triggered.json',
  '0012_Manual_Copper_Automate_Triggered.json',
  '0013_Manual_Noop_Import_Triggered.json',
  '0014_Manual_Coda_Create_Triggered.json',
  '0015_HTTP_Cron_Update_Webhook.json',
  '0016_Manual_Googleslides_Automate_Triggered.json',
  '0017_Mattermost_Emelia_Automate_Triggered.json',
  '0018_Manual_Chargebee_Create_Triggered.json',
  '0019_Manual_Uproc_Send_Triggered.json',
  '0020_Mattermost_Emelia_Automate_Triggered.json',
  '0021_HTTP_Awssqs_Automation_Scheduled.json',
  '0022_Manual_Webflow_Automate_Triggered.json',
  '0023_HTTP_Googlebigquery_Automation_Scheduled.json',
  '0024_Manual_Clearbit_Send_Triggered.json',
  '0025_Manual_Uproc_Automation_Triggered.json',
  '0026_Mailcheck_Airtable_Monitor.json',
  '0027_Mattermost_N8N_Automate_Triggered.json',
  '0028_Mattermost_Workflow_Automate_Webhook.json',
  '0029_Manual_Orbit_Create_Triggered.json',
  '0030_Manual_Clickup_Create_Triggered.json'
];

export const workflows: Workflow[] = workflowFiles.map((fileName, index) => 
  createSimpleWorkflow(index + 1, fileName)
);

console.log('Simple workflows loaded:', workflows.length);