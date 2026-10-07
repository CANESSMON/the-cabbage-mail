import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Filter, Plus, Users, X, Save
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

function ConditionRow({ condition, onChange, onDelete }) {
  const field = CONDITION_FIELDS.find(f => f.id === condition.field) || CONDITION_FIELDS[0];

  return (
    <div className="flex items-center space-x-2 group">
      <select
        value={condition.field}
        onChange={(e) => onChange({ ...condition, field: e.target.value, value: '' })}
        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-slate-400 min-w-[160px] shadow-sm"
      >
        {CONDITION_FIELDS.map(f => (
          <option key={f.id} value={f.id}>{f.label}</option>
        ))}
      </select>

      {field.type === 'select' ? (
        <select
          value={condition.value}
          onChange={(e) => onChange({ ...condition, value: e.target.value })}
          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-950 focus:outline-none focus:border-slate-400 flex-1 shadow-sm"
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
          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 flex-1 shadow-sm"
        />
      )}

      <button
        onClick={onDelete}
        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
      >
        <X className="w-4 h-4" />
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

  if (activeSegment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => setActiveSegment(null)} className="text-xs border-slate-300 bg-white text-slate-900 hover:bg-slate-100">← Back</Button>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="bg-transparent border-b border-slate-300 focus:border-black text-lg font-bold font-heading text-slate-950 outline-none pb-1"
            />
          </div>
          <Button size="sm" onClick={saveSegment} className="gap-1.5 text-xs bg-black text-white hover:bg-slate-800">
            <Save className="w-3.5 h-3.5" /> Save List
          </Button>
        </div>

        {/* Live Count */}
        <Card className="p-4 bg-slate-50 border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-slate-950" />
              <div>
                <span className="text-sm font-bold text-slate-950">{liveMatchCount}</span>
                <span className="text-xs text-slate-500 ml-1">subscribers match</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="text-slate-500">Logic:</span>
              <button
                onClick={() => setEditingLogic(editingLogic === 'AND' ? 'OR' : 'AND')}
                className="px-2 py-0.5 rounded font-mono font-bold bg-black text-white"
              >
                {editingLogic}
              </button>
            </div>
          </div>
        </Card>

        {/* Conditions */}
        <Card className="p-4 space-y-3 bg-white border-slate-200">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conditions</h3>
          {editingConditions.map((condition, i) => (
            <div key={condition.id}>
              {i > 0 && (
                <div className="flex items-center justify-center py-1">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-200">{editingLogic}</span>
                </div>
              )}
              <ConditionRow
                condition={condition}
                onChange={(updated) => updateCondition(i, updated)}
                onDelete={() => deleteCondition(i)}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addCondition} className="text-xs gap-1.5 w-full border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
            <Plus className="w-3.5 h-3.5" /> Add Condition
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-950 flex items-center gap-2">
            <Filter className="w-6 h-6 text-slate-950" />
            <span>Contact Lists</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1" title="Lists (previously Segments) allow you to filter contacts based on tags or behavior.">{segments.length} lists • Build dynamic audience filters</p>
        </div>
        <Button size="sm" onClick={createNewSegment} className="gap-1.5 shrink-0 bg-black text-white hover:bg-slate-800">
          <Plus className="w-3.5 h-3.5" /> Create List
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map((seg) => (
          <Card key={seg.id} className="p-5 hover:border-slate-300 transition-colors cursor-pointer bg-white border-slate-200" onClick={() => editSegment(seg)}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-950 font-heading">{seg.name}</h3>
              <Badge variant="default" className="text-[9px] bg-slate-100 text-slate-900 border-slate-200">{seg.matchCount} contacts</Badge>
            </div>
            <div className="space-y-1">
              {seg.conditions.map((c, i) => {
                const field = CONDITION_FIELDS.find(f => f.id === c.field);
                return (
                  <div key={c.id} className="text-[10px] text-slate-500">
                    {i > 0 && <span className="text-slate-950 font-mono text-[9px] font-bold">{seg.logic} </span>}
                    <span className="text-slate-700">{field?.label || c.field}</span>
                    {c.value && <span className="text-slate-950 ml-1 font-semibold">= {c.value}</span>}
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
