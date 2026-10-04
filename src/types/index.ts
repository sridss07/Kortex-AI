export type FileType = 'pdf' | 'txt' | 'docx' | 'md';

export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'error';

export interface DocumentItem {
  id: string;
  title: string;
  filename: string;
  fileSize: number; // in bytes
  fileType: FileType;
  pageCount?: number;
  chunkCount?: number;
  status: DocumentStatus;
  uploadedAt: string;
  summary?: string;
}

export interface SourceChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  pageNumber?: number;
  content: string;
  score: number; // 0.0 to 1.0 (similarity score)
  tags?: string[];
  snippetStartLine?: number;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: SourceChunk[];
  status?: 'sending' | 'typing' | 'done' | 'error';
  feedback?: 'like' | 'dislike' | null;
}

export interface Conversation {
  id: string;
  title: string;
  documentId?: string;
  documentTitle?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageText: string;
  messageCount: number;
}

export type UploadStage = 'uploading' | 'parsing' | 'extracting' | 'indexing' | 'completed' | 'failed';

export interface UploadProgressState {
  fileName: string;
  fileSize: number;
  progress: number; // 0 - 100
  stage: UploadStage;
  error?: string;
}

export interface ApiConfig {
  baseUrl: string;
  isMock: boolean;
  modelName: string;
  topK: number;
  temperature: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    latencyMs?: number;
    tokenCount?: number;
  };
}
