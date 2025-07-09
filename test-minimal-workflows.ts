import type { Workflow } from './types';

// Create a minimal test set of workflows to see if the basic structure works
export const workflows: Workflow[] = [
  {
    id: 1,
    title: "Test Workflow 1",
    description: "A test workflow to verify the app is working",
    category: "Communication",
    fileName: "0001_Test_Workflow.json",
    services: ["Slack", "Gmail"],
    triggerType: "Manual",
    operation: "Send",
    complexity: "Simple",
    tags: ["Slack", "Gmail", "Manual", "Send", "Simple"]
  },
  {
    id: 2,
    title: "Test Workflow 2", 
    description: "Another test workflow",
    category: "Data & Analytics",
    fileName: "0002_Test_Workflow.json",
    services: ["GoogleSheets", "Airtable"],
    triggerType: "Scheduled",
    operation: "Update",
    complexity: "Advanced",
    tags: ["GoogleSheets", "Airtable", "Scheduled", "Update", "Advanced"]
  },
  {
    id: 3,
    title: "Test Workflow 3",
    description: "Third test workflow",
    category: "Development", 
    fileName: "0003_Test_Workflow.json",
    services: ["GitHub", "Slack"],
    triggerType: "Webhook",
    operation: "Create",
    complexity: "Multi-step",
    tags: ["GitHub", "Slack", "Webhook", "Create", "Multi-step"]
  }
];

console.log('Minimal workflows loaded:', workflows.length);