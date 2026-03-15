CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  category VARCHAR(50),
  ai_summary TEXT,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entry_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  emoji VARCHAR(10),
  category VARCHAR(50),
  position_x INT DEFAULT 50,
  position_y INT DEFAULT 50,
  animation_state VARCHAR(50) DEFAULT 'idle',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_objects_entry FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_objects_user_id ON objects(user_id);
CREATE INDEX IF NOT EXISTS idx_objects_entry_id ON objects(entry_id);
