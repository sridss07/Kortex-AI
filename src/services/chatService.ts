import { apiClient } from './apiClient';
import {
  INITIAL_DOCUMENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_SOURCES,
} from './mockData';
import {
  DocumentItem,
  Conversation,
  ChatMessage,
  SourceChunk,
  UploadProgressState,
} from '../types';

class ChatService {
  private documents: DocumentItem[] = [...INITIAL_DOCUMENTS];
  private conversations: Conversation[] = [...INITIAL_CONVERSATIONS];
  private messages: Record<string, ChatMessage[]> = { ...INITIAL_MESSAGES };
  private sources: Record<string, SourceChunk[]> = { ...INITIAL_SOURCES };

  public async fetchDocuments(): Promise<DocumentItem[]> {
    return apiClient.request<DocumentItem[]>('/documents', { method: 'GET' }, async () => {
      await apiClient.simulateDelay(300);
      return [...this.documents];
    });
  }

  public async uploadDocument(
    file: File,
    onProgress?: (progress: UploadProgressState) => void
  ): Promise<DocumentItem> {
    return apiClient.request<DocumentItem>('/documents/upload', { method: 'POST' }, async () => {
      const fileSize = file.size;
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase() || 'txt';
      const fileType = (['pdf', 'txt', 'docx', 'md'].includes(fileExt) ? fileExt : 'pdf') as any;

      // Stage 1: Uploading
      if (onProgress) {
        onProgress({ fileName, fileSize, progress: 20, stage: 'uploading' });
      }
      await apiClient.simulateDelay(600);

      // Stage 2: Parsing & Extracting Text
      if (onProgress) {
        onProgress({ fileName, fileSize, progress: 55, stage: 'parsing' });
      }
      await apiClient.simulateDelay(700);

      // Stage 3: Generating Vector Embeddings & Indexing Chunks
      if (onProgress) {
        onProgress({ fileName, fileSize, progress: 85, stage: 'indexing' });
      }
      await apiClient.simulateDelay(600);

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: fileName.replace(/\.[^/.]+$/, "").replace(/_/g, ' '),
        filename: fileName,
        fileSize: fileSize,
        fileType: fileType,
        pageCount: Math.floor(Math.random() * 25) + 5,
        chunkCount: Math.floor(Math.random() * 80) + 20,
        status: 'ready',
        uploadedAt: new Date().toISOString(),
        summary: `Document ${fileName} ingested and indexed into vector workspace.`,
      };

      this.documents.unshift(newDoc);

      if (onProgress) {
        onProgress({ fileName, fileSize, progress: 100, stage: 'completed' });
      }

      return newDoc;
    });
  }

  public async deleteDocument(docId: string): Promise<boolean> {
    return apiClient.request<boolean>(`/documents/${docId}`, { method: 'DELETE' }, async () => {
      await apiClient.simulateDelay(300);
      this.documents = this.documents.filter((d) => d.id !== docId);
      return true;
    });
  }

  public async fetchConversations(): Promise<Conversation[]> {
    return apiClient.request<Conversation[]>('/conversations', { method: 'GET' }, async () => {
      await apiClient.simulateDelay(300);
      return [...this.conversations];
    });
  }

  public async fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    return apiClient.request<ChatMessage[]>(`/conversations/${conversationId}/messages`, { method: 'GET' }, async () => {
      await apiClient.simulateDelay(300);
      return this.messages[conversationId] || [];
    });
  }

  public async createConversation(documentId?: string, customTitle?: string): Promise<Conversation> {
    return apiClient.request<Conversation>('/conversations', { method: 'POST' }, async () => {
      await apiClient.simulateDelay(400);

      const targetDoc = this.documents.find((d) => d.id === documentId);
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        title: customTitle || (targetDoc ? `Analysis of ${targetDoc.title}` : 'New Workspace Inquiry'),
        documentId: documentId,
        documentTitle: targetDoc?.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessageText: 'Workspace session initialized',
        messageCount: 0,
      };

      this.conversations.unshift(newConv);
      this.messages[newConv.id] = [];
      return newConv;
    });
  }

  public async deleteConversation(conversationId: string): Promise<boolean> {
    return apiClient.request<boolean>(`/conversations/${conversationId}`, { method: 'DELETE' }, async () => {
      await apiClient.simulateDelay(300);
      this.conversations = this.conversations.filter((c) => c.id !== conversationId);
      delete this.messages[conversationId];
      return true;
    });
  }

  public async sendMessage(
    conversationId: string,
    promptText: string,
    documentId?: string
  ): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
    return apiClient.request<{ userMessage: ChatMessage; assistantMessage: ChatMessage }>(
      `/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({ prompt: promptText, documentId }),
      },
      async () => {
        // User message creation
        const userMsg: ChatMessage = {
          id: `msg-${Date.now()}-u`,
          conversationId,
          role: 'user',
          content: promptText,
          timestamp: new Date().toISOString(),
          status: 'done',
        };

        if (!this.messages[conversationId]) {
          this.messages[conversationId] = [];
        }
        this.messages[conversationId].push(userMsg);

        // Simulate AI RAG reasoning latency
        await apiClient.simulateDelay(1200);

        // Generate context-aware mock response & sources
        const activeDoc = this.documents.find((d) => d.id === documentId) || this.documents[0];
        const msgId = `msg-${Date.now()}-a`;

        const mockSources: SourceChunk[] = [
          {
            id: `src-${Date.now()}-1`,
            documentId: activeDoc.id,
            documentTitle: activeDoc.title,
            chunkIndex: Math.floor(Math.random() * 20) + 1,
            pageNumber: Math.floor(Math.random() * 10) + 1,
            content: `Relevant section regarding "${promptText.slice(0, 30)}...": In accordance with ${activeDoc.title} guidelines, system parameters maintain strict operational boundaries and optimal resource allocation across enterprise nodes.`,
            score: Number((0.88 + Math.random() * 0.1).toFixed(2)),
            tags: ['RAG Retrieval', 'Vector Match', activeDoc.fileType.toUpperCase()],
          },
          {
            id: `src-${Date.now()}-2`,
            documentId: activeDoc.id,
            documentTitle: activeDoc.title,
            chunkIndex: Math.floor(Math.random() * 20) + 21,
            pageNumber: Math.floor(Math.random() * 10) + 11,
            content: `Supplementary context from document ${activeDoc.filename}: Key performance indicators demonstrate verifiable reliability and high-fidelity output generation.`,
            score: Number((0.79 + Math.random() * 0.1).toFixed(2)),
            tags: ['Context Chunk', 'Similarity High'],
          },
        ];

        this.sources[msgId] = mockSources;

        const assistantMsg: ChatMessage = {
          id: msgId,
          conversationId,
          role: 'assistant',
          content: `Based on the uploaded document **${activeDoc.title}**, here is the synthesized answer for your query:

### 📌 Summary & Findings
* **Query Analyzed:** "${promptText}"
* **Source Document:** \`${activeDoc.filename}\` (${activeDoc.chunkCount} vector chunks searched)

### 💡 Detailed Answer
Regarding your question about **${promptText}**, the RAG vector engine retrieved relevant contexts indicating:

1. **Primary Compliance / Operational Standard:** The document outlines structured governance models ensuring data integrity and high availability.
2. **Key Metric:** Operational confidence score is calculated at **${(mockSources[0].score * 100).toFixed(1)}%**.
3. **Actionable Takeaway:** All referenced parameters align with CREOZEN LTD enterprise deployment standards.

*Feel free to select "View Sources" in the right panel to examine the exact extracted chunk citations.*`,
          timestamp: new Date().toISOString(),
          sources: mockSources,
          status: 'done',
        };

        this.messages[conversationId].push(assistantMsg);

        // Update conversation state
        const conv = this.conversations.find((c) => c.id === conversationId);
        if (conv) {
          conv.lastMessageText = promptText;
          conv.messageCount = this.messages[conversationId].length;
          conv.updatedAt = new Date().toISOString();
        }

        return { userMessage: userMsg, assistantMessage: assistantMsg };
      }
    );
  }
}

export const chatService = new ChatService();
