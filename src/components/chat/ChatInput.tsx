import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, FileText, X, Sparkles } from 'lucide-react';
import { DocumentItem } from '../../types';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  selectedDocument: DocumentItem | null;
  onClearSelectedDocument: () => void;
  onOpenUploadModal: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  selectedDocument,
  onClearSelectedDocument,
  onOpenUploadModal,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 pt-2">
      {/* Selected Document Pill Indicator */}
      {selectedDocument && (
        <div className="mb-2 flex items-center justify-between bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs animate-slide-up">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="text-indigo-700 font-medium truncate">
              Querying:{' '}
              <span className="text-slate-900 font-semibold">{selectedDocument.title}</span>
            </span>
            <span className="text-[10px] text-indigo-600 font-mono shrink-0">
              ({selectedDocument.chunkCount} chunks)
            </span>
          </div>

          <button
            onClick={onClearSelectedDocument}
            className="p-1 text-slate-500 hover:text-indigo-800 rounded hover:bg-indigo-100 transition-colors"
            title="Clear document context filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input Box Container */}
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl bg-white/95 border border-indigo-100 focus-within:border-indigo-400 shadow-xl shadow-indigo-900/10 transition-all"
      >
        <div className="flex items-end gap-2 p-3">
          {/* File Attach Button */}
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors shrink-0"
            title="Upload or Attach Document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedDocument
                ? `Ask anything about ${selectedDocument.title}...`
                : 'Ask a question or request information from your documents...'
            }
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none py-1.5 px-1 max-h-44"
            disabled={isLoading}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl text-white font-medium transition-all shrink-0 ${
              input.trim() && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title="Send question (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-1.5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Grounded RAG Retrieval Mode
          </span>
          <span className="hidden sm:flex items-center gap-1">
            Press <kbd className="px-1 py-0.5 bg-slate-200 rounded font-mono text-[9px] text-slate-700">Shift + Enter</kbd> for line break
          </span>
        </div>
      </form>
    </div>
  );
};
