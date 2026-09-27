// Sidebar listing saved conversations with new/select/delete actions.
export default function Sidebar({
  conversations,
  activeId,
  onNew,
  onSelect,
  onDelete,
  open,
  onClose,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed z-30 h-full w-64 shrink-0 transform border-r border-slate-800 bg-slate-950 transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-3">
          <button
            onClick={onNew}
            className="mb-4 w-full rounded-lg border border-slate-700 px-3 py-2.5 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
          >
            + New chat
          </button>

          <div className="flex-1 space-y-1 overflow-y-auto">
            {conversations.length === 0 && (
              <p className="px-2 py-4 text-center text-xs text-slate-500">
                No conversations yet.
              </p>
            )}
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  c.id === activeId
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <button
                  onClick={() => onSelect(c.id)}
                  className="flex-1 truncate text-left"
                  title={c.title}
                >
                  {c.title || "New conversation"}
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="shrink-0 text-slate-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  aria-label="Delete conversation"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-slate-800 pt-3 text-center text-xs text-slate-500">
            AI Chat Assistant
          </div>
        </div>
      </aside>
    </>
  );
}
