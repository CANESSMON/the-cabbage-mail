import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Workflow, Plus, ArrowDown, Trash2, ChevronRight,
  Play, Settings, Zap, Mail, Clock
} from 'lucide-react';
import {
  NODE_TYPES, TRIGGER_TYPES, ACTION_TYPES, DELAY_TYPES,
  createNode, AUTOMATION_TEMPLATES, getWorkflowStats,
} from '../services/automationEngine';

const NODE_STYLES = {
  [NODE_TYPES.TRIGGER]: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-950', icon: Zap },
  [NODE_TYPES.ACTION]: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900', icon: Mail },
  [NODE_TYPES.DELAY]: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800', icon: Clock },
  [NODE_TYPES.CONDITION]: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800', icon: Settings },
};

function WorkflowNode({ node, onDelete, onUpdate, isFirst }) {
  const [expanded, setExpanded] = useState(false);
  const style = NODE_STYLES[node.nodeType] || NODE_STYLES[NODE_TYPES.ACTION];
  const Icon = style.icon;

  return (
    <div className="flex flex-col items-center">
      {!isFirst && (
        <div className="flex flex-col items-center py-1">
          <div className="w-px h-4 bg-slate-300" />
          <ArrowDown className="w-3 h-3 text-slate-400" />
          <div className="w-px h-1 bg-slate-300" />
        </div>
      )}
      <div className={`w-full max-w-md ${style.bg} border ${style.border} rounded-xl overflow-hidden shadow-sm transition-all group`}>
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 ${style.text}`}>
              <Icon className="w-4 h-4 text-slate-900" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-slate-950 truncate">{node.config.label}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{node.nodeType}</div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 text-slate-400 hover:text-rose-600 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </div>
        </div>

        {expanded && (
          <div className="px-4 pb-3 border-t border-slate-200 pt-2 space-y-2 bg-white">
            <div className="space-y-1">
              <label className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider">Label</label>
              <input
                type="text"
                value={node.config.label}
                onChange={(e) => onUpdate({ ...node, config: { ...node.config, label: e.target.value } })}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-950 focus:outline-none focus:border-slate-400"
              />
            </div>
            {node.nodeType === NODE_TYPES.DELAY && (
              <div className="flex space-x-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-semibold text-slate-600 uppercase">Duration</label>
                  <input type="number" value={node.config.duration || 1} onChange={(e) => onUpdate({ ...node, config: { ...node.config, duration: parseInt(e.target.value) } })} className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-950 focus:outline-none focus:border-slate-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-semibold text-slate-600 uppercase">Unit</label>
                  <select value={node.config.unit || 'days'} onChange={(e) => onUpdate({ ...node, config: { ...node.config, unit: e.target.value } })} className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-950 focus:outline-none focus:border-slate-400">
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
              </div>
            )}
            {node.nodeType === NODE_TYPES.ACTION && node.subType?.id === 'send_email' && (
              <div className="space-y-1">
                <label className="text-[9px] font-semibold text-slate-600 uppercase">Template Name</label>
                <input type="text" value={node.config.templateName || ''} onChange={(e) => onUpdate({ ...node, config: { ...node.config, templateName: e.target.value } })} className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-950 focus:outline-none focus:border-slate-400" />
              </div>
            )}
            {node.nodeType === NODE_TYPES.ACTION && (node.subType?.id === 'add_tag' || node.subType?.id === 'remove_tag') && (
              <div className="space-y-1">
                <label className="text-[9px] font-semibold text-slate-600 uppercase">Tag Name</label>
                <input type="text" value={node.config.tagName || ''} onChange={(e) => onUpdate({ ...node, config: { ...node.config, tagName: e.target.value } })} className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-950 focus:outline-none focus:border-slate-400" />
              </div>
            )}
            <p className="text-[10px] text-slate-500 italic">{node.subType?.description || ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddNodeMenu({ onAdd }) {
  const [open, setOpen] = useState(false);

  const categories = [
    { label: 'Actions', items: Object.values(ACTION_TYPES).map(t => ({ ...t, nodeType: NODE_TYPES.ACTION })) },
    { label: 'Timing', items: Object.values(DELAY_TYPES).map(t => ({ ...t, nodeType: NODE_TYPES.DELAY })) },
  ];

  return (
    <div className="relative flex flex-col items-center py-1">
      <div className="w-px h-3 bg-slate-300" />
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-full bg-white border border-slate-300 hover:border-black flex items-center justify-center text-slate-700 hover:text-black transition-colors shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-2 w-56">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="text-[9px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">{cat.label}</div>
                {cat.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { onAdd(item.nodeType, item); setOpen(false); }}
                    className="w-full text-left flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-950">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AutomationBuilder() {
  const [workflows, setWorkflows] = useState(AUTOMATION_TEMPLATES);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  const addNode = (nodeType, subType) => {
    if (!activeWorkflow) return;
    const node = createNode(nodeType, subType);
    const updated = workflows.map(w =>
      w.id === activeWorkflow.id ? { ...w, nodes: [...w.nodes, node] } : w
    );
    setWorkflows(updated);
    setActiveWorkflow({ ...activeWorkflow, nodes: [...activeWorkflow.nodes, node] });
  };

  const updateNode = (nodeIndex, updated) => {
    const newNodes = [...activeWorkflow.nodes];
    newNodes[nodeIndex] = updated;
    const updatedWorkflows = workflows.map(w =>
      w.id === activeWorkflow.id ? { ...w, nodes: newNodes } : w
    );
    setWorkflows(updatedWorkflows);
    setActiveWorkflow({ ...activeWorkflow, nodes: newNodes });
  };

  const deleteNode = (nodeIndex) => {
    const newNodes = activeWorkflow.nodes.filter((_, i) => i !== nodeIndex);
    const updatedWorkflows = workflows.map(w =>
      w.id === activeWorkflow.id ? { ...w, nodes: newNodes } : w
    );
    setWorkflows(updatedWorkflows);
    setActiveWorkflow({ ...activeWorkflow, nodes: newNodes });
  };

  const createNewWorkflow = () => {
    const name = newWorkflowName.trim() || 'New Workflow';
    const trigger = createNode(NODE_TYPES.TRIGGER, TRIGGER_TYPES.NEW_SUBSCRIBER, { label: 'Trigger: ' + name });
    const workflow = {
      id: `auto_${Date.now()}`,
      name,
      description: 'Custom automation workflow',
      category: 'Custom',
      status: 'Draft',
      nodes: [trigger],
    };
    setWorkflows([...workflows, workflow]);
    setActiveWorkflow(workflow);
    setNewWorkflowName('');
  };

  if (!activeWorkflow) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-950 flex items-center gap-2">
              <Workflow className="w-6 h-6 text-slate-950" />
              <span>Automation Workflows</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">{workflows.length} workflows • Build trigger-based email sequences</p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Workflow name..."
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 w-44 shadow-sm"
            />
            <Button size="sm" onClick={createNewWorkflow} className="gap-1.5 shrink-0 bg-black text-white hover:bg-slate-800">
              <Plus className="w-3.5 h-3.5" /> Create
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((wf) => {
            const stats = getWorkflowStats(wf.nodes);
            return (
              <Card key={wf.id} className="p-5 hover:border-slate-300 transition-colors cursor-pointer group bg-white border-slate-200" onClick={() => setActiveWorkflow(wf)}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-950 font-heading">{wf.name}</h3>
                  <Badge variant={wf.status === 'Active' ? 'default' : 'secondary'} className="text-[9px]">
                    {wf.status || 'Draft'}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">{wf.description}</p>
                <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-medium">
                  <span>{wf.nodes.length} steps</span>
                  <span>•</span>
                  <span>{stats.activeContacts} active</span>
                  <span>•</span>
                  <span>{stats.completedContacts} completed</span>
                </div>
                <div className="mt-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" className="text-[11px] h-6 gap-1 border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
                    <Play className="w-3 h-3" /> Open
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => setActiveWorkflow(null)} className="text-xs border-slate-300 bg-white text-slate-900 hover:bg-slate-100">← Back</Button>
          <div>
            <h2 className="text-lg font-bold font-heading text-slate-950">{activeWorkflow.name}</h2>
            <p className="text-[10px] text-slate-500">{activeWorkflow.nodes.length} steps in this workflow</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-[9px]">{activeWorkflow.category}</Badge>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
            <Play className="w-3 h-3" /> Activate
          </Button>
          <Button size="sm" className="gap-1.5 text-xs bg-black text-white hover:bg-slate-800">
            Save Workflow
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <Card className="p-6 min-h-[400px] bg-slate-50 border-slate-200">
        <div className="flex flex-col items-center">
          {activeWorkflow.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <WorkflowNode
                node={node}
                isFirst={index === 0}
                onDelete={() => deleteNode(index)}
                onUpdate={(updated) => updateNode(index, updated)}
              />
              {index < activeWorkflow.nodes.length - 1 && (
                <AddNodeMenu onAdd={addNode} />
              )}
            </React.Fragment>
          ))}
          <AddNodeMenu onAdd={addNode} />
        </div>
      </Card>
    </div>
  );
}
