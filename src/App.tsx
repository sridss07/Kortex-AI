import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { HistorySidebar } from './components/history/HistorySidebar';
import { ChatWorkspace } from './components/chat/ChatWorkspace';
import { SourcesPanel } from './components/sources/SourcesPanel';
import { DocumentUploadModal } from './components/upload/DocumentUploadModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { chatService } from './services/chatService';
import { apiClient } from './services/apiClient';
import {
  DocumentItem,
  Conversation,
  ChatMessage,
  SourceChunk,
  ApiConfig,
} from './types';

export const App: React.FC = () => {
  // Application Data States
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Selection & Active Panel States
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [activeSources, setActiveSources] = useState<SourceChunk[]>([]);
  const [activeSourceMessageId, setActiveSourceMessageId] = useState<string | null>(null);

  // UI Visibility Toggles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // System & Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(apiClient.getConfig());

  // Initial Load
  useEffect(() => {
    const initData = async () => {
      try {
        const [docs, convs] = await Promise.all([
          chatService.fetchDocuments(),
          chatService.fetchConversations(),
        ]);
        setDocuments(docs);
        setConversations(convs);

        if (convs.length > 0) {
          setActiveConversationId(convs[0].id);
          const initialMsgs = await chatService.fetchMessages(convs[0].id);
          setMessages(initialMsgs);

          // If first message has sources, pre-load sources
          const lastAiMsg = [...initialMsgs].reverse().find((m) => m.role === 'assistant' && m.sources);
          if (lastAiMsg && lastAiMsg.sources) {
            setActiveSources(lastAiMsg.sources);
            setActiveSourceMessageId(lastAiMsg.id);
          }
        }
      } catch (err) {
        console.error('Failed to initialize application workspace data:', err);
      }
    };

    initData();
  }, []);

  // Fetch messages when conversation switches
  const handleSelectConversation = async (convId: string) => {
    setActiveConversationId(convId);
    setIsLoading(true);
    try {
      const msgs = await chatService.fetchMessages(convId);
      setMessages(msgs);

      // Check if conversation specifies a target document context
      const conv = conversations.find((c) => c.id === convId);
      if (conv && conv.documentId) {
        const doc = documents.find((d) => d.id === conv.documentId) || null;
        setSelectedDocument(doc);
      }

      // Update active sources to last AI message if available
      const lastAiMsg = [...msgs].reverse().find((m) => m.role === 'assistant' && m.sources);
      if (lastAiMsg && lastAiMsg.sources) {
        setActiveSources(lastAiMsg.sources);
        setActiveSourceMessageId(lastAiMsg.id);
      } else {
        setActiveSources([]);
        setActiveSourceMessageId(null);
      }
    } catch (err) {
      console.error('Failed to fetch messages for conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new AI chat session
  const handleNewConversation = async () => {
    try {
      const newConv = await chatService.createConversation(
        selectedDocument?.id,
        selectedDocument ? `Analysis: ${selectedDocument.title}` : undefined
      );
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setMessages([]);
      setActiveSources([]);
      setActiveSourceMessageId(null);
    } catch (err) {
      console.error('Failed to create new conversation:', err);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await chatService.deleteConversation(convId);
      const updated = conversations.filter((c) => c.id !== convId);
      setConversations(updated);

      if (activeConversationId === convId) {
        if (updated.length > 0) {
          handleSelectConversation(updated[0].id);
        } else {
          setActiveConversationId(null);
          setMessages([]);
          setActiveSources([]);
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  // Upload document handler
  const handleUploadDocument = async (file: File): Promise<DocumentItem> => {
    const newDoc = await chatService.uploadDocument(file);
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocument(newDoc);
    return newDoc;
  };

  // Delete document
  const handleDeleteDocument = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await chatService.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (selectedDocument?.id === docId) {
        setSelectedDocument(null);
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  // Send message
  const handleSendMessage = async (text: string) => {
    let currentConvId = activeConversationId;

    // Create session on the fly if none active
    if (!currentConvId) {
      const newConv = await chatService.createConversation(
        selectedDocument?.id,
        text.length > 35 ? text.slice(0, 35) + '...' : text
      );
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      currentConvId = newConv.id;
    }

    // Optimistically append user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: currentConvId,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      status: 'done',
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const { userMessage, assistantMessage } = await chatService.sendMessage(
        currentConvId,
        text,
        selectedDocument?.id
      );

      // Update state with finalized messages
      setMessages((prev) =>
        prev.map((m) => (m.id === tempUserMsg.id ? userMessage : m)).concat(assistantMessage)
      );

      // Automatically populate RAG Sources panel with AI citations
      if (assistantMessage.sources && assistantMessage.sources.length > 0) {
        setActiveSources(assistantMessage.sources);
        setActiveSourceMessageId(assistantMessage.id);
        setIsSourcesOpen(true);
      }

      // Update conversation title / snippet in sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConvId
            ? {
                ...c,
                lastMessageText: text,
                updatedAt: new Date().toISOString(),
                messageCount: c.messageCount + 2,
              }
            : c
        )
      );
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // View specific message sources
  const handleViewSources = (sources: SourceChunk[], messageId: string) => {
    setActiveSources(sources);
    setActiveSourceMessageId(messageId);
    setIsSourcesOpen(true);
  };

  // Save Config Settings
  const handleSaveConfig = (newConfig: ApiConfig) => {
    apiClient.updateConfig(newConfig);
    setApiConfig(apiClient.getConfig());
  };

  return (
    <div className="anime-canvas relative isolate flex flex-col h-screen w-screen overflow-hidden font-sans">
      <svg
        className="anime-mascot pointer-events-none absolute z-0"
        viewBox="0 0 240 240"
        fill="none"
        aria-hidden="true"
      >
        <path d="M120 24v18" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round" />
        <circle cx="120" cy="17" r="8" fill="#f9a8d4" />
        <path d="M91 54c0-16 13-29 29-29s29 13 29 29" stroke="#a78bfa" strokeWidth="5" />
        <rect x="58" y="50" width="124" height="96" rx="38" fill="#fff" stroke="#8b5cf6" strokeWidth="5" />
        <path d="M58 83H46a12 12 0 0 0 0 24h13m122-24h13a12 12 0 0 1 0 24h-13" fill="#fbcfe8" stroke="#8b5cf6" strokeWidth="5" />
        <ellipse cx="93" cy="94" rx="8" ry="11" fill="#6366f1" />
        <ellipse cx="147" cy="94" rx="8" ry="11" fill="#6366f1" />
        <path d="M108 115q12 12 24 0" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
        <circle cx="78" cy="111" r="7" fill="#f9a8d4" opacity=".8" />
        <circle cx="162" cy="111" r="7" fill="#f9a8d4" opacity=".8" />
        <path d="M81 151v17a12 12 0 0 0 12 12h54a12 12 0 0 0 12-12v-17" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="5" />
        <rect x="101" y="154" width="38" height="17" rx="8.5" fill="#fff" />
        <path d="m34 48 5 11 11 5-11 5-5 11-5-11-11-5 11-5 5-11Zm171 70 4 8 8 4-8 4-4 8-4-8-8-4 8-4 4-8ZM53 186l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill="#f9a8d4" />
        <path d="m194 34 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill="#a5b4fc" />
      </svg>
      {/* Top Application Header */}
      <Header
        documents={documents}
        selectedDocument={selectedDocument}
        onSelectDocument={setSelectedDocument}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onToggleSources={() => setIsSourcesOpen(!isSourcesOpen)}
        isSourcesOpen={isSourcesOpen}
        apiConfig={apiConfig}
      />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex min-h-0 overflow-hidden">
        {/* Left History & Document Sidebar */}
        <HistorySidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          documents={documents}
          selectedDocumentId={selectedDocument?.id}
          onSelectDocument={setSelectedDocument}
          onDeleteDocument={handleDeleteDocument}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Center Workspace Chat View */}
        <ChatWorkspace
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          selectedDocument={selectedDocument}
          onClearSelectedDocument={() => setSelectedDocument(null)}
          onOpenUploadModal={() => setIsUploadOpen(true)}
          onViewSources={handleViewSources}
          activeSourceMessageId={activeSourceMessageId}
        />

        {/* Right Grounding Sources Panel */}
        <SourcesPanel
          sources={activeSources}
          activeMessageId={activeSourceMessageId}
          documents={documents}
          isOpen={isSourcesOpen}
          onClose={() => setIsSourcesOpen(false)}
          onSelectDocument={setSelectedDocument}
        />
      </div>

      {/* Modals */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadDocument}
        recentDocuments={documents}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={apiConfig}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
};

export default App;
