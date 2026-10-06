import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Palette, Plus, Eye, ArrowRight, Search } from 'lucide-react';
import { TEMPLATE_LIBRARY, renderTemplateToHtml } from '../services/templateEngine';
import TemplateBuilder from './TemplateBuilder';

const CATEGORIES = ['All', 'Onboarding', 'Newsletter', 'Announcement', 'Promotional', 'Event', 'Retention', 'Transactional'];

export default function TemplateGallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([]);

  const allTemplates = [...TEMPLATE_LIBRARY, ...savedTemplates];

  const filtered = allTemplates.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveTemplate = (data) => {
    const saved = {
      id: `tpl_custom_${Date.now()}`,
      name: data.name,
      description: 'Custom saved template',
      category: 'Custom',
      blocks: data.blocks,
    };
    setSavedTemplates(prev => [...prev, saved]);
    setEditingTemplate(null);
  };

  // If editing a template, show the builder
  if (editingTemplate) {
    return (
      <TemplateBuilder
        initialBlocks={editingTemplate.blocks}
        onSave={handleSaveTemplate}
        onBack={() => setEditingTemplate(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-slate-100 flex items-center gap-2">
            <Palette className="w-6 h-6 text-emerald-400" />
            <span>Email Templates</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Choose a pre-built template or create your own with the visual block editor.
          </p>
        </div>
        <Button size="sm" onClick={() => setEditingTemplate({ blocks: [] })} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Build from Scratch
        </Button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex items-center space-x-1 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:border-slate-700 transition-all group">
            {/* Preview Thumbnail */}
            <div className="h-40 bg-[#0a0a0a] border-b border-slate-800 overflow-hidden relative">
              <div
                className="transform scale-[0.35] origin-top-left w-[600px] pointer-events-none"
                dangerouslySetInnerHTML={{ __html: renderTemplateToHtml(template.blocks, { subject: template.name }) }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => setPreviewTemplate(template)} className="text-[10px] gap-1 h-7">
                  <Eye className="w-3 h-3" /> Preview
                </Button>
                <Button size="sm" onClick={() => setEditingTemplate(template)} className="text-[10px] gap-1 h-7">
                  Use Template <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
            {/* Info */}
            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-100 font-heading">{template.name}</h3>
                <Badge variant="secondary" className="text-[9px]">{template.category}</Badge>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">{template.description}</p>
              <div className="text-[9px] text-slate-500">{template.blocks.length} blocks</div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Palette className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No templates match your search.</p>
          </div>
        )}
      </div>

      {/* Full Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-heading">{previewTemplate.name}</h3>
                <p className="text-[10px] text-slate-400">{previewTemplate.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => { setEditingTemplate(previewTemplate); setPreviewTemplate(null); }} className="text-[10px] gap-1">
                  Use This <ArrowRight className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPreviewTemplate(null)} className="text-[10px]">Close</Button>
              </div>
            </div>
            <div className="bg-[#0a0a0a] p-4 overflow-auto flex-1 flex justify-center">
              <div
                style={{ maxWidth: 600, width: '100%' }}
                dangerouslySetInnerHTML={{ __html: renderTemplateToHtml(previewTemplate.blocks, { subject: previewTemplate.name }) }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
