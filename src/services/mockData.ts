import { DocumentItem, Conversation, ChatMessage, SourceChunk } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-001',
    title: 'CREOZEN Q3 Financial & Strategic Growth Report 2026',
    filename: 'CREOZEN_Q3_Financial_Growth_Report_2026.pdf',
    fileSize: 4200000, // 4.2 MB
    fileType: 'pdf',
    pageCount: 38,
    chunkCount: 142,
    status: 'ready',
    uploadedAt: '2026-10-01T14:32:00Z',
    summary: 'Detailed financial performance, revenue milestones, R&D allocation, and AI expansion strategy for CREOZEN LTD Q3 2026.',
  },
  {
    id: 'doc-002',
    title: 'CREOZEN Enterprise Security & Compliance Standards',
    filename: 'CREOZEN_Security_Compliance_Policy_v4.2.pdf',
    fileSize: 2800000, // 2.8 MB
    fileType: 'pdf',
    pageCount: 24,
    chunkCount: 86,
    status: 'ready',
    uploadedAt: '2026-10-02T09:15:00Z',
    summary: 'Comprehensive ISO 27001, SOC 2 Type II, and GDPR compliance policies governing cloud workspace infrastructure and data encryption.',
  },
  {
    id: 'doc-003',
    title: 'Generative AI RAG Architecture Technical Specification',
    filename: 'RAG_System_Architecture_Spec.md',
    fileSize: 640000, // 640 KB
    fileType: 'md',
    pageCount: 12,
    chunkCount: 45,
    status: 'ready',
    uploadedAt: '2026-10-03T18:45:00Z',
    summary: 'Technical architecture specification covering document parsing, chunking strategies, vector index embeddings, and hybrid search pipelines.',
  }
];

export const INITIAL_SOURCES: Record<string, SourceChunk[]> = {
  'msg-102': [
    {
      id: 'src-001',
      documentId: 'doc-001',
      documentTitle: 'CREOZEN Q3 Financial & Strategic Growth Report 2026',
      chunkIndex: 14,
      pageNumber: 12,
      content: 'In Q3 2026, CREOZEN LTD achieved total recurring revenue of £14.8M, representing a 42% YoY increase driven primarily by the Enterprise AI workspace rollout. Gross margins expanded to 81.4% due to infrastructure optimization.',
      score: 0.94,
      tags: ['Financials', 'Revenue', 'Q3 Growth'],
    },
    {
      id: 'src-002',
      documentId: 'doc-001',
      documentTitle: 'CREOZEN Q3 Financial & Strategic Growth Report 2026',
      chunkIndex: 19,
      pageNumber: 15,
      content: 'Capital allocation toward R&D totaled £4.1M in Q3, focusing heavily on local document ingestion pipelines, hybrid retrieval-augmented generation (RAG), and zero-trust cloud deployment modules.',
      score: 0.89,
      tags: ['R&D', 'Investments', 'AI Tech'],
    },
    {
      id: 'src-003',
      documentId: 'doc-001',
      documentTitle: 'CREOZEN Q3 Financial & Strategic Growth Report 2026',
      chunkIndex: 28,
      pageNumber: 22,
      content: 'Projections for Q4 estimate recurring revenue between £16.5M and £17.2M, assuming steady enterprise onboardings across EMEA and North American regions.',
      score: 0.82,
      tags: ['Forecast', 'Q4 Projections'],
    },
  ],
  'msg-202': [
    {
      id: 'src-004',
      documentId: 'doc-002',
      documentTitle: 'CREOZEN Enterprise Security & Compliance Standards',
      chunkIndex: 8,
      pageNumber: 6,
      content: 'All document vector embeddings must be encrypted at rest using AES-256 GCM encryption. Key rotation is executed automatically every 90 days via automated cloud KMS policies.',
      score: 0.96,
      tags: ['Security', 'Encryption', 'KMS'],
    },
    {
      id: 'src-005',
      documentId: 'doc-002',
      documentTitle: 'CREOZEN Enterprise Security & Compliance Standards',
      chunkIndex: 15,
      pageNumber: 11,
      content: 'Data retention policies dictate that inactive session vector indices are securely purged after 30 days unless explicitly flagged for compliance archivism by tenant administrators.',
      score: 0.91,
      tags: ['GDPR', 'Retention', 'Privacy'],
    },
  ],
  'msg-302': [
    {
      id: 'src-006',
      documentId: 'doc-003',
      documentTitle: 'Generative AI RAG Architecture Technical Specification',
      chunkIndex: 3,
      pageNumber: 2,
      content: 'The ingestion framework implements semantic chunking using a window size of 512 tokens with a 64-token overlap to maintain contextual continuity across complex tabular data and multi-page technical documents.',
      score: 0.95,
      tags: ['RAG', 'Chunking', 'Vector Search'],
    },
    {
      id: 'src-007',
      documentId: 'doc-003',
      documentTitle: 'Generative AI RAG Architecture Technical Specification',
      chunkIndex: 7,
      pageNumber: 4,
      content: 'Hybrid search combines BM25 keyword matching with dense vector similarity scores (cosine distance) using Reciprocal Rank Fusion (RRF) with a k-factor of 60.',
      score: 0.90,
      tags: ['Hybrid Search', 'RRF', 'Cosine Similarity'],
    },
  ],
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    title: 'Financial Q3 Performance Overview',
    documentId: 'doc-001',
    documentTitle: 'CREOZEN Q3 Financial & Strategic Growth Report 2026',
    createdAt: '2026-10-01T15:00:00Z',
    updatedAt: '2026-10-01T15:10:00Z',
    lastMessageText: 'What were CREOZEN\'s major financial achievements in Q3 2026?',
    messageCount: 2,
  },
  {
    id: 'conv-002',
    title: 'Security & Encryption Protocol Review',
    documentId: 'doc-002',
    documentTitle: 'CREOZEN Enterprise Security & Compliance Standards',
    createdAt: '2026-10-02T10:00:00Z',
    updatedAt: '2026-10-02T10:20:00Z',
    lastMessageText: 'How are vector embeddings encrypted and stored according to security policy?',
    messageCount: 2,
  },
  {
    id: 'conv-003',
    title: 'RAG Ingestion & Chunking Technical Details',
    documentId: 'doc-003',
    documentTitle: 'Generative AI RAG Architecture Technical Specification',
    createdAt: '2026-10-03T19:00:00Z',
    updatedAt: '2026-10-03T19:05:00Z',
    lastMessageText: 'What is the chunking strategy and token overlap window used in the system?',
    messageCount: 2,
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-001': [
    {
      id: 'msg-101',
      conversationId: 'conv-001',
      role: 'user',
      content: 'What were CREOZEN\'s major financial achievements and R&D investments in Q3 2026?',
      timestamp: '2026-10-01T15:00:00Z',
    },
    {
      id: 'msg-102',
      conversationId: 'conv-001',
      role: 'assistant',
      content: `Based on the **CREOZEN Q3 Financial & Strategic Growth Report 2026**, here are the key highlights:

### 📈 Financial Performance
* **Total Recurring Revenue:** Achieved **£14.8M** in Q3 2026, representing a **42% YoY increase** year-over-year.
* **Gross Margins:** Expanded to **81.4%**, bolstered by cloud infrastructure optimizations and direct vector index caching.
* **Q4 Guidance:** Projected revenue range between **£16.5M and £17.2M**.

### 🔬 R&D & Technological Investments
* **Total R&D Allocation:** Invested **£4.1M** directly into Generative AI capabilities.
* **Key Focus Areas:** Local document ingestion engines, hybrid search (dense + sparse retrieval), and zero-trust security modules for enterprise tenants.`,
      timestamp: '2026-10-01T15:00:04Z',
      sources: INITIAL_SOURCES['msg-102'],
      status: 'done',
    },
  ],
  'conv-002': [
    {
      id: 'msg-201',
      conversationId: 'conv-002',
      role: 'user',
      content: 'How are vector embeddings encrypted and stored according to the compliance policy?',
      timestamp: '2026-10-02T10:00:00Z',
    },
    {
      id: 'msg-202',
      conversationId: 'conv-002',
      role: 'assistant',
      content: `According to **CREOZEN Enterprise Security & Compliance Standards**:

1. **Encryption at Rest:** All vector embeddings and chunk indexes are encrypted using **AES-256 GCM**.
2. **KMS Key Rotation:** Cryptographic key rotation is automatically executed every **90 days** via automated cloud KMS policies.
3. **Data Retention & Purging:** Session indexes are held securely and purged after **30 days** of inactivity unless explicitly flagged for enterprise compliance archiving.`,
      timestamp: '2026-10-02T10:00:03Z',
      sources: INITIAL_SOURCES['msg-202'],
      status: 'done',
    },
  ],
  'conv-003': [
    {
      id: 'msg-301',
      conversationId: 'conv-003',
      role: 'user',
      content: 'What is the chunking strategy and token overlap window used in the RAG system?',
      timestamp: '2026-10-03T19:00:00Z',
    },
    {
      id: 'msg-302',
      conversationId: 'conv-003',
      role: 'assistant',
      content: `Per the **Generative AI RAG Architecture Technical Specification**:

* **Chunking Window:** Implements a semantic sliding window of **512 tokens**.
* **Token Overlap:** Maintains a **64-token overlap** between adjacent chunks to prevent context fragmentation across boundaries.
* **Retrieval Hybrid Engine:** Combines **BM25 keyword search** with **dense vector cosine similarity**, scored through **Reciprocal Rank Fusion (RRF)** with a k-factor of 60.`,
      timestamp: '2026-10-03T19:00:03Z',
      sources: INITIAL_SOURCES['msg-302'],
      status: 'done',
    },
  ],
};

// Preset suggested prompt questions for quick demo exploration
export const SAMPLE_PROMPTS = [
  {
    title: 'Financial Summary',
    prompt: 'Summarize the key financial metrics, gross margin expansion, and Q4 revenue projections.',
    icon: 'TrendingUp',
  },
  {
    title: 'Security Standards',
    prompt: 'What are the encryption standards and key rotation policies for stored documents and vector chunks?',
    icon: 'ShieldCheck',
  },
  {
    title: 'RAG Architecture',
    prompt: 'Explain the chunking strategy, token overlap, and hybrid retrieval methodology specified in the architecture.',
    icon: 'Cpu',
  },
  {
    title: 'Risk Analysis',
    prompt: 'What compliance risks or operational dependencies are highlighted in the uploaded documents?',
    icon: 'AlertTriangle',
  }
];
