import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const objects = await getDb()`
    SELECT
      o.id,
      o.name,
      o.emoji,
      o.category,
      o.position_x,
      o.position_y,
      o.animation_state,
      e.text AS entry_text,
      e.ai_summary,
      e.created_at
    FROM objects o
    JOIN entries e ON e.id = o.entry_id
    WHERE o.user_id = ${session.user.id}
      AND e.deleted_at IS NULL
    ORDER BY e.created_at ASC
  `;

  return NextResponse.json(objects);
}
