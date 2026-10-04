import React from 'react';
import {
  Sparkles,
  Upload,
  SlidersHorizontal,
  PanelRight,
  Menu,
  FileText,
  Server,
  Activity,
} from 'lucide-react';
import { DocumentItem, ApiConfig } from '../../types';

interface HeaderProps {
  documents: DocumentItem[];
  selectedDocument: DocumentItem | null;
  onSelectDocument: (doc: DocumentItem | null) => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  onToggleSources: () => void;
  isSourcesOpen: boolean;
  apiConfig: ApiConfig;
}

export const Header: React.FC<HeaderProps> = ({
  documents,
  selectedDocument,
  onSelectDocument,
  onOpenUpload,
  onOpenSettings,
  onToggleSidebar,
  onToggleSources,
  isSourcesOpen,
  apiConfig,
}) => {
  return (
    <header className="h-16 glass-header sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
      {/* Left section: Logo & Mobile sidebar toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">CREOZEN</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI Workspace
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Generative RAG & Document Intelligence</p>
          </div>
        </div>
      </div>

      {/* Center Section: Active Document Selector */}
      <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
        <FileText className="w-4 h-4 text-indigo-400" />
        <span className="text-slate-400 font-medium">Context Doc:</span>
        <select
          value={selectedDocument?.id || ''}
          onChange={(e) => {
            const doc = documents.find((d) => d.id === e.target.value) || null;
            onSelectDocument(doc);
          }}
          className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[220px] truncate"
        >
          <option value="" className="bg-slate-900 text-slate-300">All Workspace Knowledge</option>
          {documents.map((doc) => (
            <option key={doc.id} value={doc.id} className="bg-slate-900 text-slate-200">
              {doc.title} ({doc.fileType.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Right Section: Actions & Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend Status Indicator */}
        <div
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs cursor-pointer border transition-all ${
            apiConfig.isMock
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
          }`}
          title={
            apiConfig.isMock
              ? 'Running in Mock Mode (VITE_API_BASE_URL not configured)'
              : `Connected to API Base: ${apiConfig.baseUrl}`
          }
        >
          {apiConfig.isMock ? (
            <>
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-medium hidden sm:inline">Mock API Mode</span>
            </>
          ) : (
            <>
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium hidden sm:inline">Backend API Live</span>
            </>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-all shadow-md shadow-indigo-600/25 active:scale-95"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload Document</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          title="Workspace Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Sources Toggle Button */}
        <button
          onClick={onToggleSources}
          className={`p-2 rounded-lg transition-colors relative ${
            isSourcesOpen
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
          }`}
          title="Toggle RAG Sources & Citations Panel"
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
