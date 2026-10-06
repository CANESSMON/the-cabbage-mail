import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Filter, Plus, Trash2, Users, X, Save, ChevronDown
} from 'lucide-react';

const CONDITION_FIELDS = [
  { id: 'tag', label: 'Tag', type: 'select', options: ['VIP', 'Newsletter', 'Lead', 'Active', 'At-Risk', 'Churned', 'Onboarded'] },
  { id: 'subscribed_before', label: 'Subscribed Before', type: 'date' },
  { id: 'subscribed_after', label: 'Subscribed After', type: 'date' },
  { id: 'email_domain', label: 'Email Domain Contains', type: 'text' },
  { id: 'engagement_above', label: 'Engagement Score Above', type: 'number' },
  { id: 'engagement_below', label: 'Engagement Score Below', type: 'number' },
  { id: 'campaign_opened', label: 'Opened Campaign', type: 'text' },
  { id: 'campaign_not_opened', label: 'Did Not Open Campaign', type: 'text' },
];

const OPERATORS = ['equals', 'contains', 'greater than', 'less than', 'before', 'after'];

function ConditionRow({ condition, onChange, onDelete }) {
  const field = CONDITION_FIELDS.find(f => f.id === condition.field) || CONDITION_FIELDS[0];

  return (
    <div className="flex items-center space-x-2 group">
      <select
        value={condition.field}
        onChange={(e) => onChange({ ...condition, field: e.target.value, value: '' })}
        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500/50 min-w-[160px]"
      >
        {CONDITION_FIELDS.map(f => (
          <option key={f.id} value={f.id}>{f.label}</option>
        ))}
      </select>

      {field.type === 'select' ? (
        <select
          value={condition.value}
          onChange={(e) => onChange({ ...condition, value: e.target.value })}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500/50 flex-1"
        >
          <option value="">Select...</option>
          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={field.type}
          value={condition.value}
          onChange={(e) => onChange({ ...condition, value: e.target.value })}
          placeholder={`Enter ${field.label.toLowerCase()}...`}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 flex-1"
        />
      )}

      <button
        onClick={onDelete}
        className="p-1.5 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function SegmentBuilder() {
  const { subscribers } = useAuth();
  const [segments, setSegments] = useState([
    {
      id: 'seg_1',
      name: 'VIP Subscribers',
      conditions: [{ id: 'c1', field: 'tag', value: 'VIP', logic: 'AND' }],
      logic: 'AND',
      matchCount: Math.floor(Math.random() * 50) + 10,
    },
    {
      id: 'seg_2',
      name: 'At-Risk — Low Engagement',
      conditions: [
        { id: 'c2', field: 'engagement_below', value: '30', logic: 'AND' },
        { id: 'c3', field: 'tag', value: 'At-Risk', logic: 'AND' },
      ],
      logic: 'AND',
      matchCount: Math.floor(Math.random() * 20) + 5,
    },
    {
      id: 'seg_3',
      name: 'Gmail Users',
      conditions: [{ id: 'c4', field: 'email_domain', value: 'gmail.com', logic: 'AND' }],
      logic: 'AND',
      matchCount: Math.floor(Math.random() * 100) + 30,
    },
  ]);
  const [activeSegment, setActiveSegment] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingConditions, setEditingConditions] = useState([]);
  const [editingLogic, setEditingLogic] = useState('AND');

  const createNewSegment = () => {
    const seg = {
      id: `seg_${Date.now()}`,
      name: 'New Segment',
      conditions: [{ id: `c_${Date.now()}`, field: 'tag', value: '', logic: 'AND' }],
      logic: 'AND',
      matchCount: 0,
    };
    setEditingName(seg.name);
    setEditingConditions(seg.conditions);
    setEditingLogic(seg.logic);
    setActiveSegment(seg);
  };

  const editSegment = (seg) => {
    setEditingName(seg.name);
    setEditingConditions([...seg.conditions]);
    setEditingLogic(seg.logic);
    setActiveSegment(seg);
  };

  const addCondition = () => {
    setEditingConditions([...editingConditions, { id: `c_${Date.now()}`, field: 'tag', value: '', logic: editingLogic }]);
  };

  const updateCondition = (index, updated) => {
    const next = [...editingConditions];
    next[index] = updated;
    setEditingConditions(next);
  };

  const deleteCondition = (index) => {
    setEditingConditions(editingConditions.filter((_, i) => i !== index));
  };

  // Simulated match count
  const liveMatchCount = editingConditions.filter(c => c.value).length > 0
    ? Math.floor(Math.random() * subscribers.length * 0.7) + 1
    : subscribers.length;

  const saveSegment = () => {
    const saved = {
      ...activeSegment,
      name: editingName,
      conditions: editingConditions,
      logic: editingLogic,
      matchCount: liveMatchCount,
    };
    if (segments.find(s => s.id === saved.id)) {
      setSegments(segments.map(s => s.id === saved.id ? saved : s));
    } else {
      setSegments([...segments, saved]);
    }
    setActiveSegment(null);
  };

  // Segment Editor
  if (activeSegment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setActiveSegment(null)} className="text-xs">← Back</Button>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="bg-transparent border-b border-slate-700 focus:border-emerald-500 text-lg font-bold font-heading text-slate-100 outline-none pb-1"
            />
          </div>
          <Button size="sm" onClick={saveSegment} className="gap-1.5 text-xs">
            <Save className="w-3.5 h-3.5" /> Save Segment
          </Button>
        </div>

        {/* Live Count */}
        <Card className="p-4 bg-emerald-950/20 border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-sm font-bold text-emerald-400">{liveMatchCount}</span>
                <span className="text-xs text-slate-400 ml-1">subscribers match</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="text-slate-400">Logic:</span>
              <button
                onClick={() => setEditingLogic(editingLogic === 'AND' ? 'OR' : 'AND')}
                className={`px-2 py-0.5 rounded font-mono font-bold ${
                  editingLogic === 'AND'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-indigo-500/15 text-indigo-400'
                }`}
              >
                {editingLogic}
              </button>
            </div>
          </div>
        </Card>

        {/* Conditions */}
        <Card className="p-4 space-y-3">
          <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Conditions</h3>
          {editingConditions.map((condition, i) => (
            <div key={condition.id}>
              {i > 0 && (
                <div className="flex items-center justify-center py-1">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                    editingLogic === 'AND' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                  }`}>{editingLogic}</span>
                </div>
              )}
              <ConditionRow
                condition={condition}
                onChange={(updated) => updateCondition(i, updated)}
                onDelete={() => deleteCondition(i)}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addCondition} className="text-[10px] gap-1.5 w-full">
            <Plus className="w-3 h-3" /> Add Condition
          </Button>
        </Card>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-slate-100 flex items-center gap-2">
            <Filter className="w-6 h-6 text-emerald-400" />
            <span>Audience Segments</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">{segments.length} segments • Build dynamic audience filters</p>
        </div>
        <Button size="sm" onClick={createNewSegment} className="gap-1.5 shrink-0">
          <Plus className="w-3.5 h-3.5" /> Create Segment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map((seg) => (
          <Card key={seg.id} className="p-5 hover:border-slate-700 transition-colors cursor-pointer" onClick={() => editSegment(seg)}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-100 font-heading">{seg.name}</h3>
              <Badge variant="default" className="text-[9px]">{seg.matchCount} contacts</Badge>
            </div>
            <div className="space-y-1">
              {seg.conditions.map((c, i) => {
                const field = CONDITION_FIELDS.find(f => f.id === c.field);
                return (
                  <div key={c.id} className="text-[10px] text-slate-400">
                    {i > 0 && <span className="text-emerald-400 font-mono text-[9px]">{seg.logic} </span>}
                    <span className="text-slate-300">{field?.label || c.field}</span>
                    {c.value && <span className="text-emerald-400 ml-1">= {c.value}</span>}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
