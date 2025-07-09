
import React from 'react';
import type { Workflow } from '../types';
import { WorkflowCard } from './WorkflowCard';

interface WorkflowGridProps {
  workflows: Workflow[];
}

export const WorkflowGrid: React.FC<WorkflowGridProps> = ({ workflows }) => {
  if (workflows.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <h3 className="text-xl font-semibold text-slate-200">No Workflows Found</h3>
        <p className="text-slate-400 mt-2">Try selecting a different category.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {workflows.map(workflow => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
};
