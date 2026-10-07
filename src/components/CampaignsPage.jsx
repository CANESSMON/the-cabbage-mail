import React, { useState } from 'react';
import CampaignComposer from './CampaignComposer';
import CampaignHistory from './CampaignHistory';
import { Send, ClipboardList } from 'lucide-react';

export default function CampaignsPage({ setActiveTab }) {
  const [currentView, setCurrentView] = useState('composer');

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setCurrentView('composer')}
          className={`flex items-center space-x-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            currentView === 'composer'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
        <button
          onClick={() => setCurrentView('history')}
          className={`flex items-center space-x-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            currentView === 'history'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Campaign History</span>
        </button>
      </div>

      <div className="pt-2">
        {currentView === 'composer' ? (
          <CampaignComposer setActiveTab={setActiveTab} />
        ) : (
          <CampaignHistory />
        )}
      </div>
    </div>
  );
}
