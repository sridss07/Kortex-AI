import React, { useEffect, useRef } from 'react';
import { Sparkles, Loader2, FileText } from 'lucide-react';
import { ChatMessage, DocumentItem, SourceChunk } from '../../types';
import { MessageItem } from './MessageItem';
import { SamplePrompts } from './SamplePrompts';
import { ChatInput } from './ChatInput';

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  selectedDocument: DocumentItem | null;
  onClearSelectedDocument: () => void;
  onOpenUploadModal: () => void;
  onViewSources: (sources: SourceChunk[], messageId: string) => void;
  activeSourceMessageId: string | null;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  selectedDocument,
  onClearSelectedDocument,
  onOpenUploadModal,
  onViewSources,
  activeSourceMessageId,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <main className="relative z-10 flex-1 flex flex-col h-full bg-transparent overflow-hidden">
      {/* Active Document Header Bar if document is locked */}
      {selectedDocument && (
        <div className="bg-indigo-50/90 border-b border-indigo-200 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-slate-600 truncate">
              Context Ingestion Filter:{' '}
              <strong className="text-slate-900 font-medium">{selectedDocument.title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500">
            <span>{selectedDocument.chunkCount} vector chunks</span>
            <button
              onClick={onClearSelectedDocument}
              className="text-indigo-600 hover:text-indigo-800 font-medium underline"
            >
              Reset Context
            </button>
          </div>
        </div>
      )}

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {messages.length === 0 ? (
          <SamplePrompts
            onSelectPrompt={onSendMessage}
            selectedDocTitle={selectedDocument?.title}
          />
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              onViewSources={onViewSources}
              isSourcesActive={activeSourceMessageId === msg.id}
            />
          ))
        )}

        {/* AI Typing / Reasoning Loading state */}
        {isLoading && (
          <div className="py-4 px-4 sm:px-6 bg-white/70 border-y border-indigo-100">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-700">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Searching vector indices & synthesizing response...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area Fixed at Bottom */}
      <div className="bg-gradient-to-t from-white/80 via-white/40 to-transparent pt-4">
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          selectedDocument={selectedDocument}
          onClearSelectedDocument={onClearSelectedDocument}
          onOpenUploadModal={onOpenUploadModal}
        />
      </div>
    </main>
  );
};
