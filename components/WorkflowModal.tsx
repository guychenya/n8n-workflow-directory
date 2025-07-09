import React, { useEffect, useState } from 'react';
import type { Workflow } from '../types';

interface WorkflowModalProps {
  workflow: Workflow | null;
  isOpen: boolean;
  onClose: () => void;
}

interface N8nNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: any;
  typeVersion?: number;
}

interface N8nWorkflow {
  id?: string;
  name: string;
  nodes: N8nNode[];
  connections: any;
  settings?: any;
  tags?: string[];
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({ workflow, isOpen, onClose }) => {
  const [workflowData, setWorkflowData] = useState<N8nWorkflow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && workflow) {
      loadWorkflowData();
    }
  }, [isOpen, workflow]);

  const loadWorkflowData = async () => {
    if (!workflow) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/workflows/${workflow.fileName}`);
      if (!response.ok) {
        throw new Error('Failed to load workflow data');
      }
      const data = await response.json();
      setWorkflowData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflow');
    } finally {
      setLoading(false);
    }
  };

  const getNodeTypeIcon = (nodeType: string) => {
    const typeMap: Record<string, string> = {
      'n8n-nodes-base.manualTrigger': '👆',
      'n8n-nodes-base.webhook': '🔗',
      'n8n-nodes-base.cron': '⏰',
      'n8n-nodes-base.schedule': '📅',
      'n8n-nodes-base.gmail': '📧',
      'n8n-nodes-base.slack': '💬',
      'n8n-nodes-base.telegram': '📱',
      'n8n-nodes-base.googleSheets': '📊',
      'n8n-nodes-base.airtable': '🗂️',
      'n8n-nodes-base.http': '🌐',
      'n8n-nodes-base.code': '💻',
      'n8n-nodes-base.if': '🔀',
      'n8n-nodes-base.merge': '🔗',
      'n8n-nodes-base.set': '⚙️',
      'n8n-nodes-base.stickyNote': '📝',
    };
    
    return typeMap[nodeType] || '⚡';
  };

  const getNodeTypeName = (nodeType: string) => {
    return nodeType.replace('n8n-nodes-base.', '').replace(/([A-Z])/g, ' $1').trim();
  };

  const getUniqueServices = () => {
    if (!workflowData?.nodes) return [];
    
    const services = new Set<string>();
    workflowData.nodes.forEach(node => {
      const service = node.type.replace('n8n-nodes-base.', '');
      if (service !== 'stickyNote' && service !== 'noOp') {
        services.add(service);
      }
    });
    
    return Array.from(services);
  };

  const getTriggerNodes = () => {
    if (!workflowData?.nodes) return [];
    
    return workflowData.nodes.filter(node => 
      node.type.includes('trigger') || 
      node.type.includes('webhook') ||
      node.type.includes('cron') ||
      node.type.includes('schedule')
    );
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !workflow) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
              {workflowData?.name || workflow.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                🏷️ {workflow.category}
              </span>
              <span className="flex items-center gap-1">
                ⚡ {workflow.triggerType}
              </span>
              <span className="flex items-center gap-1">
                🔧 {workflow.complexity}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600 dark:text-slate-400">Loading workflow...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-2">Failed to load workflow</div>
              <div className="text-gray-500 dark:text-slate-400 text-sm">{error}</div>
            </div>
          )}

          {workflowData && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3">Description</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {workflow.description}
                </p>
              </div>

              {/* Workflow Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{workflowData.nodes.length}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Total Nodes</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-secondary">{getTriggerNodes().length}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Triggers</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-accent">{getUniqueServices().length}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Services</div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{workflow.services.length}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Integrations</div>
                </div>
              </div>

              {/* Nodes Grid */}
              <div>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3">Workflow Nodes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {workflowData.nodes
                    .filter(node => node.type !== 'n8n-nodes-base.stickyNote')
                    .map((node, index) => (
                    <div 
                      key={node.id} 
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600"
                    >
                      <div className="text-2xl">{getNodeTypeIcon(node.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-text-light dark:text-text-dark truncate">
                          {node.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-400 truncate">
                          {getNodeTypeName(node.type)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-slate-500">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3">Required Services</h3>
                <div className="flex flex-wrap gap-2">
                  {workflow.services.map(service => (
                    <span 
                      key={service}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {workflow.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {workflow.tags.map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
          <div className="text-sm text-gray-600 dark:text-slate-400">
            File: {workflow.fileName}
          </div>
          <div className="flex gap-3">
            <a
              href={`/workflows/${workflow.fileName}`}
              download={workflow.fileName}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors font-medium"
            >
              Download JSON
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};