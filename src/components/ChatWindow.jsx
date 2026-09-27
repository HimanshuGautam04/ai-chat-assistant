import { useEffect, useRef } from "react";
import Message from "./Message";

export default function ChatWindow({ messages, typingText, loading }) {
  const bottomRef = useRef(null);

  // Auto-scroll to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  const isEmpty = messages.length === 0 && !typingText && !loading;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-3xl">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center py-24 text-center text-slate-400">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold">
              AI
            </div>
            <h2 className="text-xl font-semibold text-slate-200">
              How can I help you today?
            </h2>
            <p className="mt-2 max-w-md text-sm">
              Ask me anything. Try "What is React?" or "Tell me about
              JavaScript."
            </p>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <Message key={i} role={m.role} content={m.content} />
            ))}
            {/* Streaming assistant text being typed out */}
            {typingText !== null && typingText !== undefined && (
              <Message role="assistant" content={typingText} isTyping />
            )}
            {/* Loading indicator before the first token arrives */}
            {loading && typingText === null && (
              <Message role="assistant" content="Thinking..." isTyping />
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
