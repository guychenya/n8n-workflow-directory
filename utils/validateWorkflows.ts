// Utility functions to validate and filter workflow files

// Known truly empty or invalid workflow files (to be excluded)
const emptyWorkflowFiles = new Set([
  'workflows/1290_Automation.json', // Contains only {}
  // Add more known empty files here as they're discovered
]);

// Check if a workflow file should be excluded
export function shouldExcludeWorkflow(filePath: string): boolean {
  // Only exclude known truly empty files (like files with just '{}')
  if (emptyWorkflowFiles.has(filePath)) {
    return true;
  }
  
  // Extract filename for pattern checks
  const fileName = filePath.split('/').pop() || '';
  
  // Only exclude files that don't follow the expected naming pattern
  if (!fileName.match(/^\d+_.*\.json$/) && !fileName.match(/^[a-z_]+\.json$/)) {
    return true;
  }
  
  // Exclude files that are just numbers (likely empty or test files)
  if (fileName.match(/^\d+\.json$/)) {
    return true;
  }
  
  return false;
}

// Validate that a workflow has meaningful content based on filename
export function validateWorkflowFromFilename(fileName: string): boolean {
  // Accept all .json files - they're all valid workflow files
  // Even files with empty nodes arrays are valid templates
  return fileName.endsWith('.json');
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