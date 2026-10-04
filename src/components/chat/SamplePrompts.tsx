import React from 'react';
import { TrendingUp, ShieldCheck, Cpu, AlertTriangle, Sparkles } from 'lucide-react';
import { SAMPLE_PROMPTS } from '../../services/mockData';

interface SamplePromptsProps {
  onSelectPrompt: (promptText: string) => void;
  selectedDocTitle?: string;
}

export const SamplePrompts: React.FC<SamplePromptsProps> = ({
  onSelectPrompt,
  selectedDocTitle,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-6 animate-fade-in">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-indigo-200 text-indigo-700 text-xs font-medium shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>CREOZEN Enterprise RAG Workspace</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          What would you like to ask?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {selectedDocTitle ? (
            <>
              Asking questions grounded in document:{' '}
              <span className="text-indigo-700 font-medium">{selectedDocTitle}</span>
            </>
          ) : (
            'Ask questions across uploaded documents, extract insights, or inspect grounded citations.'
          )}
        </p>
      </div>

      {/* Grid of Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
        {SAMPLE_PROMPTS.map((item) => (
          <button
            key={item.title}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group p-4 rounded-xl bg-white/85 hover:bg-white border border-white/80 hover:border-indigo-300 transition-all duration-200 text-left space-y-2 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                {getIcon(item.icon)}
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                {item.title}
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              "{item.prompt}"
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
