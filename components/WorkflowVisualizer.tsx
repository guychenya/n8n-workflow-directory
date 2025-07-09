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
} from 'reactflow';
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

interface WorkflowVisualizerProps {
  workflow: N8nWorkflow;
}

// Custom node component that looks like n8n nodes
const WorkflowNode: React.FC<{
  data: {
    label: string;
    type: string;
    icon: string;
    nodeType: string;
  };
}> = ({ data }) => {
  const getNodeColor = (nodeType: string) => {
    if (nodeType.includes('trigger') || nodeType.includes('webhook')) return 'bg-green-500';
    if (nodeType.includes('gmail') || nodeType.includes('email')) return 'bg-red-500';
    if (nodeType.includes('slack') || nodeType.includes('telegram')) return 'bg-blue-500';
    if (nodeType.includes('googleSheets') || nodeType.includes('airtable')) return 'bg-yellow-500';
    if (nodeType.includes('code') || nodeType.includes('function')) return 'bg-purple-500';
    if (nodeType.includes('http') || nodeType.includes('webhook')) return 'bg-orange-500';
    if (nodeType.includes('if') || nodeType.includes('switch')) return 'bg-pink-500';
    return 'bg-gray-500';
  };

  const nodeColor = getNodeColor(data.nodeType);

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
      
      <div className={`
        ${nodeColor} text-white rounded-lg shadow-lg border-2 border-white
        min-w-[160px] p-3 flex flex-col items-center text-center
        hover:shadow-xl transition-shadow
      `}>
        <div className="text-2xl mb-1">{data.icon}</div>
        <div className="font-semibold text-sm leading-tight break-words">
          {data.label}
        </div>
        <div className="text-xs opacity-75 mt-1">
          {data.type}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
};

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ workflow }) => {
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
      'n8n-nodes-base.httpRequest': '🌐',
      'n8n-nodes-base.code': '💻',
      'n8n-nodes-base.function': '⚙️',
      'n8n-nodes-base.functionItem': '⚙️',
      'n8n-nodes-base.if': '🔀',
      'n8n-nodes-base.switch': '🔀',
      'n8n-nodes-base.merge': '🔗',
      'n8n-nodes-base.set': '⚙️',
      'n8n-nodes-base.split': '✂️',
      'n8n-nodes-base.aggregate': '📊',
      'n8n-nodes-base.filter': '🔍',
      'n8n-nodes-base.sort': '📏',
      'n8n-nodes-base.limit': '⏹️',
      'n8n-nodes-base.wait': '⏳',
      'n8n-nodes-base.stopAndError': '❌',
      'n8n-nodes-base.noOp': '⚪',
      'n8n-nodes-base.stickyNote': '📝',
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
    workflowNodes.forEach((node, index) => {
      reactFlowNodes.push({
        id: node.id,
        type: 'workflowNode',
        position: {
          x: node.position[0] + 500, // Offset to center better
          y: node.position[1] + 300,
        },
        data: {
          label: node.name,
          type: getNodeTypeName(node.type),
          icon: getNodeTypeIcon(node.type),
          nodeType: node.type,
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
                connectionGroup.forEach(connection => {
                  const targetNode = workflowNodes.find(node => node.name === connection.node);
                  if (targetNode) {
                    reactFlowEdges.push({
                      id: `${sourceNode.id}-${targetNode.id}-${outputIndex}`,
                      source: sourceNode.id,
                      target: targetNode.id,
                      type: 'smoothstep',
                      animated: true,
                      style: {
                        stroke: '#64748b',
                        strokeWidth: 2,
                      },
                      markerEnd: {
                        type: 'arrowclosed',
                        color: '#64748b',
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

    return { nodes: reactFlowNodes, edges: reactFlowEdges };
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
    <div className="h-[500px] w-full border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#e2e8f0"
          className="dark:!bg-slate-800"
        />
        <Controls 
          className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg"
        />
      </ReactFlow>
    </div>
  );
};