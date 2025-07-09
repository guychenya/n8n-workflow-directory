import React, { useState } from 'react';
import type { Workflow } from '../types';
import { DownloadIcon } from './icons';
import { WorkflowModal } from './WorkflowModal';

interface WorkflowCardProps {
  workflow: Workflow;
}

const categoryColors: Record<string, string> = {
  'Communication': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Data & Analytics': 'bg-green-500/20 text-green-400 border-green-500/30',
  'CRM & Sales': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'E-commerce': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Productivity': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Development': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'Marketing': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Content': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Integration': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Automation': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
};

const complexityColors: Record<string, string> = {
  'Simple': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Advanced': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Multi-step': 'bg-red-500/10 text-red-400 border-red-500/20'
};

const triggerIcons: Record<string, string> = {
  'Manual': '👆',
  'Webhook': '🔗',
  'Scheduled': '⏰',
  'Event': '⚡',
  'HTTP': '🌐'
};

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow }) => {
  const { title, description, category, fileName, services, triggerType, operation, complexity, tags } = workflow;
  const downloadUrl = `/workflows/${fileName}`;
  const categoryColor = categoryColors[category] || categoryColors['Integration'];
  const complexityColor = complexityColors[complexity] || complexityColors['Simple'];
  const triggerIcon = triggerIcons[triggerType] || '🔧';
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="group bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl border border-gray-200 dark:border-slate-700/50 hover:border-primary/30 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
      {/* Header with category and complexity */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColor}`}>
            {category}
          </span>
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${complexityColor}`}>
            {complexity}
          </span>
        </div>
        
        {/* Trigger type and operation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            {triggerIcon} {triggerType}
          </span>
          <span className="text-gray-400 dark:text-slate-600">•</span>
          <span>{operation}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold text-text-light dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
        <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity mb-2">
          👆 Click to view workflow details
        </div>
        
        {/* Services */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {services.slice(0, 3).map(service => (
              <span key={service} className="inline-block bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300 text-xs px-2 py-1 rounded border border-gray-200 dark:border-slate-600/50">
                {service}
              </span>
            ))}
            {services.length > 3 && (
              <span className="inline-block bg-gray-100 dark:bg-slate-700/50 text-gray-500 dark:text-slate-400 text-xs px-2 py-1 rounded border border-gray-200 dark:border-slate-600/50">
                +{services.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 4).map(tag => (
            <span key={tag} className="inline-block bg-gray-100 dark:bg-slate-700/30 text-gray-600 dark:text-slate-400 text-xs px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="inline-block bg-gray-100 dark:bg-slate-700/30 text-gray-600 dark:text-slate-400 text-xs px-2 py-1 rounded">
              +{tags.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer with download button */}
      <div className="bg-gray-50 dark:bg-slate-800/50 p-4 mt-auto border-t border-gray-200 dark:border-slate-700/50">
        <a
          href={downloadUrl}
          download={fileName}
          onClick={(e) => e.stopPropagation()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold py-3 px-4 rounded-md hover:from-primary/90 hover:to-primary/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-800 focus:ring-primary shadow-lg hover:shadow-xl"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Download Workflow</span>
        </a>
      </div>
      </div>

      {/* Workflow Preview Modal */}
      <WorkflowModal 
        workflow={workflow}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};