import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Clock,
} from 'lucide-react';
import { ChatMessage, SourceChunk } from '../../types';

interface MessageItemProps {
  message: ChatMessage;
  onViewSources?: (sources: SourceChunk[], messageId: string) => void;
  isSourcesActive?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onViewSources,
  isSourcesActive,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(message.feedback || null);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown-like formatter for bullet points, bold text, and headings
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-sm font-bold text-slate-900 mt-3 mb-1 font-sans">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-base font-bold text-indigo-700 mt-4 mb-2">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const itemText = trimmed.substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 ml-2 my-1 text-slate-700">
            <span className="text-indigo-600 font-bold">•</span>
            <span>{formatBoldText(itemText)}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-2 my-1 text-slate-700">
            <span className="text-indigo-600 font-semibold">{trimmed.split(' ')[0]}</span>
            <span>{formatBoldText(trimmed.replace(/^\d+\.\s/, ''))}</span>
          </div>
        );
      }
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="my-1 text-slate-700 leading-relaxed">
          {formatBoldText(line)}
        </p>
      );
    });
  };

  // Helper to parse **bold text** and `code snippets`
  const formatBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-xs text-indigo-300">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`py-4 px-4 sm:px-6 transition-colors ${
        isUser ? 'bg-white/45' : 'bg-white/60 border-y border-indigo-100/80'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
            isUser
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-500/20'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800">
                {isUser ? 'You' : 'CREOZEN AI Assistant'}
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Text Message */}
          <div className="text-xs sm:text-sm font-sans space-y-1">
            {renderFormattedContent(message.content)}
          </div>

          {/* Assistant Action Toolbar */}
          {!isUser && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 mt-3 text-xs">
              <div className="flex items-center gap-2">
                {/* RAG Sources Button */}
                {message.sources && message.sources.length > 0 && onViewSources && (
                  <button
                    onClick={() => onViewSources(message.sources || [], message.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSourcesActive
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View Grounding Sources ({message.sources.length})</span>
                  </button>
                )}
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-1 text-slate-500">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
                  className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                    feedback === 'like' ? 'text-emerald-600' : 'hover:text-slate-900'
                  }`}
                  title="Helpful response"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
                  className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                    feedback === 'dislike' ? 'text-red-600' : 'hover:text-slate-900'
                  }`}
                  title="Unhelpful response"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
