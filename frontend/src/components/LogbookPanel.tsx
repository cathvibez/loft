"use client";

import { useState } from "react";

interface Entry {
  id: string;
  text: string;
  category: string;
  ai_summary: string;
  created_at: string;
}

interface RoomObj {
  id: string;
  name: string;
  emoji: string;
  category: string;
  position_x: number;
  position_y: number;
  entry_text: string;
  ai_summary: string;
  created_at: string;
  isNew?: boolean;
}

interface LogbookPanelProps {
  entries: Entry[];
  onNewObject: (obj: RoomObj) => void;
}

const categoryColors: Record<string, string> = {
  work: "#d4a574",
  hobby: "#6b8e6a",
  wellness: "#a8c5a0",
  social: "#c4a0b8",
};

const categoryLabels: Record<string, string> = {
  work: "Work",
  hobby: "Hobby",
  wellness: "Wellness",
  social: "Social",
};

export default function LogbookPanel({
  entries: initialEntries,
  onNewObject,
}: LogbookPanelProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>(initialEntries);

  const handleSubmit = async () => {
    if (text.trim().length < 5) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      const { entry, object } = await res.json();

      setEntries((prev) => [entry, ...prev].slice(0, 20));
      onNewObject({
        ...object,
        entry_text: entry.text,
        ai_summary: entry.ai_summary,
        created_at: entry.created_at,
        isNew: true,
      });
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-[var(--slate)]">The Loft</h1>
        <p className="text-xs text-[var(--slate)]/50 mt-0.5">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Entry form */}
      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What happened today?"
          disabled={loading}
          rows={5}
          className="w-full resize-none rounded-xl border border-[var(--ochre)]/30 bg-white/60 px-4 py-3 text-sm text-[var(--slate)] placeholder-[var(--slate)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--ochre)]/40 transition disabled:opacity-60"
          maxLength={2000}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
          }}
        />

        <div className="flex items-center justify-between">
          <span
            className={`text-xs ${text.length > 1800 ? "text-red-400" : "text-[var(--slate)]/30"}`}
          >
            {text.length} / 2000
          </span>

          <button
            onClick={handleSubmit}
            disabled={loading || text.trim().length < 5}
            className="bg-[var(--slate)] text-white text-sm font-medium rounded-xl px-5 py-2.5 hover:bg-[var(--slate)]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-w-[100px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                thinking…
              </span>
            ) : (
              "Add to room"
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>

      <div className="w-full h-px bg-[var(--ochre)]/20" />

      {/* Recent entries */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {entries.length === 0 ? (
          <p className="text-xs text-[var(--slate)]/30 italic text-center py-4">
            No entries yet
          </p>
        ) : (
          entries.slice(0, 10).map((entry) => (
            <div
              key={entry.id}
              className="group bg-white/50 rounded-xl px-3 py-2.5 border border-[var(--ochre)]/10 hover:border-[var(--ochre)]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-white uppercase tracking-wide"
                      style={{
                        backgroundColor:
                          categoryColors[entry.category] ?? "#d4a574",
                      }}
                    >
                      {categoryLabels[entry.category] ?? entry.category}
                    </span>
                    <span className="text-[10px] text-[var(--slate)]/30">
                      {new Date(entry.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--slate)]/70 line-clamp-2 leading-relaxed">
                    {entry.ai_summary || entry.text}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="opacity-0 group-hover:opacity-100 text-[var(--slate)]/20 hover:text-red-400 transition-all text-base leading-none shrink-0 mt-0.5"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
