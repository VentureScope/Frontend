"use client";

import { useMemo, useState } from "react";
import {
  adminEmeraldBtn,
  adminGhostBtn,
  adminInput,
  adminPage,
} from "@/components/admin/ui/admin-styles";
import { BROADCAST_HISTORY } from "@/lib/admin-mock-data";

export function Broadcasts() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [roles, setRoles] = useState<string[]>(["All Users"]);

  const canSend = subject.trim().length > 0 && body.trim().length > 0;
  const recipientCount = useMemo(() => {
    if (roles.includes("All Users")) return 2847;
    return roles.length * 400;
  }, [roles]);

  return (
    <div className={`${adminPage} grid grid-cols-5 gap-4`}>
      <div className="col-span-3 border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-4 text-sm font-medium text-white">Send Platform Broadcast</h2>

        <div className="mb-4 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600">To</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {["All Users", "Students", "Professionals", "B2B Clients"].map((r) => (
              <label key={r} className="flex items-center gap-1.5 text-zinc-400">
                <input
                  type="checkbox"
                  checked={roles.includes(r)}
                  onChange={() =>
                    setRoles((prev) =>
                      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
                    )
                  }
                  className="rounded border-zinc-700"
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600">Channel</p>
          <div className="flex gap-4 text-xs text-zinc-400">
            {["In-App", "Email", "Push"].map((ch) => (
              <label key={ch} className="flex items-center gap-1.5">
                <input type="checkbox" defaultChecked={ch === "In-App"} />
                {ch}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-3 space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-zinc-600">
            Subject
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={adminInput}
          />
        </div>

        <div className="mb-3 space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-zinc-600">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${adminInput} min-h-[150px] resize-y`}
          />
        </div>

        <p className="text-xs text-zinc-500">
          {recipientCount.toLocaleString()} recipients
        </p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={!canSend}
            className={`${adminEmeraldBtn} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Send Now
          </button>
          <button
            type="button"
            disabled={!canSend}
            className={`${adminGhostBtn} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Schedule
          </button>
        </div>
      </div>

      <div className="col-span-2 border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-3 text-sm font-medium text-white">Broadcast History</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              {["Subject", "Sent To", "Sent At", "Status"].map((col) => (
                <th
                  key={col}
                  className="px-2 py-2 text-left text-[10px] font-normal uppercase tracking-widest text-zinc-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BROADCAST_HISTORY.map((row) => (
              <tr key={row.id} className="border-b border-zinc-800/50">
                <td
                  className="max-w-[120px] truncate px-2 py-2 text-xs text-zinc-300"
                  title={row.subject}
                >
                  {row.subject}
                </td>
                <td className="px-2 py-2 text-xs text-zinc-400">{row.sentTo}</td>
                <td className="px-2 py-2 font-mono text-xs text-zinc-400">{row.sentAt}</td>
                <td className="px-2 py-2 font-mono text-xs text-emerald-400">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
