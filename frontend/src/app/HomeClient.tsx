"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import LogbookPanel from "@/components/LogbookPanel";
import RoomView from "@/components/RoomView";

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

interface HomeClientProps {
  initialEntries: Entry[];
  initialObjects: RoomObj[];
  userName: string;
}

export default function HomeClient({
  initialEntries,
  initialObjects,
  userName,
}: HomeClientProps) {
  const [objects, setObjects] = useState<RoomObj[]>(initialObjects);

  const handleNewObject = (obj: RoomObj) => {
    setObjects((prev) => [...prev, obj]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)]">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--ochre)]/20">
        <span className="font-serif text-[var(--slate)] text-sm">
          {userName ? `${userName}'s loft` : "The Loft"}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs text-[var(--slate)]/40 hover:text-[var(--slate)] transition-colors"
        >
          sign out
        </button>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — logbook */}
        <div className="w-full md:w-[380px] md:min-w-[380px] flex flex-col p-6 border-r border-[var(--ochre)]/20 overflow-y-auto">
          <LogbookPanel
            entries={initialEntries}
            onNewObject={handleNewObject}
          />
        </div>

        {/* Right panel — room */}
        <div className="hidden md:flex flex-1 p-6">
          <RoomView objects={objects} />
        </div>
      </div>
    </div>
  );
}
