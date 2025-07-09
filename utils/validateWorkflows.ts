// Utility functions to validate and filter workflow files

// Known empty or invalid workflow files (to be excluded)
const emptyWorkflowFiles = new Set([
  'workflows/1290_Automation.json', // Contains only {}
  // Add more known empty files here as they're discovered
]);

// Files that are too generic or don't contain meaningful workflow data
const genericWorkflowFiles = new Set([
  'workflows/0009_Process.json', // Too generic
  // Add more generic files that don't provide value
]);

// Check if a workflow file should be excluded
export function shouldExcludeWorkflow(filePath: string): boolean {
  // Exclude known empty files
  if (emptyWorkflowFiles.has(filePath)) {
    return true;
  }
  
  // Exclude overly generic files
  if (genericWorkflowFiles.has(filePath)) {
    return true;
  }
  
  // Extract filename for pattern checks
  const fileName = filePath.split('/').pop() || '';
  
  // Exclude files that don't follow the expected naming pattern
  if (!fileName.match(/^\d+_.*\.json$/)) {
    return true;
  }
  
  // Exclude files that are just numbers (likely empty or test files)
  if (fileName.match(/^\d+\.json$/)) {
    return true;
  }
  
  // Exclude files with suspicious patterns
  const suspiciousPatterns = [
    /^\d+_test/i,        // Test files
    /^\d+_example/i,     // Example files
    /^\d+_empty/i,       // Empty files
    /^\d+_temp/i,        // Temporary files
    /^\d+_draft/i,       // Draft files
    /^\d+_\.json$/,      // Files with just number and underscore
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(fileName));
}

// Validate that a workflow has meaningful content based on filename
export function validateWorkflowFromFilename(fileName: string): boolean {
  // Remove .json extension and split by underscore
  const nameParts = fileName.replace('.json', '').split('_');
  
  // Must have at least 2 parts after number (service and action)
  if (nameParts.length < 3) {
    return false;
  }
  
  // Remove the number part
  const workflowParts = nameParts.slice(1);
  
  // Check if it contains at least one recognizable service or action
  const recognizedServices = [
    'Telegram', 'Slack', 'Discord', 'Gmail', 'GitHub', 'GoogleSheets',
    'Airtable', 'Notion', 'HubSpot', 'Shopify', 'Stripe', 'Trello',
    'Asana', 'Twitter', 'Facebook', 'LinkedIn', 'WordPress', 'HTTP',
    'Manual', 'Webhook', 'Cron', 'Schedule', 'Automation', 'Bitwarden',
    'Typeform', 'Todoist', 'Openweathermap', 'Mattermost', 'Webflow',
    'Calendly', 'Pipedrive', 'Zendesk', 'Mailchimp', 'Activecampaign'
  ];
  
  const hasRecognizedService = workflowParts.some(part => 
    recognizedServices.some(service => 
      part.toLowerCase().includes(service.toLowerCase())
    )
  );
  
  return hasRecognizedService;
}

// Filter function to remove invalid workflows from the list
export function filterValidWorkflows(workflowPaths: string[]): string[] {
  console.log('Filtering workflows...', workflowPaths.length, 'total');
  
  const validWorkflows = workflowPaths.filter(filePath => {
    // Check if should be excluded
    if (shouldExcludeWorkflow(filePath)) {
      console.log('Excluding workflow:', filePath);
      return false;
    }
    
    // Validate filename structure
    const fileName = filePath.split('/').pop() || '';
    if (!validateWorkflowFromFilename(fileName)) {
      console.log('Invalid workflow filename:', fileName);
      return false;
    }
    
    return true;
  });
  
  console.log('Filtered workflows:', validWorkflows.length, 'valid out of', workflowPaths.length, 'total');
  
  return validWorkflows;
}