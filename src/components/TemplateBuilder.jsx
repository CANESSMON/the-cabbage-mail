import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Palette, Type, ImageIcon, MousePointer, Minus, Space, Share2, AlignEndHorizontal,
  ArrowUp, ArrowDown, Trash2, Plus, Eye, Code, Save, GripVertical, ChevronRight
} from 'lucide-react';
import { BLOCK_TYPES, createBlock, renderTemplateToHtml } from '../services/templateEngine';

const BLOCK_PALETTE = [
  { type: BLOCK_TYPES.HEADER, label: 'Header', icon: Palette, color: 'text-slate-900' },
  { type: BLOCK_TYPES.TEXT, label: 'Text', icon: Type, color: 'text-slate-900' },
  { type: BLOCK_TYPES.IMAGE, label: 'Image', icon: ImageIcon, color: 'text-slate-900' },
  { type: BLOCK_TYPES.BUTTON, label: 'Button', icon: MousePointer, color: 'text-slate-900' },
  { type: BLOCK_TYPES.DIVIDER, label: 'Divider', icon: Minus, color: 'text-slate-500' },
  { type: BLOCK_TYPES.SPACER, label: 'Spacer', icon: Space, color: 'text-slate-500' },
  { type: BLOCK_TYPES.SOCIAL, label: 'Social', icon: Share2, color: 'text-slate-900' },
  { type: BLOCK_TYPES.FOOTER, label: 'Footer', icon: AlignEndHorizontal, color: 'text-slate-900' },
];

function BlockEditor({ block, onChange, onMoveUp, onMoveDown, onDelete, isFirst, isLast }) {
  const [expanded, setExpanded] = useState(false);
  const paletteItem = BLOCK_PALETTE.find(p => p.type === block.type);
  const Icon = paletteItem?.icon || Type;

  const updateProp = (key, value) => {
    onChange({ ...block, props: { ...block.props, [key]: value } });
  };

  return (
    <div className="group border border-slate-200/90 rounded-lg bg-white shadow-2xs hover:border-slate-300 transition-colors">
      {/* Block header bar */}
      <div className="flex items-center justify-between px-3 py-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center space-x-2">
          <GripVertical className="w-3.5 h-3.5 text-slate-400" />
          <Icon className={`w-4 h-4 ${paletteItem?.color || 'text-slate-700'}`} />
          <span className="text-[11px] font-bold text-slate-950 uppercase tracking-wider">{block.type}</span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
          <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 text-slate-400 hover:text-slate-900"><Trash2 className="w-3.5 h-3.5" /></button>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {/* Expanded property editor */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-slate-100">
          {block.type === BLOCK_TYPES.HEADER && (
            <>
              <Field label="Logo Text" value={block.props.logoText} onChange={(v) => updateProp('logoText', v)} />
              <Field label="Title" value={block.props.title} onChange={(v) => updateProp('title', v)} />
              <Field label="Subtitle" value={block.props.subtitle} onChange={(v) => updateProp('subtitle', v)} />
              <Field label="Background Color" value={block.props.bgColor} onChange={(v) => updateProp('bgColor', v)} type="color" />
            </>
          )}
          {block.type === BLOCK_TYPES.TEXT && (
            <div className="space-y-1 pt-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Content (HTML)</label>
              <textarea rows="4" value={block.props.content} onChange={(e) => updateProp('content', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 font-mono text-[11px] text-slate-950 focus:outline-none focus:border-slate-900 focus:bg-white" />
            </div>
          )}
          {block.type === BLOCK_TYPES.IMAGE && (
            <>
              <Field label="Image URL" value={block.props.src} onChange={(v) => updateProp('src', v)} />
              <Field label="Alt Text" value={block.props.alt} onChange={(v) => updateProp('alt', v)} />
            </>
          )}
          {block.type === BLOCK_TYPES.BUTTON && (
            <>
              <Field label="Button Text" value={block.props.text} onChange={(v) => updateProp('text', v)} />
              <Field label="Link URL" value={block.props.href} onChange={(v) => updateProp('href', v)} />
              <Field label="Background Color" value={block.props.bgColor} onChange={(v) => updateProp('bgColor', v)} type="color" />
            </>
          )}
          {block.type === BLOCK_TYPES.FOOTER && (
            <>
              <Field label="Company Name" value={block.props.companyName} onChange={(v) => updateProp('companyName', v)} />
              <Field label="Address" value={block.props.address} onChange={(v) => updateProp('address', v)} />
            </>
          )}
          {block.type === BLOCK_TYPES.SPACER && (
            <Field label="Height" value={block.props.height} onChange={(v) => updateProp('height', v)} />
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div className="space-y-0.5 pt-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      {type === 'color' ? (
        <div className="flex items-center space-x-2">
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded border border-slate-200 bg-transparent cursor-pointer" />
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[11px] text-slate-950 font-mono focus:outline-none focus:border-slate-900" />
        </div>
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[11px] text-slate-950 focus:outline-none focus:border-slate-900" />
      )}
    </div>
  );
}

export default function TemplateBuilder({ initialBlocks, onSave, onBack }) {
  const [blocks, setBlocks] = useState(initialBlocks || [
    createBlock(BLOCK_TYPES.HEADER),
    createBlock(BLOCK_TYPES.TEXT),
    createBlock(BLOCK_TYPES.BUTTON),
    createBlock(BLOCK_TYPES.FOOTER),
  ]);
  const [templateName, setTemplateName] = useState('Untitled Template');
  const [showPreview, setShowPreview] = useState(false);

  const addBlock = (type) => {
    setBlocks([...blocks, createBlock(type)]);
  };

  const updateBlock = (index, updated) => {
    const next = [...blocks];
    next[index] = updated;
    setBlocks(next);
  };

  const moveBlock = (index, direction) => {
    const next = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  };

  const deleteBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const fullHtml = renderTemplateToHtml(blocks, { subject: templateName });

  const handleSave = () => {
    if (onSave) {
      onSave({ name: templateName, blocks, html: fullHtml });
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="text-xs shrink-0 border border-slate-300 bg-white">Back to Gallery</Button>
          )}
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="bg-transparent border-b border-slate-300 focus:border-slate-900 text-lg font-extrabold font-heading text-slate-950 outline-none pb-1 min-w-0"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={showPreview ? 'default' : 'outline'} size="sm" onClick={() => setShowPreview(!showPreview)} className="gap-1.5 text-xs border-slate-300 text-slate-900 bg-white hover:bg-slate-100 font-semibold">
            {showPreview ? <Code className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPreview ? 'Editor' : 'Preview'}
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1.5 text-xs bg-black hover:bg-slate-800 text-white font-semibold shadow-xs">
            <Save className="w-3.5 h-3.5" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Block Palette — 1 col */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Add Blocks</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {BLOCK_PALETTE.map((item) => (
              <button
                key={item.type}
                onClick={() => addBlock(item.type)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs text-slate-950 font-medium transition-colors shadow-2xs"
              >
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor or Preview — 4 cols */}
        <div className="lg:col-span-4">
          {showPreview ? (
            <Card className="bg-white border-slate-200/90 p-0 overflow-hidden shadow-2xs">
              <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Preview (600px)</span>
                <Badge variant="outline" className="text-[9px] border-slate-300 text-slate-900 bg-white">{blocks.length} blocks</Badge>
              </div>
              <div className="bg-slate-50 p-4 flex justify-center overflow-auto max-h-[600px]">
                <div
                  style={{ maxWidth: 600, width: '100%' }}
                  dangerouslySetInnerHTML={{ __html: fullHtml }}
                />
              </div>
            </Card>
          ) : (
            <div className="space-y-2">
              {blocks.length === 0 && (
                <Card className="p-8 text-center border-dashed border-slate-300 bg-white">
                  <Palette className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium">Add blocks from the palette to start building your email template.</p>
                </Card>
              )}
              {blocks.map((block, index) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  onChange={(updated) => updateBlock(index, updated)}
                  onMoveUp={() => moveBlock(index, -1)}
                  onMoveDown={() => moveBlock(index, 1)}
                  onDelete={() => deleteBlock(index)}
                  isFirst={index === 0}
                  isLast={index === blocks.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

