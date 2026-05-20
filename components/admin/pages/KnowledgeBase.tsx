"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  adminGhostBtn,
  adminInput,
  adminPage,
  adminRedBtn,
} from "@/components/admin/ui/admin-styles";
import { KNOWLEDGE_CHUNKS, type KnowledgeChunk } from "@/lib/admin-mock-data";

export function KnowledgeBase() {
  const [selected, setSelected] = useState<KnowledgeChunk>(KNOWLEDGE_CHUNKS[0]);
  const [content, setContent] = useState(selected.content);
  const [dirty, setDirty] = useState(false);

  function selectChunk(chunk: KnowledgeChunk) {
    setSelected(chunk);
    setContent(chunk.content);
    setDirty(false);
  }

  const grouped = KNOWLEDGE_CHUNKS.reduce<Record<string, KnowledgeChunk[]>>((acc, c) => {
    (acc[c.userName] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className={adminPage}>
      <div className="mb-4 rounded-md border border-amber-900/60 bg-amber-950/40 px-4 py-3 text-sm text-amber-200/90">
        <span className="font-medium text-amber-300">Preview only.</span> Knowledge
        chunks are mock data until an admin knowledge-base API is available.
      </div>
    <div className={`flex h-[calc(100vh-7rem)] gap-0 border border-zinc-800`}>
      <div className="flex w-[300px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
        <div className="space-y-2 border-b border-zinc-800 p-3">
          <input type="search" placeholder="Search chunks…" className={`${adminInput} text-xs`} />
          <button type="button" className={`${adminGhostBtn} w-full`}>
            + New Chunk
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {Object.entries(grouped).map(([userName, chunks]) => (
            <div key={userName} className="mb-3">
              <p className="px-2 py-1 font-mono text-xs text-zinc-500">{userName}</p>
              {chunks.map((chunk) => (
                <button
                  key={chunk.id}
                  type="button"
                  onClick={() => selectChunk(chunk)}
                  className={`mb-0.5 w-full border-l-2 px-2 py-1.5 text-left text-xs transition-colors ${
                    selected.id === chunk.id
                      ? "border-emerald-400 bg-zinc-800 text-white"
                      : "border-transparent text-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  <span className="text-zinc-300">Chunk #{chunk.index}</span>
                  <p className="truncate text-zinc-500">{chunk.preview}</p>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-zinc-900 p-4">
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <h2 className="text-sm font-medium text-white">
            Editing: Chunk #{selected.index} for {selected.userName}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!dirty}
              className={`${adminGhostBtn} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Save
            </button>
            <button type="button" className={adminRedBtn}>
              Delete
            </button>
            <button type="button" className={adminGhostBtn}>
              Re-embed
            </button>
          </div>
        </div>

        {dirty && (
          <div className="mb-3 flex items-start gap-2 rounded-md border border-amber-800 bg-amber-950 p-2 text-xs text-amber-300">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            Unsaved changes — re-embed required after save.
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setDirty(true);
          }}
          className="min-h-[200px] w-full flex-1 resize-y border border-zinc-800 bg-zinc-900 p-3 font-mono text-sm text-zinc-300 focus:border-zinc-600 focus:outline-none"
        />

        <div className="mt-2 flex gap-6 font-mono text-xs text-zinc-500">
          <span>
            Embedding:{" "}
            {selected.embeddingStatus === "synced" ? (
              <span className="text-emerald-400">✓ synced</span>
            ) : (
              <span className="text-amber-400">○ pending</span>
            )}{" "}
            {selected.syncedAt}
          </span>
          <span>Tokens: {selected.tokens}</span>
          <span>Vector dims: 1536</span>
        </div>
      </div>
    </div>
    </div>
  );
}
