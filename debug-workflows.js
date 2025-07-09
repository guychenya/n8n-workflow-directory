// Debug script to test workflow imports
import { workflows } from './data/workflows.ts';

console.log('Testing workflow imports...');
console.log('Total workflows:', workflows.length);

if (workflows.length > 0) {
  console.log('First workflow:', workflows[0]);
  console.log('Sample workflow structure:', {
    id: workflows[0].id,
    title: workflows[0].title,
    category: workflows[0].category,
    services: workflows[0].services,
    triggerType: workflows[0].triggerType
  });
} else {
  console.log('ERROR: No workflows loaded!');
}

// Test first few workflows
console.log('\nFirst 3 workflows:');
for (let i = 0; i < Math.min(3, workflows.length); i++) {
  console.log(`${i + 1}. ${workflows[i].title} (${workflows[i].category})`);
}