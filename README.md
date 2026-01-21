# DocuChat Secure

A lightweight, privacy-first document Q&A chat built with Next.js and Firebase Studio. Upload documents from your browser and ask questions — DocuChat Secure answers strictly from the content you provide and surfaces source excerpts.

Live demo: (local only — runs in your browser; no external DB required)

---

## Highlights

- ✨ Clean, responsive chat UI for asking questions about uploaded documents
- 🔒 Privacy-first: documents are kept in-memory for the user session (no database by default)
- 📄 Supports text and PDF uploads (.txt, .md, .text, .pdf)
- 📚 Shows source excerpts and citations used to form answers
- ⚡ Built with TypeScript, Next.js, and modern React patterns (app router, client/server components)
- 🧩 Extensible — easy to add persistence, authentication, or external LLM backends

---

## Screenshots

(Replace these placeholders with actual screenshots/gifs)

- Upload documents and the document manager
- Chat interface with answers and "View Sources" accordion
- Login flow (session-based)

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [How it works (high level)](#how-it-works-high-level)
- [File types & limits](#file-types--limits)
- [Project structure](#project-structure)
- [Extending & customization](#extending--customization)
- [Security & privacy](#security--privacy)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Document upload and simple management UI (list, remove)
- PDF content extraction with images and text fallback
- Chat-based Q&A that references document sources
- Session-based user login (stored in sessionStorage)
- Accessibility-minded UI components and responsive layout

---

## Quick Start

Requirements:
- Node 18+ / Node 20 recommended
- npm (or pnpm/yarn)

1. Clone
   git clone https://github.com/hemantgowardipe/uapp_chatbot.git
2. Install dependencies
   cd uapp_chatbot
   npm install
3. Run in development
   npm run dev
4. Open in browser
   http://localhost:3000

Common scripts (package.json):
- npm run dev — run Next.js in dev mode
- npm run build — build for production
- npm run start — start production server after build

---

## How it works (high level)

1. User logs in with a name (stored in sessionStorage).
2. User uploads documents via the Document Manager (sidebar).
3. PDFs are parsed in the browser (pdfjs-dist) to extract text and inline images where possible.
4. Document content is kept in-memory for the session (no DB).
5. The chat interface sends user queries to the local logic which uses the uploaded document content to produce answers and choose supporting excerpts.
6. Answers show "View Sources" so users can verify the origin of responses.

---

## File types & limits

- Supported: `.txt`, `.md`, `.text`, `.pdf`
- PDFs are parsed client-side using pdfjs-dist; large PDFs may take longer or be limited by browser memory.
- Documents are stored in-memory per session — consider adding backend storage for long-term persistence.

---

## Project structure (important files)

- src/app/page.tsx — main entry, guards login
- src/app/login/page.tsx — login UI (session-based)
- src/components/document-manager.tsx — upload UI + PDF extraction
- src/components/chat-interface.tsx — chat UI (assistant + sources)
- src/contexts/app-context.tsx — application state (documents, messages, user)
- src/components/* & src/components/ui/* — UI primitives and components

See docs/blueprint.md for the original app blueprint and features.

---

## Extending & customization

Ideas to enhance the app:
- Add server-side persistence (Firestore, SQLite, etc.) and migrate sessionStorage to real accounts.
- Integrate a managed LLM / embeddings service to support semantic retrieval and better answers.
- Add user authentication with Firebase Auth or OAuth providers.
- Improve document chunking, indexing, and retrieval for large documents.
- Add file size limits, progress UI, and background workers for heavy parsing.

Helpful libraries already used:
- Next.js (app router)
- TypeScript
- pdfjs-dist (PDF parsing)
- lucide-react + custom UI primitives

---

## Security & Privacy

- Document contents are kept in-memory on the client by default; they are not uploaded to any remote server by this starter.
- If you add a backend or external APIs (LLMs, storage), be explicit about where data is sent and consider encryption / consent flows.
- The session username is stored in sessionStorage — change this as needed for your auth model.

---

## Troubleshooting

- If PDF text extraction fails for a particular file, try re-saving the PDF as "optimized" or convert to text-first format.
- For large PDFs or many documents, browser memory usage will grow — consider adding server-side processing.
- If sessionStorage is disabled by the browser, the app will fall back but may lose session persistence.

---

## Contributing

Contributions are welcome! Suggested workflow:
1. Fork the repo
2. Create a feature branch
3. Run tests / verify UI locally
4. Open a PR with a clear description

Please open issues to discuss larger design changes first.

---

## License

Specify your license here (e.g. MIT). If you don't have one yet, add a LICENSE file.

---

## Contact

Maintainer: hemantgowardipe  
Repo: https://github.com/hemantgowardipe/uapp_chatbot

---

If you'd like, I can:
- Open a PR that replaces the existing README with this version, or
- Make a smaller README variant (shorter or focused for users/devs), or
- Add example screenshots and a sample .env.example if you plan to add external services.

Tell me which you'd prefer and I’ll proceed.
