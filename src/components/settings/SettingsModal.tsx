import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Server,
  Cpu,
  Check,
  Code,
  Globe,
  Info,
} from 'lucide-react';
import { ApiConfig } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onSaveConfig: (newConfig: ApiConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<ApiConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">API & RAG Settings</h3>
              <p className="text-xs text-slate-400">
                Configure backend API endpoints and retrieval parameters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[75vh]">
          {/* Section 1: Backend Connection */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4" /> Backend API Integration
            </h4>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  API Base URL (`VITE_API_BASE_URL`)
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isMock: !formData.isMock })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    formData.isMock
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {formData.isMock ? 'Mode: Mock Services' : 'Mode: Live API'}
                </button>
              </div>

              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.baseUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      baseUrl: e.target.value,
                      isMock: e.target.value.trim() === '' || e.target.value.toLowerCase() === 'mock',
                    })
                  }
                  placeholder="e.g. http://localhost:8000/api/v1"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  When <code className="text-indigo-300 font-mono">VITE_API_BASE_URL</code> is defined in <code className="text-indigo-300 font-mono">.env</code>, API requests will target your hosted backend. When empty, the UI operates seamlessly in Mock Mode.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Model & Vector Parameters */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Vector RAG Parameters
            </h4>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  LLM Foundation Model (Simulated)
                </label>
                <select
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="CREO-RAG-v1.4">CREOZEN Enterprise RAG v1.4 (Default)</option>
                  <option value="CREO-Lite-v1">CREOZEN Fast Summary Lite v1.0</option>
                  <option value="GPT-4o-Mock">OpenAI GPT-4o Pipeline</option>
                  <option value="Claude-3.5-Sonnet-Mock">Anthropic Claude 3.5 Sonnet</option>
                </select>
              </div>

              {/* Top-K Chunk Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-300">Top-K Retrieved Chunks</span>
                  <span className="font-mono text-indigo-400 font-bold">{formData.topK}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.topK}
                  onChange={(e) => setFormData({ ...formData, topK: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-300">Generation Temperature</span>
                  <span className="font-mono text-indigo-400 font-bold">{formData.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Architecture Info */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5 text-indigo-300">
              <Code className="w-4 h-4" /> Frontend Service Abstraction Architecture
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All UI components communicate through <code className="text-indigo-300">src/services/chatService.ts</code>. Backend teammates can implement endpoints matching the defined contracts without UI redesign.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
