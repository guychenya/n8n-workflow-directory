import React, { useState, useEffect } from 'react';

interface N8nNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: any;
  typeVersion?: number;
  credentials?: any;
}

interface NodeCodeSnippetProps {
  node: N8nNode;
  isOpen: boolean;
  onClose: () => void;
}

export const NodeCodeSnippet: React.FC<NodeCodeSnippetProps> = ({ node, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      const codeText = JSON.stringify(node, null, 2);
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Handle ESC key to close only this modal (prevent bubbling to parent)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.stopPropagation(); // Prevent event from bubbling to parent modal
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown, true); // Use capture phase
      return () => document.removeEventListener('keydown', handleKeyDown, true);
    }
  }, [isOpen, onClose]);

  const formatNodeData = (node: N8nNode) => {
    // Create a clean version of the node data for display
    const cleanNode = {
      id: node.id,
      name: node.name,
      type: node.type,
      typeVersion: node.typeVersion || 1,
      position: node.position,
      parameters: node.parameters || {},
      ...(node.credentials && { credentials: node.credentials })
    };

    return JSON.stringify(cleanNode, null, 2);
  };

  const getNodeDescription = (nodeType: string) => {
    const descriptions: Record<string, string> = {
      'n8n-nodes-base.manualTrigger': 'Manual trigger - Starts workflow when manually executed',
      'n8n-nodes-base.webhook': 'Webhook trigger - Receives HTTP requests to start workflow',
      'n8n-nodes-base.cron': 'Cron trigger - Runs workflow on schedule using cron expression',
      'n8n-nodes-base.schedule': 'Schedule trigger - Runs workflow at specified intervals',
      'n8n-nodes-base.gmail': 'Gmail integration - Send and receive emails',
      'n8n-nodes-base.slack': 'Slack integration - Send messages and interact with Slack',
      'n8n-nodes-base.telegram': 'Telegram bot - Send messages via Telegram',
      'n8n-nodes-base.googleSheets': 'Google Sheets - Read and write spreadsheet data',
      'n8n-nodes-base.airtable': 'Airtable - Manage database records',
      'n8n-nodes-base.http': 'HTTP Request - Make HTTP calls to APIs',
      'n8n-nodes-base.httpRequest': 'HTTP Request - Make HTTP calls to APIs',
      'n8n-nodes-base.code': 'Code node - Execute custom JavaScript code',
      'n8n-nodes-base.function': 'Function node - Execute custom JavaScript functions',
      'n8n-nodes-base.functionItem': 'Function Item - Process individual items with code',
      'n8n-nodes-base.if': 'IF condition - Route workflow based on conditions',
      'n8n-nodes-base.switch': 'Switch - Route workflow based on multiple conditions',
      'n8n-nodes-base.merge': 'Merge - Combine data from multiple sources',
      'n8n-nodes-base.split': 'Split - Split data into multiple items',
      'n8n-nodes-base.aggregate': 'Aggregate - Combine multiple items into one',
      'n8n-nodes-base.filter': 'Filter - Filter items based on conditions',
      'n8n-nodes-base.sort': 'Sort - Sort items by specified criteria',
      'n8n-nodes-base.limit': 'Limit - Limit number of items passed through',
      'n8n-nodes-base.wait': 'Wait - Pause workflow execution',
      'n8n-nodes-base.stopAndError': 'Stop and Error - Stop workflow with error',
      'n8n-nodes-base.noOp': 'No Operation - Pass through without changes',
      'n8n-nodes-base.executeWorkflow': 'Execute Workflow - Run another workflow',
      'n8n-nodes-base.respondToWebhook': 'Respond to Webhook - Send response to webhook',
    };

    return descriptions[nodeType] || 'N8n workflow node';
  };

  if (!isOpen) return null;

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
            <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
              {node.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {getNodeDescription(node.type)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
            aria-label="Close code snippet"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Node Info */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-text-light dark:text-text-dark mb-2">Node Type</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-mono bg-gray-100 dark:bg-slate-700 p-2 rounded">
                {node.type}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text-light dark:text-text-dark mb-2">Position</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-mono bg-gray-100 dark:bg-slate-700 p-2 rounded">
                [{node.position[0]}, {node.position[1]}]
              </p>
            </div>
          </div>

          {/* Parameters Section */}
          {node.parameters && Object.keys(node.parameters).length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-text-light dark:text-text-dark mb-3">Parameters</h4>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                {Object.entries(node.parameters).map(([key, value]) => (
                  <div key={key} className="mb-3 last:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-primary">{key}:</span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        {typeof value}
                      </span>
                    </div>
                    <div className="ml-4 text-sm text-gray-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-800 p-2 rounded border max-h-20 overflow-y-auto">
                      {typeof value === 'object' 
                        ? JSON.stringify(value, null, 2) 
                        : String(value)
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Credentials Section */}
          {node.credentials && (
            <div className="mb-6">
              <h4 className="font-semibold text-text-light dark:text-text-dark mb-3">Credentials</h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-600 dark:text-yellow-400">🔐</span>
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Credentials Required
                  </span>
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300 font-mono">
                  {JSON.stringify(node.credentials, null, 2)}
                </div>
              </div>
            </div>
          )}

          {/* Full Node JSON */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-text-light dark:text-text-dark">Complete Node Configuration</h4>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900 dark:bg-slate-900 text-green-400 font-mono text-sm p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
              <pre>{formatNodeData(node)}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};