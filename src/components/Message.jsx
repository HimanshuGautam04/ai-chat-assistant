// A single chat message bubble. Styles differ for user vs assistant.
export default function Message({ role, content, isTyping }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold">
          AI
        </div>
      )}
      <div
        className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-indigo-600 text-white"
            : "rounded-bl-sm bg-slate-800 text-slate-100"
        } ${isTyping ? "typing-cursor" : ""}`}
      >
        {content}
      </div>
      {isUser && (
        <div className="ml-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-600 text-sm font-bold">
          You
        </div>
      )}
    </div>
  );
}
