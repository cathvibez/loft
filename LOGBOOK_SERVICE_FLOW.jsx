import React, { useState } from 'react';
import { ArrowRight, Database, Zap, MessageSquare, CheckCircle } from 'lucide-react';

export default function LogbookServiceFlow() {
  const [expandedStep, setExpandedStep] = useState(0);

  const steps = [
    {
      title: 'User Submits Entry',
      icon: MessageSquare,
      description: 'Text-based daily logbook entry',
      details: [
        'Frontend sends POST /api/entries',
        'Contains: user_id, text (5-2000 chars)',
        'Example: "Debugged React, took a walk"'
      ],
      code: `POST /api/entries
{
  "user_id": "550e8400-...",
  "text": "Spent 3 hours debugging..."
}`
    },
    {
      title: 'Save Raw Entry',
      icon: Database,
      description: 'Store in PostgreSQL',
      details: [
        'Create row in "entries" table',
        'Generate unique entry ID',
        'Record timestamp',
        'No categorization yet (async)'
      ],
      code: `INSERT INTO entries
  (id, user_id, text, created_at)
VALUES (uuid, user_id, text, NOW())`
    },
    {
      title: 'AI Categorization',
      icon: Zap,
      description: 'Call OpenAI GPT-4o mini',
      details: [
        'Send entry text + prompt to OpenAI',
        'Prompt: categorize + generate object',
        'Returns: category, summary, emoji',
        'Takes ~1-2 seconds'
      ],
      code: `const result = await openai.messages.create({
  model: "claude-opus-4-20250514",
  messages: [{ role: "user", content: prompt }]
});
// Returns:
// {
//   category: "work",
//   summary: "...",
//   object_name: "A laptop with sticky notes",
//   emoji: "💻"
// }`
    },
    {
      title: 'Update Entry + Create Object',
      icon: Database,
      description: 'Store AI results',
      details: [
        'Update entry with category + summary',
        'Create "objects" row (visual representation)',
        'Set random position (x, y)',
        'Loft State Service will refine later'
      ],
      code: `UPDATE entries SET category=$1, ai_summary=$2
  WHERE id=$3;

INSERT INTO objects
  (id, user_id, entry_id, name, emoji, ...)
VALUES (uuid, user_id, entry_id, "A laptop...", "💻", ...)`
    },
    {
      title: 'Return to Frontend',
      icon: CheckCircle,
      description: 'Client receives object',
      details: [
        'Frontend gets entry + object + categorization',
        'Can immediately show "pending" object',
        'Animation adds item to Loft room',
        'Loft State Service will aggregate later'
      ],
      code: `{
  "success": true,
  "data": {
    "entry": { ... },
    "object": {
      "id": "uuid",
      "name": "A laptop with sticky notes",
      "emoji": "💻",
      "position_x": 42,
      "position_y": 73
    }
  }
}`
    }
  ];

  const categoryExamples = [
    {
      category: 'work',
      examples: ['Debugged a React bug', 'Finished sprint planning', 'Code review with team'],
      objects: ['💻 A laptop with sticky notes', '📋 A stack of design mockups', '☕ A half-empty coffee cup']
    },
    {
      category: 'hobby',
      examples: ['Read a book chapter', 'Worked on side project', 'Sketched character designs'],
      objects: ['📚 A dog-eared paperback', '🎮 A game controller', '🎨 A sketchbook with colored pencils']
    },
    {
      category: 'wellness',
      examples: ['10k run this morning', 'Meditation session', 'Got 8 hours of sleep'],
      objects: ['🏃 Running shoes with sweat', '🧘 A yoga mat rolled up', '🌱 A potted plant']
    },
    {
      category: 'social',
      examples: ['Coffee with an old friend', 'Family dinner', 'Attended meetup'],
      objects: ['📸 A Polaroid photo', '🎂 A slice of birthday cake', '💌 A handwritten letter']
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5ede3 0%, #faf8f3 100%)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#d4c5b0' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-serif mb-2" style={{ color: '#2d3528' }}>
            Logbook Service: The Transformation Engine
          </h1>
          <p className="text-lg" style={{ color: '#6b6b63' }}>
            How a daily text entry becomes a cozy object in your Loft room
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Flow Diagram */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-8" style={{ color: '#2d3528' }}>
            5-Step Flow
          </h2>

          <div className="space-y-4">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              const isExpanded = expandedStep === idx;

              return (
                <div
                  key={idx}
                  className="rounded-lg border-2 overflow-hidden transition-all"
                  style={{ borderColor: '#d4c5b0' }}
                >
                  <button
                    onClick={() => setExpandedStep(isExpanded ? -1 : idx)}
                    className="w-full text-left p-6 flex items-center justify-between transition-colors"
                    style={{ background: isExpanded ? '#faf8f3' : '#ffffff' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ background: '#f0e8d8' }}>
                        <IconComponent size={24} style={{ color: '#2d3528' }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif" style={{ color: '#2d3528' }}>
                          {idx + 1}. {step.title}
                        </h3>
                        <p className="text-sm" style={{ color: '#6b6b63' }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      size={20}
                      style={{
                        color: '#6b6b63',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 300ms'
                      }}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 border-t-2" style={{ borderColor: '#d4c5b0' }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <p className="font-mono text-xs uppercase mb-2" style={{ color: '#6b6b63' }}>
                            Details
                          </p>
                          <ul className="space-y-1 text-sm" style={{ color: '#2d3528' }}>
                            {step.details.map((detail, i) => (
                              <li key={i}>✓ {detail}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-mono text-xs uppercase mb-2" style={{ color: '#6b6b63' }}>
                            Code/SQL
                          </p>
                          <pre className="p-3 rounded text-xs overflow-x-auto" style={{ background: '#f0e8d8', color: '#2d3528', fontFamily: 'monospace' }}>
                            {step.code}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Categorization Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-8" style={{ color: '#2d3528' }}>
            Categorization Examples
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryExamples.map((cat) => (
              <div
                key={cat.category}
                className="p-6 rounded-lg border-2"
                style={{ borderColor: '#d4c5b0', background: '#ffffff' }}
              >
                <h3 className="text-lg font-serif mb-4 uppercase" style={{ color: '#2d3528' }}>
                  {cat.category}
                </h3>

                <div className="mb-4">
                  <p className="font-mono text-xs uppercase mb-2" style={{ color: '#6b6b63' }}>
                    User says
                  </p>
                  <ul className="text-sm space-y-1" style={{ color: '#2d3528' }}>
                    {cat.examples.map((ex, i) => (
                      <li key={i}>→ {ex}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-mono text-xs uppercase mb-2" style={{ color: '#6b6b63' }}>
                    Object appears
                  </p>
                  <ul className="text-sm space-y-1" style={{ color: '#2d3528' }}>
                    {cat.objects.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Implementation Details */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-8" style={{ color: '#2d3528' }}>
            Implementation Details
          </h2>

          <div className="space-y-4">
            {[
              {
                title: 'Stack',
                items: [
                  'Node.js + Express.js (lightweight, fast)',
                  'PostgreSQL (via Supabase)',
                  'OpenAI API (GPT-4o mini for categorization)',
                  'TypeScript (type safety)'
                ]
              },
              {
                title: 'API Endpoints',
                items: [
                  'POST /api/entries — Submit new entry',
                  'GET /api/entries — List all user entries',
                  'GET /api/entries/:id — Get single entry',
                  'DELETE /api/entries/:id — Soft delete entry'
                ]
              },
              {
                title: 'Performance',
                items: [
                  'AI call: ~1-2 seconds per entry',
                  'Database queries: <100ms (indexed)',
                  'Total response time: ~2-3 seconds',
                  'Future: Async queuing for faster response'
                ]
              },
              {
                title: 'Security',
                items: [
                  'OpenAI API key stored server-side only',
                  'Supabase RLS: Users only see own entries',
                  'Input validation: 5-2000 character limit',
                  'Rate limiting: Coming soon'
                ]
              }
            ].map((section) => (
              <div
                key={section.title}
                className="p-6 rounded-lg border-2"
                style={{ borderColor: '#d4c5b0', background: '#ffffff' }}
              >
                <h3 className="font-serif text-lg mb-3" style={{ color: '#2d3528' }}>
                  {section.title}
                </h3>
                <ul className="text-sm space-y-1" style={{ color: '#2d3528' }}>
                  {section.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        <div className="p-8 rounded-lg border-2" style={{ borderColor: '#d4c5b0', background: '#faf8f3' }}>
          <p className="font-serif text-lg mb-3" style={{ color: '#2d3528' }}>
            🚀 What's Next
          </p>
          <p style={{ color: '#6b6b63' }} className="text-sm leading-relaxed">
            <strong>1. Set up environment:</strong> Copy `.env.example`, add `OPENAI_API_KEY`<br/>
            <strong>2. Start local:</strong> `npm install && npm run dev`<br/>
            <strong>3. Test endpoints:</strong> Use cURL or Postman (see API.md)<br/>
            <strong>4. Connect frontend:</strong> Call `/api/entries` from React<br/>
            <strong>5. Build Loft State Service:</strong> Listens for new entries, aggregates room
          </p>
        </div>
      </div>
    </div>
  );
}
