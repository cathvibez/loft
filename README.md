# The Loft

A digital sanctuary for Gen Z tech workers.

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