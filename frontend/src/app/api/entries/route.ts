import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

const SYSTEM_PROMPT = `You are The Loft's Transformation Engine. A user just wrote a daily logbook entry. Your job is to:
1. Categorize it into exactly one of: work, hobby, wellness, social
2. Write a short warm summary (1 sentence, max 80 chars)
3. Invent a cozy physical object that represents this entry in their room
4. Pick a single emoji for that object

Return ONLY valid JSON with no markdown or explanation:
{"category":"work|hobby|wellness|social","summary":"...","object_name":"...","emoji":"...","confidence":0.0}`;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await getDb()`
    SELECT id, text, category, ai_summary, created_at
    FROM entries
    WHERE user_id = ${session.user.id}
      AND deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT 50
  `;

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const text: string = body?.text ?? "";

  if (text.length < 5 || text.length > 2000) {
    return NextResponse.json(
      { error: "Entry must be between 5 and 2000 characters" },
      { status: 400 }
    );
  }

  // Upsert user row so the FK constraint is satisfied
  await getDb()`
    INSERT INTO users (id, email, name, avatar_url)
    VALUES (${session.user.id}, ${session.user.email!}, ${session.user.name ?? null}, ${session.user.image ?? null})
    ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url
  `;

  // Insert raw entry
  const [entry] = await getDb()`
    INSERT INTO entries (user_id, text)
    VALUES (${session.user.id}, ${text})
    RETURNING id, user_id, text, created_at
  `;

  // AI categorization
  let aiResult = {
    category: "work",
    summary: text.slice(0, 80),
    object_name: "Mystery object",
    emoji: "✨",
    confidence: 0.5,
  };

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    if (
      ["work", "hobby", "wellness", "social"].includes(parsed.category) &&
      parsed.object_name &&
      parsed.emoji
    ) {
      aiResult = parsed;
    }
  } catch (err) {
    console.error("OpenAI error, using fallback:", err);
  }

  // Update entry with AI results
  const [updatedEntry] = await getDb()`
    UPDATE entries
    SET category = ${aiResult.category}, ai_summary = ${aiResult.summary}
    WHERE id = ${entry.id}
    RETURNING id, user_id, text, category, ai_summary, created_at
  `;

  // Place object at a random position (avoiding edges: 20–80)
  const posX = Math.floor(Math.random() * 61) + 20;
  const posY = Math.floor(Math.random() * 61) + 20;

  const [object] = await getDb()`
    INSERT INTO objects (user_id, entry_id, name, emoji, category, position_x, position_y)
    VALUES (
      ${session.user.id},
      ${entry.id},
      ${aiResult.object_name},
      ${aiResult.emoji},
      ${aiResult.category},
      ${posX},
      ${posY}
    )
    RETURNING id, name, emoji, category, position_x, position_y, animation_state
  `;

  return NextResponse.json({ entry: updatedEntry, object }, { status: 201 });
}
