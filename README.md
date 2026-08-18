# MailPilot — an AI agent that drafts and sends emails from a single natural-language instruction.

[Live Demo]()

## Screenshots
![Hero Section]()
![Interactive Demo in Action]()
![Approval and Send Flow]()

## How it works
User describes a task in natural language. The agent parses this via an LLM, resolves the contact information, and drafts the email accordingly. The user then reviews and approves the draft in a queue before sending. Once approved, the email is queued with a 30-second undo window before being dispatched.

## Features
- Natural language task input
- AI-drafted emails
- Contact resolution
- Approval queue before sending
- 30-second undo window (Note: The timeout is currently kept in-memory. If the Node server restarts during this window, approved drafts must be manually re-approved or sent.)
- Activity log / audit trail
- Recurring tasks and follow-ups
- Rate limiting

## Tech Stack
**Frontend:**
- React (v19)
- Vite
- Tailwind CSS (v4)
- Framer Motion
- shadcn/ui & Radix UI

**Backend:**
- Node.js
- Express
- Supabase (Postgres + Auth)
- OpenRouter API
- Nodemailer (Gmail)
- node-cron

## Getting Started
To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd MailAgent
   ```

2. **Install dependencies:**
   Install frontend dependencies:
   ```bash
   npm install
   ```
   Install backend dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Environment Setup:**
   - Copy `.env.example` to `.env` in the root directory and fill in your keys.
   - Copy `server/.env.example` to `server/.env` and fill in your keys.
   - **Important:** Never commit your `.env` files or any real credentials to a public repository. The `.gitignore` is configured to ignore these files.

4. **Gmail Setup:**
   - You need to generate an App Password in your Google Account security settings.
   - Add your Gmail address and the App Password to `server/.env`.
   - Do NOT put your real password in the README or any tracked files.

5. **Run the development servers:**
   Run the backend (from the `server` directory):
   ```bash
   cd server
   npm run dev # or node index.js depending on your setup
   ```
   Run the frontend (from the root directory):
   ```bash
   npm run dev
   ```
   
   Visit `http://localhost:5173` in your browser.

## Why I built this
I built MailPilot to bridge the gap between natural language intention and actionable communication. I wanted to learn how to integrate LLMs into a robust full-stack application where they make meaningful decisions—like resolving contacts and drafting text—while ensuring the human remains in the loop for final approval. Implementing the approval queue and the 30-second undo window taught me a lot about resilient state management and task scheduling with tools like `node-cron`.
