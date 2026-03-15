"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface RoomObjectProps {
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

const categoryColors: Record<string, string> = {
  work: "#d4a574",
  hobby: "#6b8e6a",
  wellness: "#a8c5a0",
  social: "#c4a0b8",
};

export default function RoomObject({
  name,
  emoji,
  category,
  position_x,
  position_y,
  entry_text,
  ai_summary,
  created_at,
  isNew = false,
}: RoomObjectProps) {
  const [open, setOpen] = useState(false);
  const color = categoryColors[category] ?? "#d4a574";
  const date = new Date(created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <motion.div
        className="absolute cursor-pointer select-none"
        style={{ left: `${position_x}%`, top: `${position_y}%` }}
        initial={isNew ? { opacity: 0, scale: 0.3 } : { opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.2, zIndex: 10 }}
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-3xl"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {emoji}
          </motion.div>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white whitespace-nowrap opacity-0 group-hover:opacity-100"
            style={{ backgroundColor: color }}
          >
            {name}
          </span>
        </div>

        {/* Tooltip on hover */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
          <div className="bg-[var(--slate)] text-white text-[10px] rounded-lg px-2 py-1 whitespace-nowrap opacity-0 hover:opacity-100 shadow-md">
            {name}
          </div>
        </div>
      </motion.div>

      {/* Detail modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div
                className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{emoji}</span>
                    <div>
                      <h3 className="font-serif text-lg text-[var(--slate)]">
                        {name}
                      </h3>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white capitalize"
                        style={{ backgroundColor: color }}
                      >
                        {category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-[var(--slate)]/40 hover:text-[var(--slate)] transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </div>

                {ai_summary && (
                  <p className="text-sm text-[var(--slate)]/70 italic mb-3 leading-relaxed">
                    "{ai_summary}"
                  </p>
                )}

                <p className="text-sm text-[var(--slate)] leading-relaxed mb-4">
                  {entry_text}
                </p>

                <p className="text-xs text-[var(--slate)]/40">{date}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
