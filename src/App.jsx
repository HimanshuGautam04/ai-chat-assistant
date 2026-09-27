import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { sendMessage, isDemoMode } from "./services/aiService";

const STORAGE_KEY = "ai_chat_conversations";

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function createConversation() {
  return { id: Date.now().toString(), title: "", messages: [] };
}

export default function App() {
  const [conversations, setConversations] = useState(loadConversations);
  const [activeId, setActiveId] = useState(
    () => conversations[0]?.id || null
  );
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const typingTimer = useRef(null);

  // Persist to localStorage whenever conversations change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  // Clean up any pending typing interval on unmount.
  useEffect(() => () => clearInterval(typingTimer.current), []);

  const activeConversation =
    conversations.find((c) => c.id === activeId) || null;
  const messages = activeConversation?.messages || [];

  function handleNew() {
    const conv = createConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setSidebarOpen(false);
  }

  function handleSelect(id) {
    setActiveId(id);
    setSidebarOpen(false);
  }

  function handleDelete(id) {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (id === activeId) setActiveId(next[0]?.id || null);
      return next;
    });
  }

  // Reveal the assistant reply gradually for a "streaming" feel.
  function typeOutReply(fullText) {
    return new Promise((resolve) => {
      let i = 0;
      setTypingText("");
      clearInterval(typingTimer.current);
      typingTimer.current = setInterval(() => {
        i += 2; // characters per tick
        setTypingText(fullText.slice(0, i));
        if (i >= fullText.length) {
          clearInterval(typingTimer.current);
          setTypingText(null);
          resolve();
        }
      }, 15);
    });
  }

  async function handleSend(text) {
    // Ensure there is an active conversation.
    let convId = activeId;
    if (!convId) {
      const conv = createConversation();
      conv.messages = [];
      convId = conv.id;
      setConversations((prev) => [conv, ...prev]);
      setActiveId(convId);
    }

    const userMsg = { role: "user", content: text };

    // Append the user message (and set a title from the first message).
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              title: c.title || text.slice(0, 40),
              messages: [...c.messages, userMsg],
            }
          : c
      )
    );

    setLoading(true);
    try {
      const history = [
        ...(conversations.find((c) => c.id === convId)?.messages || []),
        userMsg,
      ];
      const reply = await sendMessage(history);
      setLoading(false);
      await typeOutReply(reply);
      // Commit the finished assistant message.
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, { role: "assistant", content: reply }] }
            : c
        )
      );
    } catch (err) {
      setLoading(false);
      setTypingText(null);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    role: "assistant",
                    content: `⚠️ Error: ${err.message}`,
                  },
                ],
              }
            : c
        )
      );
    }
  }

  return (
    <div className="flex h-full">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNew={handleNew}
        onSelect={handleSelect}
        onDelete={handleDelete}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex h-full flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 md:hidden"
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-slate-100">
            AI Chat Assistant
          </h1>
          {isDemoMode && (
            <span className="ml-auto rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
              Demo Mode
            </span>
          )}
        </header>

        <ChatWindow
          messages={messages}
          typingText={typingText}
          loading={loading}
        />
        <ChatInput onSend={handleSend} disabled={loading || typingText !== null} />
      </div>
    </div>
  );
}
