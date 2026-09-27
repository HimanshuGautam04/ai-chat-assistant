# 🤖 AI Chat Assistant

A modern, responsive **AI chat interface** built with **React.js** and **Tailwind CSS** — inspired by tools like ChatGPT. It features a clean chat UI, a **streaming-style typing effect**, saved **conversation history**, and a pluggable AI service layer.

> Runs out of the box in **Demo Mode** (no API key needed), and can connect to a real LLM (OpenAI) by adding an environment variable.

---

## ✨ Features

- **Chat interface** — user and assistant message bubbles with avatars
- **Streaming-style typing effect** — replies are revealed progressively with a blinking cursor, mimicking real AI streaming
- **Conversation history** — create, switch between, and delete multiple conversations from the sidebar
- **Persistent storage** — conversations are saved to `localStorage` and survive refreshes
- **Demo Mode** — works with zero configuration using a local heuristic response engine (great for instant demos/deploys)
- **Pluggable real AI** — add an OpenAI API key to switch to real model responses
- **Responsive design** — collapsible sidebar drawer on mobile, full layout on desktop
- **Keyboard UX** — `Enter` to send, `Shift+Enter` for a new line

---

## 🧰 Tech Stack

| Area          | Technology                     |
| ------------- | ------------------------------ |
| Framework     | React 19                       |
| Build tool    | Vite                           |
| Styling       | Tailwind CSS v4                |
| State         | React Hooks (`useState`, `useEffect`, `useRef`) |
| Persistence   | Browser `localStorage`         |
| AI (optional) | OpenAI Chat Completions API    |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ and npm

### Installation

```bash
git clone https://github.com/HimanshuGautam04/ai-chat-assistant.git
cd ai-chat-assistant
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). The app runs in **Demo Mode** by default.

### Connecting a real AI model (optional)

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=sk-your-key-here
   VITE_OPENAI_MODEL=gpt-4o-mini
   ```
3. Restart the dev server. The "Demo Mode" badge disappears and replies come from the real model.

> ⚠️ Never commit your `.env` file — it's already in `.gitignore`.

---

## 📁 Project Structure

```
ai-chat-assistant/
├── src/
│   ├── components/
│   │   ├── ChatInput.jsx     # Message input (Enter to send)
│   │   ├── ChatWindow.jsx    # Message list + auto-scroll + empty state
│   │   ├── Message.jsx       # Single chat bubble
│   │   └── Sidebar.jsx       # Conversation history
│   ├── services/
│   │   └── aiService.js      # Demo engine + optional OpenAI API
│   ├── App.jsx               # State, persistence, typing effect
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind + theme + animations
├── .env.example
├── index.html
├── vite.config.js
└── package.json
```

---

## 🧠 Architecture Notes

- **AI service abstraction** — `aiService.js` exposes a single `sendMessage(messages)` function. The UI doesn't care whether the response comes from the local demo engine or a real API, which keeps the components clean and makes swapping providers trivial.
- **Streaming effect** — the assistant reply is revealed character-by-character using a timed interval in `App.jsx`, giving a real-time "typing" feel without needing a streaming API.
- **Persistence** — conversations are serialized to `localStorage` on every change and restored on load.

---

Built by **Himanshu Gautam** — [GitHub](https://github.com/HimanshuGautam04) · [LinkedIn](https://linkedin.com/in/himanshugtm043)
