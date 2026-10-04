import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  FileText,
  Trash2,
  Search,
  X,
  FileCode,
  FileSpreadsheet,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Conversation, DocumentItem, FileType } from '../../types';

interface HistorySidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (convId: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (convId: string, e: React.MouseEvent) => void;
  documents: DocumentItem[];
  selectedDocumentId?: string;
  onSelectDocument: (doc: DocumentItem | null) => void;
  onDeleteDocument: (docId: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  documents,
  selectedDocumentId,
  onSelectDocument,
  onDeleteDocument,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'conversations' | 'documents'>('conversations');

  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.documentTitle && c.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDocuments = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (fileType: FileType) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-400" />;
      case 'docx':
        return <FileSpreadsheet className="w-4 h-4 text-blue-400" />;
      case 'md':
      case 'txt':
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-80 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Action Header */}
        <div className="p-4 border-b border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace History
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewConversation();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New AI Session</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search history or documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Tabs switch */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`flex-1 py-1 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'conversations'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chats ({conversations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-1 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'documents'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Docs ({documents.length})</span>
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {activeTab === 'conversations' ? (
            filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No matching conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`group relative flex items-start justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isActive
                        ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-200 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-2">
                      <MessageSquare
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isActive ? 'text-indigo-400' : 'text-slate-500'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate leading-tight">
                          {conv.title}
                        </p>
                        {conv.documentTitle && (
                          <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                            📄 {conv.documentTitle}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(conv.updatedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span>•</span>
                          <span>{conv.messageCount} messages</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => onDeleteConversation(conv.id, e)}
                      className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No documents uploaded yet.
            </div>
          ) : (
            filteredDocuments.map((doc) => {
              const isSelected = doc.id === selectedDocumentId;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    onSelectDocument(isSelected ? null : doc);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex items-start justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-200'
                      : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-2">
                    <div className="mt-0.5 shrink-0">{getFileIcon(doc.fileType)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate leading-tight">
                        {doc.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span>•</span>
                        <span>{doc.chunkCount || 0} chunks</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium capitalize">{doc.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => onDeleteDocument(doc.id, e)}
                      className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isSelected ? 'rotate-90 text-indigo-400' : ''
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
          <span>CREOZEN Generative AI</span>
          <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 text-[10px]">v1.0.0</span>
        </div>
      </aside>
    </>
  );
};
