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
          <h1 className="text-2xl font-extrabold font-heading text-slate-950 tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6 text-slate-900" />
            <span>Email Templates</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Choose a pre-built template or create your own with the visual block editor.
          </p>
        </div>
        <Button size="sm" onClick={() => setEditingTemplate({ blocks: [] })} className="gap-1.5 bg-black hover:bg-slate-800 text-white font-semibold shadow-xs">
          <Plus className="w-3.5 h-3.5" />
          Build from Scratch
        </Button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
          />
        </div>
        <div className="flex items-center space-x-1 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-black text-white shadow-xs'
                  : 'text-slate-600 border border-slate-200 bg-white hover:bg-slate-100'
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
          <Card key={template.id} className="bg-white border-slate-200/90 shadow-2xs overflow-hidden hover:border-slate-300 transition-all group">
            {/* Preview Thumbnail */}
            <div className="h-40 bg-slate-100 border-b border-slate-200 overflow-hidden relative">
              <div
                className="transform scale-[0.35] origin-top-left w-[600px] pointer-events-none"
                dangerouslySetInnerHTML={{ __html: renderTemplateToHtml(template.blocks, { subject: template.name }) }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => setPreviewTemplate(template)} className="text-xs gap-1 h-7 border-slate-300 bg-white text-slate-900 font-medium">
                  <Eye className="w-3 h-3" /> Preview
                </Button>
                <Button size="sm" onClick={() => setEditingTemplate(template)} className="text-xs gap-1 h-7 bg-black hover:bg-slate-800 text-white font-semibold">
                  Use Template <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
            {/* Info */}
            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-950 font-heading">{template.name}</h3>
                <Badge variant="outline" className="text-[9px] border-slate-300 text-slate-900 bg-slate-100">{template.category}</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{template.description}</p>
              <div className="text-[9px] text-slate-400 font-medium">{template.blocks.length} blocks</div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Palette className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-medium">No templates match your search.</p>
          </div>
        )}
      </div>

      {/* Full Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-950">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-950 font-heading">{previewTemplate.name}</h3>
                <p className="text-[10px] text-slate-500">{previewTemplate.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => { setEditingTemplate(previewTemplate); setPreviewTemplate(null); }} className="text-xs gap-1 bg-black hover:bg-slate-800 text-white font-semibold">
                  Use This <ArrowRight className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPreviewTemplate(null)} className="text-xs border-slate-300 text-slate-700">Close</Button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 overflow-auto flex-1 flex justify-center border-t border-slate-100">
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

