# CREOZEN LTD - Generative AI Workspace Frontend

A modern, responsive, enterprise-grade AI application UI built for **CREOZEN LTD**. This frontend provides a clean, decoupled user interface for Document Uploading, AI Chat Workspace, Conversation & Document History, and Grounding Sources/Citations retrieval.

---

## 🌟 Key Features

1. **Document Ingestion UI & Drag-and-Drop Upload Modal**
   * Multi-file drag-and-drop zone supporting `.pdf`, `.txt`, `.docx`, and `.md`.
   * Real-time progress bar simulating stages: Uploading $\rightarrow$ Text Extraction $\rightarrow$ Chunking & Vector Indexing $\rightarrow$ Ready.
   * Workspace document context selection and active document indicators.

2. **AI Workspace & Chat Interface**
   * Rich AI assistant chat stream with formatted headings, bullet lists, bold text, and code snippets.
   * Context locking to ask questions specifically grounded in a selected document or across the entire workspace knowledge base.
   * Interactive typing and reasoning states simulating vector retrieval latency.
   * Suggested sample questions for fast exploration.

3. **RAG Grounding Sources & Citations Panel**
   * Dedicated collapsible right panel displaying retrieved document chunks for AI responses.
   * Displays Similarity Score badges (e.g., `94% Match`), Page Numbers, Chunk Indexes, Metadata Tags, and full text excerpts.
   * Direct copy chunk text and view document context actions.

4. **Document & Conversation History Sidebar**
   * Left navigation drawer featuring separate tabs for **Chats** and **Uploaded Documents**.
   * Real-time search filter for instant history lookup.
   * Session creation, history switching, and item deletion.

5. **Decoupled Service Architecture & Backend API Ready**
   * Clean separation between UI components and backend communication via `src/services/apiClient.ts` and `src/services/chatService.ts`.
   * Operates out-of-the-box in **Mock Service Mode** using realistic datasets.
   * Automatically connects to live backend endpoints whenever `VITE_API_BASE_URL` is set in the environment.

---

## 🏗️ Project Architecture & Service Layer Relationship

```
+-------------------------------------------------------------------------+
|                           React + TypeScript UI                         |
|   (Header, HistorySidebar, ChatWorkspace, SourcesPanel, UploadModal)    |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                       API Service Abstraction Layer                     |
|           (src/services/chatService.ts & src/services/apiClient.ts)     |
+-------------------------------------------------------------------------+
                                     |
                  +------------------+------------------+
                  | (Mock Mode)                         | (Live API Mode)
                  v                                     v
+-----------------------------------+   +---------------------------------+
|  Realistic Enterprise Mock Data   |   |   CREOZEN Backend API Server    |
|  (src/services/mockData.ts)       |   |   (FastAPI / Express / RAG)     |
+-----------------------------------+   +---------------------------------+
```

### How Backend Teammates Connect Real Endpoints

The frontend is strictly **UI-only**. No LLM execution, vector databases, or backend logic reside in this codebase.

To connect the frontend to a live backend:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Set the `VITE_API_BASE_URL` variable to your hosted backend API:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
3. Implement standard JSON REST endpoints matching the service signatures defined in `src/services/chatService.ts`:
   * `GET /documents` $\rightarrow$ returns `DocumentItem[]`
   * `POST /documents/upload` $\rightarrow$ multipart upload returning `DocumentItem`
   * `DELETE /documents/:id` $\rightarrow$ returns boolean
   * `GET /conversations` $\rightarrow$ returns `Conversation[]`
   * `GET /conversations/:id/messages` $\rightarrow$ returns `ChatMessage[]`
   * `POST /conversations/:id/messages` $\rightarrow$ payload `{ prompt, documentId }`, returns `{ userMessage, assistantMessage }`

---

## 📂 Project Structure

```
c:/Users/sri09/Downloads/Kortex AI/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatWorkspace.tsx
│   │   │   ├── MessageItem.tsx
│   │   │   └── SamplePrompts.tsx
│   │   ├── history/
│   │   │   └── HistorySidebar.tsx
│   │   ├── layout/
│   │   │   └── Header.tsx
│   │   ├── settings/
│   │   │   └── SettingsModal.tsx
│   │   ├── sources/
│   │   │   └── SourcesPanel.tsx
│   │   └── upload/
│   │       └── DocumentUploadModal.tsx
│   ├── services/
│   │   ├── apiClient.ts      # HTTP wrapper & env configuration
│   │   ├── chatService.ts    # Service methods & mock fallback
│   │   └── mockData.ts       # Realistic CREOZEN enterprise mock dataset
│   ├── types/
│   │   └── index.ts          # Strict TypeScript interfaces
│   ├── App.tsx               # Root component & state orchestration
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind directives & glassmorphism
├── .env.example              # Environment variable template
├── .gitignore                # Git exclusions
├── index.html                # HTML container
├── package.json              # Dependencies & scripts
├── postcss.config.js         # PostCSS plugins
├── tailwind.config.js        # Tailwind CSS theme & colors
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite config with alias setup (@/ -> ./src)
└── README.md                 # Project documentation
```

---

## 🛠️ Quick Start & Local Setup

### Prerequisites
* Node.js v18+ or v22+
* npm or yarn

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

The application will be available at [https://kortex-ai-seven.vercel.app/](https://kortex-ai-seven.vercel.app/)

### Build for Production
```bash
npm run build
```

---

## 📜 License & Ownership

Developed for **CREOZEN LTD Generative AI Project**.
