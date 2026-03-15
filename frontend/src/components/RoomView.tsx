"use client";

import RoomObject from "./RoomObject";

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

interface RoomViewProps {
  objects: RoomObj[];
}

export default function RoomView({ objects }: RoomViewProps) {
  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden">
      {/* Room background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #e8d5c4 0%, #f0e0cc 40%, #dcc8a8 100%)",
        }}
      >
        {/* Floor line */}
        <div
          className="absolute w-full"
          style={{
            top: "65%",
            height: "35%",
            background:
              "linear-gradient(180deg, #c9a87c 0%, #b8956a 100%)",
          }}
        />
        {/* Wall/floor divider */}
        <div
          className="absolute w-full h-[2px]"
          style={{ top: "65%", background: "#a07848", opacity: 0.4 }}
        />
        {/* Subtle window */}
        <div
          className="absolute rounded-lg border-2 border-[#a07848]/30"
          style={{
            top: "12%",
            right: "15%",
            width: "18%",
            aspectRatio: "3/4",
            background:
              "linear-gradient(135deg, rgba(255,240,200,0.6), rgba(200,220,255,0.4))",
          }}
        />
        {/* Skirting board */}
        <div
          className="absolute w-full h-3"
          style={{ top: "calc(65% - 12px)", background: "#8b6340", opacity: 0.3 }}
        />
      </div>

      {/* Objects */}
      {objects.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[var(--slate)]/40 text-sm italic text-center px-8">
            Your room is empty. Write your first entry to fill it with objects.
          </p>
        </div>
      ) : (
        objects.map((obj) => (
          <RoomObject key={obj.id} {...obj} />
        ))
      )}
    </div>
  );
}
