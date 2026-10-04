import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  X,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Tag,
  Search,
} from 'lucide-react';
import { SourceChunk, DocumentItem } from '../../types';

interface SourcesPanelProps {
  sources: SourceChunk[];
  activeMessageId: string | null;
  documents: DocumentItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument?: (doc: DocumentItem | null) => void;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({
  sources,
  isOpen,
  onClose,
  documents,
  onSelectDocument,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSources = sources.filter(
    (src) =>
      src.content.toLowerCase().includes(filterQuery.toLowerCase()) ||
      src.documentTitle.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (src.tags && src.tags.some((t) => t.toLowerCase().includes(filterQuery.toLowerCase())))
  );

  return (
    <aside className="w-80 border-l border-slate-800/80 bg-slate-900/95 flex flex-col h-full shadow-2xl z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">RAG Grounding Sources</h3>
            <p className="text-[11px] text-slate-400">
              {sources.length} retrieved context {sources.length === 1 ? 'chunk' : 'chunks'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter bar */}
      {sources.length > 0 && (
        <div className="px-4 py-2.5 border-b border-slate-800/60 bg-slate-950/50">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter retrieved chunks..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>
        </div>
      )}

      {/* Content Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sources.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">No RAG Citations Selected</p>
              <p className="text-xs text-slate-500 mt-1">
                Select an AI message response in the workspace or send a question to view the exact retrieved vector chunks.
              </p>
            </div>
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No chunks match query "{filterQuery}"
          </div>
        ) : (
          filteredSources.map((source) => {
            const doc = documents.find((d) => d.id === source.documentId);
            const scorePercent = Math.round(source.score * 100);

            return (
              <div
                key={source.id}
                className="group p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2.5"
              >
                {/* Chunk Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 truncate">
                      <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{source.documentTitle}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>Chunk #{source.chunkIndex}</span>
                      {source.pageNumber && (
                        <>
                          <span>•</span>
                          <span>Page {source.pageNumber}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Similarity Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      scorePercent >= 90
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : scorePercent >= 80
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {scorePercent}% Match
                  </span>
                </div>

                {/* Excerpt Body */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-mono">
                  "{source.content}"
                </div>

                {/* Tags & Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    {source.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(source.content, source.id)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Copy chunk text"
                    >
                      {copiedId === source.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {doc && onSelectDocument && (
                      <button
                        onClick={() => onSelectDocument(doc)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                        title="Focus document in context"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" /> Grounded by Vector RAG
        </span>
        <span>Cosine Distance</span>
      </div>
    </aside>
  );
};
