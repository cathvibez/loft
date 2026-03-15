import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import HomeClient from "./HomeClient";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const db = getDb();
  const [entries, objects] = await Promise.all([
    db`
      SELECT id, text, category, ai_summary, created_at
      FROM entries
      WHERE user_id = ${session.user.id}
        AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 20
    `,
    db`
      SELECT
        o.id, o.name, o.emoji, o.category,
        o.position_x, o.position_y, o.animation_state,
        e.text AS entry_text, e.ai_summary, e.created_at
      FROM objects o
      JOIN entries e ON e.id = o.entry_id
      WHERE o.user_id = ${session.user.id}
        AND e.deleted_at IS NULL
      ORDER BY e.created_at ASC
    `,
  ]);

  return (
    <HomeClient
      initialEntries={entries as Parameters<typeof HomeClient>[0]["initialEntries"]}
      initialObjects={objects as Parameters<typeof HomeClient>[0]["initialObjects"]}
      userName={session.user.name ?? ""}
    />
  );
}
