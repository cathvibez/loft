# The Loft

A digital sanctuary for Gen Z tech workers.
🪴 AI-powered journaling — daily logbook entries are automatically categorized into Work / Hobby / Wellness / Social using OpenAI (gpt-4o-mini)
🎨 Generative room objects — every entry spawns 2–3 uniquely AI-illustrated objects (fal.ai FLUX) that populate a persistent, cozy 2.5D room in a consistent Studio Ghibli × Animal Crossing art style
♾️ Open-ended object generation — no fixed taxonomy; the AI freely invents novel object types on the fly rather than picking from a preset list
⚡ Shared cross-user image cache — identical object types reuse cached illustrations across all users, cutting redundant AI image-generation calls and latency
🛡️ Graceful AI degradation — 8s timeout races on all fal.ai calls plus a 3-tier fallback chain (AI image → SVG → emoji) so the UI never breaks, even during API outages
🏗️ 2.5D depth rendering engine — custom React layer that derives z-index, scale, and float animation from object position for a game-like sense of depth

## Setup

### Prerequisites

- Node.js
- Docker

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the services: `docker-compose up -d`

### Database Setup

The project uses PostgreSQL. After starting Docker Compose, the database will be available at:

- Host: localhost
- Port: 5432
- Database: the_loft
- Username: loft_user
- Password: loft_password

#### VS Code Database Connection

VS Code is the easiest way to connect to the database:

1. Install the SQLTools extension
2. Install SQLTools PostgreSQL/Cockroach Driver extension
3. Click the SQLTools icon in the sidebar → Add New Connection
4. Fill in:
   - Connection name: anything (e.g. the_loft)
   - Host: localhost
   - Port: 5432
   - Database: the_loft
   - Username: loft_user
   - Password: loft_password
5. Click Test Connection → Save

### Development

Run the development server: `npm run dev`

Build for production: `npm run build`
