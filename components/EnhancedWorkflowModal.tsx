import React, { useEffect, useState } from 'react';
import type { Workflow } from '../types';
import { EnhancedWorkflowVisualizer } from './EnhancedWorkflowVisualizer';
import { NodeCodeSnippet } from './NodeCodeSnippet';

interface EnhancedWorkflowModalProps {
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

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-text-light dark:text-text-dark">{title}</span>
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
          {children}
        </div>
      )}
    </div>
  );
};

export const EnhancedWorkflowModal: React.FC<EnhancedWorkflowModalProps> = ({ 
  workflow, 
  isOpen, 
  onClose 
}) => {
  const [workflowData, setWorkflowData] = useState<N8nWorkflow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'details'>('visual');
  const [selectedNode, setSelectedNode] = useState<N8nNode | null>(null);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);

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
      'n8n-nodes-base.manualTrigger': '🚀',
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
      'n8n-nodes-base.if': '❓',
      'n8n-nodes-base.merge': '🔗',
      'n8n-nodes-base.set': '⚙️',
      'n8n-nodes-base.stickyNote': '📝',
    };
    
    return typeMap[nodeType] || '⚡';
  };

  const getNodeTypeName = (nodeType: string) => {
    return nodeType.replace('n8n-nodes-base.', '').replace(/([A-Z])/g, ' $1').trim();
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

  const getNodesByType = () => {
    if (!workflowData?.nodes) return {};
    
    const nodesByType: Record<string, N8nNode[]> = {};
    workflowData.nodes.forEach(node => {
      if (node.type !== 'n8n-nodes-base.stickyNote') {
        const type = getNodeTypeName(node.type);
        if (!nodesByType[type]) {
          nodesByType[type] = [];
        }
        nodesByType[type].push(node);
      }
    });
    
    return nodesByType;
  };

  const handleNodeClick = (node: N8nNode) => {
    setSelectedNode(node);
    setShowCodeSnippet(true);
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[60vh] overflow-hidden
      backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95
      shadow-2xl shadow-black/30
      before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent before:pointer-events-none before:rounded-xl
      border border-white/20 dark:border-slate-600/30">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-slate-700 dark:to-slate-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
              {workflowData?.name || workflow.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
              <span className="flex items-center gap-1 bg-white dark:bg-slate-700 px-2 py-1 rounded-full">
                🏷️ {workflow.category}
              </span>
              <span className="flex items-center gap-1 bg-white dark:bg-slate-700 px-2 py-1 rounded-full">
                ⚡ {workflow.triggerType}
              </span>
              <span className="flex items-center gap-1 bg-white dark:bg-slate-700 px-2 py-1 rounded-full">
                🔧 {workflow.complexity}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex-1 px-4 py-2 font-medium transition-colors ${
              activeTab === 'visual'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-600 dark:text-slate-400 hover:text-primary'
            }`}
          >
            📊 Visual Flow
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-4 py-2 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-600 dark:text-slate-400 hover:text-primary'
            }`}
          >
            📋 Details & Info
          </button>
        </div>

        {/* Content */}
        <div className="p-3 overflow-y-auto max-h-[calc(60vh-140px)]">
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
              {/* Visual Tab */}
              {activeTab === 'visual' && (
                <div className="space-y-6">
                  <EnhancedWorkflowVisualizer workflow={workflowData} />
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{workflowData.nodes.length}</div>
                      <div className="text-sm text-gray-600 dark:text-slate-400">Total Nodes</div>
                    </div>
                    <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-secondary">{getTriggerNodes().length}</div>
                      <div className="text-sm text-gray-600 dark:text-slate-400">Triggers</div>
                    </div>
                    <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-accent">{getUniqueServices().length}</div>
                      <div className="text-sm text-gray-600 dark:text-slate-400">Services</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{workflow.services.length}</div>
                      <div className="text-sm text-gray-600 dark:text-slate-400">Integrations</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <CollapsibleSection title="Description" icon="📝" defaultOpen={true}>
                    <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                      {workflow.description}
                    </p>
                  </CollapsibleSection>

                  <CollapsibleSection title="Workflow Statistics" icon="📊" defaultOpen={true}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{workflowData.nodes.length}</div>
                        <div className="text-sm text-gray-600 dark:text-slate-400">Total Nodes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">{getTriggerNodes().length}</div>
                        <div className="text-sm text-gray-600 dark:text-slate-400">Triggers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{getUniqueServices().length}</div>
                        <div className="text-sm text-gray-600 dark:text-slate-400">Services</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{Object.keys(workflowData.connections || {}).length}</div>
                        <div className="text-sm text-gray-600 dark:text-slate-400">Connections</div>
                      </div>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Nodes by Type" icon="🔧">
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600 dark:text-slate-400 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        💡 <strong>Click on any node</strong> to view its configuration, parameters, and code snippet
                      </div>
                      {Object.entries(getNodesByType()).map(([type, nodes]) => (
                        <div key={type} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                          <h4 className="font-semibold text-text-light dark:text-text-dark mb-3 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                              {nodes.length}
                            </span>
                            {type}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {nodes.map((node) => (
                              <button
                                key={node.id}
                                onClick={() => handleNodeClick(node)}
                                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer border border-transparent hover:border-primary/30 group text-left"
                              >
                                <span className="text-lg">{getNodeTypeIcon(node.type)}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                                    {node.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                    {node.parameters && Object.keys(node.parameters).length > 0 
                                      ? `${Object.keys(node.parameters).length} parameters` 
                                      : 'No parameters'
                                    }
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400 dark:text-slate-500 group-hover:text-primary transition-colors">
                                  View Code →
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Required Services" icon="🔌">
                    <div className="flex flex-wrap gap-2">
                      {workflow.services.map(service => (
                        <span 
                          key={service}
                          className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-primary/10 text-primary border border-primary/20"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Workflow Tags" icon="🏷️">
                    <div className="flex flex-wrap gap-2">
                      {workflow.tags.length > 0 ? (
                        workflow.tags.map(tag => (
                          <span 
                            key={tag}
                            className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-slate-400">No tags available</span>
                      )}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Technical Details" icon="⚙️">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-slate-400">Workflow ID:</span>
                        <span className="text-gray-700 dark:text-slate-300 font-mono text-sm">{workflowData.id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-slate-400">File Name:</span>
                        <span className="text-gray-700 dark:text-slate-300 font-mono text-sm">{workflow.fileName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-slate-400">Trigger Type:</span>
                        <span className="text-gray-700 dark:text-slate-300">{workflow.triggerType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-slate-400">Complexity:</span>
                        <span className="text-gray-700 dark:text-slate-300">{workflow.complexity}</span>
                      </div>
                    </div>
                  </CollapsibleSection>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-2 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 min-h-[50px] flex-shrink-0">
          <div className="text-xs text-gray-600 dark:text-slate-400 truncate">
            {workflow.fileName}
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <a
              href={`/workflows/${workflow.fileName}`}
              download={workflow.fileName}
              className="px-2 py-1 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200 rounded hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors font-medium flex items-center gap-1 text-xs whitespace-nowrap"
            >
              📥 Download
            </a>
            <button
              onClick={onClose}
              className="px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors font-medium text-xs whitespace-nowrap"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Node Code Snippet Modal */}
      {selectedNode && (
        <NodeCodeSnippet 
          node={selectedNode}
          isOpen={showCodeSnippet}
          onClose={() => {
            setShowCodeSnippet(false);
            setSelectedNode(null);
          }}
        />
      )}
    </div>
  );
};