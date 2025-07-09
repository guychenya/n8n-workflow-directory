import React, { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  Handle,
  Position,
  MiniMap,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

interface N8nNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: any;
  typeVersion?: number;
}

interface N8nWorkflow {
  nodes: N8nNode[];
  connections: any;
}

interface EnhancedWorkflowVisualizerProps {
  workflow: N8nWorkflow;
}

// Enhanced node component with more details
const EnhancedWorkflowNode: React.FC<{
  data: {
    label: string;
    type: string;
    icon: string;
    nodeType: string;
    details?: any;
  };
}> = ({ data }) => {
  const getNodeColor = (nodeType: string) => {
    const colorMap: Record<string, string> = {
      // Triggers
      'trigger': 'bg-gradient-to-r from-green-500 to-green-600',
      'webhook': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'schedule': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'cron': 'bg-gradient-to-r from-purple-500 to-purple-600',
      
      // Communication
      'gmail': 'bg-gradient-to-r from-red-500 to-red-600',
      'slack': 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      'telegram': 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      'discord': 'bg-gradient-to-r from-indigo-600 to-indigo-700',
      
      // Data & Storage
      'googlesheets': 'bg-gradient-to-r from-green-600 to-green-700',
      'airtable': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'notion': 'bg-gradient-to-r from-gray-700 to-gray-800',
      
      // Development
      'code': 'bg-gradient-to-r from-gray-600 to-gray-700',
      'function': 'bg-gradient-to-r from-purple-600 to-purple-700',
      'http': 'bg-gradient-to-r from-orange-500 to-orange-600',
      'httprequest': 'bg-gradient-to-r from-orange-500 to-orange-600',
      
      // Flow Control
      'if': 'bg-gradient-to-r from-pink-500 to-pink-600',
      'switch': 'bg-gradient-to-r from-pink-500 to-pink-600',
      'merge': 'bg-gradient-to-r from-teal-500 to-teal-600',
      'split': 'bg-gradient-to-r from-teal-500 to-teal-600',
      
      // Utilities
      'wait': 'bg-gradient-to-r from-amber-500 to-amber-600',
      'filter': 'bg-gradient-to-r from-lime-500 to-lime-600',
      'sort': 'bg-gradient-to-r from-lime-500 to-lime-600',
      'aggregate': 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    };

    const nodeTypeKey = nodeType.toLowerCase().replace('n8n-nodes-base.', '');
    return colorMap[nodeTypeKey] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getNodeSize = (nodeType: string) => {
    if (nodeType.includes('trigger') || nodeType.includes('webhook')) {
      return 'min-w-[180px] p-4';
    }
    return 'min-w-[160px] p-3';
  };

  const nodeColor = getNodeColor(data.nodeType);
  const nodeSize = getNodeSize(data.nodeType);

  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white shadow-lg"
      />
      
      <div className={`
        ${nodeColor} ${nodeSize} text-white rounded-xl shadow-lg border-2 border-white
        flex flex-col items-center text-center
        hover:shadow-2xl hover:scale-105 transition-all duration-200
        backdrop-blur-sm
      `}>
        <div className="text-2xl mb-2 drop-shadow-sm">{data.icon}</div>
        <div className="font-bold text-sm leading-tight break-words mb-1 text-shadow">
          {data.label}
        </div>
        <div className="text-xs opacity-90 font-medium">
          {data.type}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white shadow-lg"
      />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  enhancedWorkflowNode: EnhancedWorkflowNode,
};

// Auto-layout function using Dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ 
    rankdir: 'LR', 
    nodesep: 100, 
    ranksep: 150,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - 90,
      y: nodeWithPosition.y - 40,
    };
  });

  return { nodes, edges };
};

export const EnhancedWorkflowVisualizer: React.FC<EnhancedWorkflowVisualizerProps> = ({ 
  workflow 
}) => {
  const getNodeTypeIcon = (nodeType: string) => {
    const typeMap: Record<string, string> = {
      'n8n-nodes-base.manualTrigger': '🚀',
      'n8n-nodes-base.webhook': '🔗',
      'n8n-nodes-base.cron': '⏰',
      'n8n-nodes-base.schedule': '📅',
      'n8n-nodes-base.gmail': '📧',
      'n8n-nodes-base.slack': '💬',
      'n8n-nodes-base.telegram': '📱',
      'n8n-nodes-base.discord': '🎮',
      'n8n-nodes-base.googleSheets': '📊',
      'n8n-nodes-base.airtable': '🗂️',
      'n8n-nodes-base.notion': '📋',
      'n8n-nodes-base.http': '🌐',
      'n8n-nodes-base.httpRequest': '🌐',
      'n8n-nodes-base.code': '💻',
      'n8n-nodes-base.function': '⚙️',
      'n8n-nodes-base.functionItem': '🔧',
      'n8n-nodes-base.if': '❓',
      'n8n-nodes-base.switch': '🔀',
      'n8n-nodes-base.merge': '🔗',
      'n8n-nodes-base.split': '✂️',
      'n8n-nodes-base.aggregate': '📊',
      'n8n-nodes-base.filter': '🔍',
      'n8n-nodes-base.sort': '📏',
      'n8n-nodes-base.limit': '⏹️',
      'n8n-nodes-base.wait': '⏳',
      'n8n-nodes-base.stopAndError': '🛑',
      'n8n-nodes-base.noOp': '⚪',
      'n8n-nodes-base.executeWorkflow': '🔄',
      'n8n-nodes-base.respondToWebhook': '↩️',
    };
    
    return typeMap[nodeType] || '⚡';
  };

  const getNodeTypeName = (nodeType: string) => {
    return nodeType.replace('n8n-nodes-base.', '').replace(/([A-Z])/g, ' $1').trim();
  };

  const { nodes, edges } = useMemo(() => {
    const reactFlowNodes: Node[] = [];
    const reactFlowEdges: Edge[] = [];

    // Filter out sticky notes for the main flow
    const workflowNodes = workflow.nodes.filter(node => node.type !== 'n8n-nodes-base.stickyNote');

    // Convert n8n nodes to React Flow nodes
    workflowNodes.forEach((node) => {
      reactFlowNodes.push({
        id: node.id,
        type: 'enhancedWorkflowNode',
        position: { x: 0, y: 0 }, // Will be set by dagre
        data: {
          label: node.name,
          type: getNodeTypeName(node.type),
          icon: getNodeTypeIcon(node.type),
          nodeType: node.type,
          details: node.parameters,
        },
      });
    });

    // Convert n8n connections to React Flow edges
    if (workflow.connections) {
      Object.keys(workflow.connections).forEach(sourceNodeName => {
        const sourceNode = workflowNodes.find(node => node.name === sourceNodeName);
        if (!sourceNode) return;

        const connections = workflow.connections[sourceNodeName];
        Object.keys(connections).forEach(outputType => {
          const outputConnections = connections[outputType];
          if (Array.isArray(outputConnections)) {
            outputConnections.forEach((connectionGroup, outputIndex) => {
              if (Array.isArray(connectionGroup)) {
                connectionGroup.forEach((connection, connectionIndex) => {
                  const targetNode = workflowNodes.find(node => node.name === connection.node);
                  if (targetNode) {
                    reactFlowEdges.push({
                      id: `${sourceNode.id}-${targetNode.id}-${outputIndex}-${connectionIndex}`,
                      source: sourceNode.id,
                      target: targetNode.id,
                      type: 'smoothstep',
                      animated: true,
                      style: {
                        stroke: '#6366f1',
                        strokeWidth: 3,
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                      },
                      markerEnd: {
                        type: 'arrowclosed',
                        color: '#6366f1',
                        width: 20,
                        height: 20,
                      },
                    });
                  }
                });
              }
            });
          }
        });
      });
    }

    return getLayoutedElements(reactFlowNodes, reactFlowEdges);
  }, [workflow]);

  if (!workflow.nodes || workflow.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-slate-400">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <div>No workflow nodes to display</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false,
          minZoom: 0.5,
          maxZoom: 1.5,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.2}
        maxZoom={3}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={25} 
          size={2}
          color="#cbd5e1"
          className="dark:!bg-slate-800"
        />
        <Controls 
          className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg"
          showInteractive={false}
        />
        <MiniMap 
          className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg"
          maskColor="rgba(0, 0, 0, 0.1)"
          nodeColor={(node) => {
            const nodeType = node.data.nodeType;
            if (nodeType?.includes('trigger')) return '#10b981';
            if (nodeType?.includes('gmail')) return '#ef4444';
            if (nodeType?.includes('slack')) return '#6366f1';
            return '#64748b';
          }}
        />
      </ReactFlow>
    </div>
  );
};